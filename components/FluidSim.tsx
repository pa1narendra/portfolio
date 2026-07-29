"use client";

import { useEffect, useRef } from "react";

// A small pond of very thick oil behind the page. This is deliberately NOT
// a water simulation: there is no advection, no pressure, no vorticity, so
// a disturbance can never become a current or a little cyclone. The cursor
// dents a displacement field, the dent oozes outward a touch (diffusion),
// and density pulls it flat again (decay). Nothing moves unless you move.
// Rendering is displacement-only: the field warps the pastel gradient and
// nothing at simulation resolution is ever drawn directly.
// Desktop-only; reduced-motion and touch devices keep the static washes.

const SIM_RES = 160;
// the surface is a damped wave membrane: a disturbance detaches from the
// cursor and travels on its own physics — blooming, interfering, melting.
const WAVE_SPEED = 18; // texels/s — how fast a disturbance travels (slow = thick)
const VEL_DAMP = 1.25; // 1/s — the oil eats the wave's energy
const DENT_DECAY = 0.5; // 1/s — the surface itself pulls flat
const SPLAT_RADIUS = 0.003; // disturbance width at the point of contact (~70% of before)
const SPLAT_PUSH = 6.5; // dent strength per unit of pointer motion
const MAX_DENT = 1.0; // hard cap on field magnitude — oil never overshoots
const DISTORT = 0.016; // max warp at full dent, a small fraction of the screen
// the dent charges with sustained movement: a flick barely marks the surface
const STIR_CHARGE = 22;
const STIR_DECAY = 3.0;
const STIR_FLOOR = 0.18;

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

