"use client";

import { useEffect, useRef } from "react";

// A real fluid simulation behind the page. Stir with the cursor and the
// liquid keeps moving — it swirls with momentum, then slowly dissolves
// back to calm. Rendering is displacement-only: the velocity field warps
// the smooth pastel gradient, and nothing derivative (curl, magnitude
// shading) is ever drawn, so the sim grid can't print artifacts.
// Desktop-only; reduced-motion and touch devices keep the static washes.

const SIM_RES = 160;
const PRESSURE_ITERS = 22;
const VEL_DISSIPATION = 0.58; // how fast the liquid dissolves back to rest
const CURL = 16; // vorticity confinement — the swirl character
const SPLAT_RADIUS = 0.012;
const SPLAT_FORCE = 2600;
const DISTORT = 0.00082;
// distortion earns its strength: a single flick barely registers, only
// sustained movement charges the stir up to full force (lusion behavior)
const STIR_CHARGE = 26; // how quickly continuous motion builds energy
const STIR_DECAY = 2.6; // how quickly energy drains once the mouse rests
const STIR_FLOOR = 0.12; // fraction of force a cold start still applies

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

const FRAG = {
  splat: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main(){
  vec2 p = vUv - point; p.x *= aspect;
  vec3 splat = exp(-dot(p,p)/radius) * color;
  o = vec4(texture(uTarget, vUv).xyz + splat, 1.);
}`,
  advect: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main(){
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  o = texture(uSource, coord) / (1. + dissipation * dt);
}`,
  divergence: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity; uniform vec2 texelSize;
void main(){
  float L = texture(uVelocity, vUv - vec2(texelSize.x,0.)).x;
  float R = texture(uVelocity, vUv + vec2(texelSize.x,0.)).x;
  float B = texture(uVelocity, vUv - vec2(0.,texelSize.y)).y;
  float T = texture(uVelocity, vUv + vec2(0.,texelSize.y)).y;
  o = vec4(0.5*(R-L+T-B),0.,0.,1.);
}`,
  curl: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity; uniform vec2 texelSize;
void main(){
  float L = texture(uVelocity, vUv - vec2(texelSize.x,0.)).y;
  float R = texture(uVelocity, vUv + vec2(texelSize.x,0.)).y;
  float B = texture(uVelocity, vUv - vec2(0.,texelSize.y)).x;
  float T = texture(uVelocity, vUv + vec2(0.,texelSize.y)).x;
  o = vec4(0.5*(R-L-T+B),0.,0.,1.);
}`,
  vorticity: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform vec2 texelSize; uniform float curl; uniform float dt;
void main(){
  float L = texture(uCurl, vUv - vec2(texelSize.x,0.)).x;
  float R = texture(uCurl, vUv + vec2(texelSize.x,0.)).x;
  float B = texture(uCurl, vUv - vec2(0.,texelSize.y)).x;
  float T = texture(uCurl, vUv + vec2(0.,texelSize.y)).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
  force /= length(force)+1e-4; force *= curl*C; force.y *= -1.;
  vec2 vel = texture(uVelocity, vUv).xy + force*dt;
  o = vec4(clamp(vel,-1000.,1000.),0.,1.);
}`,
  pressure: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uPressure; uniform sampler2D uDivergence; uniform vec2 texelSize;
void main(){
  float L = texture(uPressure, vUv - vec2(texelSize.x,0.)).x;
  float R = texture(uPressure, vUv + vec2(texelSize.x,0.)).x;
  float B = texture(uPressure, vUv - vec2(0.,texelSize.y)).x;
  float T = texture(uPressure, vUv + vec2(0.,texelSize.y)).x;
  float div = texture(uDivergence, vUv).x;
  o = vec4((L+R+B+T-div)*0.25,0.,0.,1.);
}`,
  gradient: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uPressure; uniform sampler2D uVelocity; uniform vec2 texelSize;
void main(){
  float L = texture(uPressure, vUv - vec2(texelSize.x,0.)).x;
  float R = texture(uPressure, vUv + vec2(texelSize.x,0.)).x;
  float B = texture(uPressure, vUv - vec2(0.,texelSize.y)).x;
  float T = texture(uPressure, vUv + vec2(0.,texelSize.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy - vec2(R-L,T-B);
  o = vec4(vel,0.,1.);
}`,
  // pure displacement of the pastel field — no curl or magnitude shading,
  // so nothing at simulation resolution is ever directly visible
  display: `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity;
uniform float uTime; uniform float aspect; uniform float distort;
float blob(vec2 uv, vec2 c, float r){
  vec2 d = uv - c; d.x *= aspect;
  return smoothstep(r, 0.0, length(d));
}
void main(){
  vec2 vel = texture(uVelocity, vUv).xy;
  vec2 uv = vUv - vel * distort;
  float t = uTime * 0.05;
  vec2 c1 = vec2(0.13 + 0.05*sin(t),      0.84 + 0.04*cos(t*0.8));
  vec2 c2 = vec2(0.88 + 0.06*cos(t*0.7),  0.14 + 0.05*sin(t*0.9));
  vec2 c3 = vec2(0.70 + 0.04*sin(t*1.15), 0.60 + 0.06*cos(t*0.6));
  vec3 col = vec3(0.945, 0.941, 0.961);
  col = mix(col, vec3(0.830, 0.808, 0.933), blob(uv, c1, 0.55) * 0.70);
  col = mix(col, vec3(0.947, 0.866, 0.795), blob(uv, c2, 0.60) * 0.62);
  col = mix(col, vec3(0.810, 0.867, 0.908), blob(uv, c3, 0.40) * 0.53);
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
    const createFBO = (w: number, h: number, internal: number, format: number): FBO => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { fb, tex, w, h };
    };
    const doubleFBO = (w: number, h: number, internal: number, format: number) => {
      let a = createFBO(w, h, internal, format);
      let b = createFBO(w, h, internal, format);
      return {
        get read() { return a; },
        get write() { return b; },
        swap() { const t = a; a = b; b = t; },
      };
    };

    const aspect = () => canvas.width / canvas.height;
    const simW = SIM_RES;
    const simH = Math.max(32, Math.round(SIM_RES / (window.innerWidth / window.innerHeight)));

    const velocity = doubleFBO(simW, simH, gl.RG16F, gl.RG);
    const pressure = doubleFBO(simW, simH, gl.R16F, gl.RED);
    const divergence = createFBO(simW, simH, gl.R16F, gl.RED);
    const curlFBO = createFBO(simW, simH, gl.R16F, gl.RED);

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

    // continuous stirring: forces laid along the cursor's path each frame
    const pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = 1 - e.clientY / window.innerHeight;
      pointer.moved = true;
    };
    window.addEventListener("pointermove", onMove);

    const splatVelocity = (x: number, y: number, dx: number, dy: number) => {
      const sp = programs.splat;
      gl.useProgram(sp.p);
      gl.uniform1f(sp.u.aspect, aspect());
      gl.uniform2f(sp.u.point, x, y);
      gl.uniform1f(sp.u.radius, SPLAT_RADIUS);
      bindTex(sp.u.uTarget, velocity.read.tex, 0);
      gl.uniform3f(sp.u.color, dx, dy, 0);
      blit(velocity.write);
      velocity.swap();
    };

    // a gentle wake-up stir so the page is alive before the first move
    splatVelocity(0.6, 0.6, 150, -95);
    splatVelocity(0.35, 0.4, -120, 110);

    let last = performance.now();
    let ambient = 0;
    let stir = 0; // 0..1 energy from sustained pointer movement
    let lastScroll = window.scrollY;
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      stir = Math.max(0, stir - stir * STIR_DECAY * dt);
      if (pointer.moved) {
        pointer.moved = false;
        const dx = pointer.x - pointer.px;
        const dy = pointer.y - pointer.py;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.0003) {
          stir = Math.min(1, stir + dist * STIR_CHARGE);
          const force = SPLAT_FORCE * (STIR_FLOOR + (1 - STIR_FLOOR) * stir);
          const steps = Math.min(14, Math.max(1, Math.ceil(dist * 140)));
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            splatVelocity(
              pointer.px + dx * t,
              pointer.py + dy * t,
              (dx * force) / steps,
              (dy * force) / steps,
            );
          }
        }
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }

      // scrolling stirs the liquid too
      const scrollNow = window.scrollY;
      const sv = (scrollNow - lastScroll) / window.innerHeight;
      lastScroll = scrollNow;
      if (Math.abs(sv) > 0.002) {
        const s = Math.max(-100, Math.min(100, sv * 1500));
        for (let n = 0; n < 3; n++) {
          splatVelocity(
            0.2 + 0.3 * n + 0.05 * Math.sin(now / 700 + n * 2.1),
            0.35 + 0.3 * Math.sin(now / 900 + n),
            (n - 1) * 30,
            s,
          );
        }
      }

      // ambient life every few seconds so the liquid never fully dies
      ambient += dt;
      if (ambient > 5.2) {
        ambient = 0;
        splatVelocity(
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 150,
        );
      }

      const texel: [number, number] = [1 / simW, 1 / simH];

      let pr = programs.curl;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, ...texel);
      bindTex(pr.u.uVelocity, velocity.read.tex, 0);
      blit(curlFBO);

      pr = programs.vorticity;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, ...texel);
      gl.uniform1f(pr.u.curl, CURL);
      gl.uniform1f(pr.u.dt, dt);
      bindTex(pr.u.uVelocity, velocity.read.tex, 0);
      bindTex(pr.u.uCurl, curlFBO.tex, 1);
      blit(velocity.write);
      velocity.swap();

      pr = programs.divergence;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, ...texel);
      bindTex(pr.u.uVelocity, velocity.read.tex, 0);
      blit(divergence);

      pr = programs.pressure;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, ...texel);
      bindTex(pr.u.uDivergence, divergence.tex, 1);
      for (let i = 0; i < PRESSURE_ITERS; i++) {
        bindTex(pr.u.uPressure, pressure.read.tex, 0);
        blit(pressure.write);
        pressure.swap();
      }

      pr = programs.gradient;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, ...texel);
      bindTex(pr.u.uPressure, pressure.read.tex, 0);
      bindTex(pr.u.uVelocity, velocity.read.tex, 1);
      blit(velocity.write);
      velocity.swap();

      pr = programs.advect;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, ...texel);
      gl.uniform1f(pr.u.dt, dt);
      gl.uniform1f(pr.u.dissipation, VEL_DISSIPATION);
      bindTex(pr.u.uVelocity, velocity.read.tex, 0);
      bindTex(pr.u.uSource, velocity.read.tex, 0);
      blit(velocity.write);
      velocity.swap();

      pr = programs.display;
      gl.useProgram(pr.p);
      gl.uniform1f(pr.u.uTime, (now - t0) / 1000);
      gl.uniform1f(pr.u.aspect, aspect());
      gl.uniform1f(pr.u.distort, DISTORT);
      bindTex(pr.u.uVelocity, velocity.read.tex, 0);
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