const FRAG = {
  // adds a disturbance while preserving the wave's velocity channels
  splat: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main(){
  vec2 p = vUv - point; p.x *= aspect;
  vec3 splat = exp(-dot(p,p)/radius) * color;
  o = texture(uTarget, vUv) + vec4(splat.xy, 0., 0.);
}`,
  // the physics: a damped vector wave equation. xy = surface displacement,
  // zw = its velocity. A disturbance propagates outward on its own,
  // interferes with itself, and is eaten by the oil's damping. Nothing
  // follows the cursor — the cursor only plants the disturbance.
  wave: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uField; uniform vec2 texelSize; uniform float dt; uniform float c2; uniform float velDamp; uniform float decay; uniform float maxDent;
void main(){
  vec4 C = texture(uField, vUv);
  vec2 L = texture(uField, vUv - vec2(texelSize.x,0.)).xy;
  vec2 R = texture(uField, vUv + vec2(texelSize.x,0.)).xy;
  vec2 B = texture(uField, vUv - vec2(0.,texelSize.y)).xy;
  vec2 T = texture(uField, vUv + vec2(0.,texelSize.y)).xy;
  vec2 lap = L + R + B + T - 4.0 * C.xy;
  vec2 vel = (C.zw + lap * c2 * dt) * exp(-velDamp * dt);
  vec2 dent = (C.xy + vel * dt) * exp(-decay * dt);
  float m = length(dent);
  if (m > maxDent) dent *= maxDent / m;
  o = vec4(dent, vel);
}`,
  // the visible part: the dent field refracts the wash with a slight
  // chromatic split, and where the surface is disturbed a thin oil-film
  // sheen appears (lusion-style trail). The field is smooth, clamped and
  // linearly filtered, and no derivative of it is ever shaded, so the sim
  // grid can never print artifacts.
  display: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uField;
uniform float uTime; uniform float aspect; uniform float distort;
float blob(vec2 uv, vec2 c, float r){
  vec2 d = uv - c; d.x *= aspect;
  return smoothstep(r, 0.0, length(d));
}
vec3 wash(vec2 uv, float t){
  vec2 c1 = vec2(0.13 + 0.05*sin(t),      0.84 + 0.04*cos(t*0.8));
  vec2 c2 = vec2(0.88 + 0.06*cos(t*0.7),  0.14 + 0.05*sin(t*0.9));
  vec2 c3 = vec2(0.70 + 0.04*sin(t*1.15), 0.60 + 0.06*cos(t*0.6));
  vec3 col = vec3(0.945, 0.941, 0.961);
  col = mix(col, vec3(0.830, 0.808, 0.933), blob(uv, c1, 0.55) * 0.70);
  col = mix(col, vec3(0.947, 0.866, 0.795), blob(uv, c2, 0.60) * 0.62);
  col = mix(col, vec3(0.810, 0.867, 0.908), blob(uv, c3, 0.40) * 0.53);
  return col;
}
void main(){
  vec2 dent = texture(uField, vUv).xy;
  float t = uTime * 0.05;
  // refraction with a slight chromatic split, like light through glass
  vec3 col;
  col.r = wash(vUv - dent * distort * 1.25, t).r;
  col.g = wash(vUv - dent * distort,        t).g;
  col.b = wash(vUv - dent * distort * 0.75, t).b;
  // thin-film sheen: pearlescent color that lives where the dent is,
  // trails the disturbance and melts away with it
  float m = length(dent);
  float film = smoothstep(0.006, 0.4, m);
  vec3 rainbow = vec3(0.5) + 0.5 * cos(6.28318 * (m * 1.4 + vec3(0.00, 0.33, 0.67)) + uTime * 0.15);
  vec3 sheen = mix(vec3(0.93, 0.92, 0.94), rainbow, 0.45); // pearl, not neon
  col = mix(col, sheen, film * 0.14);
  o = vec4(col, 1.0);
}`,
};

export default function FluidSim() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // lite devices keep the static washes — no WebGL at all
    if (window.matchMedia("(max-width: 899px), (pointer: coarse)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;
    if (!gl.getExtension("EXT_color_buffer_float")) return;
    canvas.classList.add("fluid-on");

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const programs: Record<string, { p: WebGLProgram; u: Record<string, WebGLUniformLocation> }> = {};
    for (const [name, src] of Object.entries(FRAG)) {
      const p = gl.createProgram()!;
      gl.attachShader(p, vert);
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, src));
      gl.linkProgram(p);
      const u: Record<string, WebGLUniformLocation> = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(p, i)!;
        u[info.name] = gl.getUniformLocation(p, info.name)!;
      }
      programs[name] = { p, u };
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    type FBO = { fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };
    const createFBO = (w: number, h: number): FBO => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { fb, tex, w, h };
    };

    const simW = SIM_RES;
    const simH = Math.max(32, Math.round(SIM_RES / (window.innerWidth / window.innerHeight)));
    let a = createFBO(simW, simH);
    let b = createFBO(simW, simH);
    const field = {
      get read() { return a; },
      get write() { return b; },
      swap() { const t = a; a = b; b = t; },
    };

    const aspect = () => canvas.width / canvas.height;

    const blit = (target: FBO | null) => {
      if (target) {
        gl.viewport(0, 0, target.w, target.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
      } else {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const bindTex = (u: WebGLUniformLocation, tex: WebGLTexture, unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(u, unit);
    };

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    // raw pointer + an eased follower: the trail is laid along the smooth
    // lagged path, not the jittery raw one — that is what makes it buttery
    const pointer = { x: 0.5, y: 0.5, seen: false };
    const smooth = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, live: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = 1 - e.clientY / window.innerHeight;
      if (!smooth.live) {
        smooth.live = true;
        smooth.x = smooth.px = pointer.x;
        smooth.y = smooth.py = pointer.y;
      }
      pointer.seen = true;
    };
    window.addEventListener("pointermove", onMove);

    const dent = (x: number, y: number, dx: number, dy: number) => {
      const sp = programs.splat;
      gl.useProgram(sp.p);
      gl.uniform1f(sp.u.aspect, aspect());
      gl.uniform2f(sp.u.point, x, y);
      gl.uniform1f(sp.u.radius, SPLAT_RADIUS);
      bindTex(sp.u.uTarget, field.read.tex, 0);
      gl.uniform3f(sp.u.color, dx, dy, 0);
      blit(field.write);
      field.swap();
    };

    let last = performance.now();
    let stir = 0; // 0..1 energy from sustained pointer movement
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      stir = Math.max(0, stir - stir * STIR_DECAY * dt);
      if (smooth.live) {
        // ease the follower toward the raw pointer; the lag is the grace
        const k = 1 - Math.exp(-9 * dt);
        smooth.x += (pointer.x - smooth.x) * k;
        smooth.y += (pointer.y - smooth.y) * k;
        const dx = smooth.x - smooth.px;
        const dy = smooth.y - smooth.py;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.00015) {
          stir = Math.min(1, stir + dist * STIR_CHARGE);
          const push = SPLAT_PUSH * (STIR_FLOOR + (1 - STIR_FLOOR) * stir);
          // lay dents so densely along the eased path that they read as one
          // continuous stroke, never a row of stamps
          const steps = Math.min(28, Math.max(1, Math.ceil(dist / (Math.sqrt(SPLAT_RADIUS) * 0.35))));
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            dent(
              smooth.px + dx * t,
              smooth.py + dy * t,
              (dx / dist) * push * Math.min(dist * 8, 1),
              (dy / dist) * push * Math.min(dist * 8, 1),
            );
          }
        }
        smooth.px = smooth.x;
        smooth.py = smooth.y;
      }

      // the ongoing physics: the wave travels, interferes, and dies out
      const pr = programs.wave;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, 1 / simW, 1 / simH);
      gl.uniform1f(pr.u.dt, dt);
      gl.uniform1f(pr.u.c2, WAVE_SPEED * WAVE_SPEED);
      gl.uniform1f(pr.u.velDamp, VEL_DAMP);
      gl.uniform1f(pr.u.decay, DENT_DECAY);
      gl.uniform1f(pr.u.maxDent, MAX_DENT);
      bindTex(pr.u.uField, field.read.tex, 0);
      blit(field.write);
      field.swap();

      const dp = programs.display;
      gl.useProgram(dp.p);
      gl.uniform1f(dp.u.uTime, (now - t0) / 1000);
      gl.uniform1f(dp.u.aspect, aspect());
      gl.uniform1f(dp.u.distort, DISTORT);
      bindTex(dp.u.uField, field.read.tex, 0);
      blit(null);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fluid" aria-hidden="true" />;
}
