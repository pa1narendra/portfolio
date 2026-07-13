"use client";

import { useEffect, useRef } from "react";

// Full-screen liquid feel, artifact-proof: no simulation grid at all.
// The pastel field is drawn procedurally and displaced by a trail of
// smooth gaussian kernels laid along the cursor's recent path. Pure math
// per pixel — it cannot alias, band, or grow "worms" on any GPU.

const TRAIL = 28; // kernel count
const DECAY = 1.3; // slightly slower fade so the wake lingers
const RADIUS = 0.068; // kernel size (uv units, aspect-corrected)
const STRENGTH = 0.72; // displacement scale

const VERT = `#version 300 es
precision highp float;
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform vec4 uTrail[${TRAIL}];   /* xy: position, zw: direction*strength */
uniform float uTime; uniform float aspect;
float blob(vec2 uv, vec2 c, float r){
  vec2 d = uv - c; d.x *= aspect;
  return smoothstep(r, 0.0, length(d));
}
void main(){
  /* displacement from the cursor trail — smooth gaussians, no texture */
  vec2 disp = vec2(0.0);
  for (int i = 0; i < ${TRAIL}; i++) {
    vec2 d = vUv - uTrail[i].xy;
    d.x *= aspect;
    float w = exp(-dot(d,d) / (${RADIUS.toFixed(4)} * ${RADIUS.toFixed(4)}));
    disp += uTrail[i].zw * w;
  }
  /* gentle idle currents so it breathes on its own */
  float t = uTime * 0.25;
  disp += 0.004 * vec2(sin(vUv.y*4.0 + t), cos(vUv.x*3.0 - t*0.8));
  vec2 uv = vUv - disp * ${STRENGTH.toFixed(3)};

  /* the page's pastel field */
  float tt = uTime * 0.05;
  vec2 c1 = vec2(0.13 + 0.05*sin(tt),      0.84 + 0.04*cos(tt*0.8));
  vec2 c2 = vec2(0.88 + 0.06*cos(tt*0.7),  0.14 + 0.05*sin(tt*0.9));
  vec2 c3 = vec2(0.70 + 0.04*sin(tt*1.15), 0.60 + 0.06*cos(tt*0.6));
  vec3 col = vec3(0.945, 0.941, 0.961);
  col = mix(col, vec3(0.830, 0.808, 0.933), blob(uv, c1, 0.55) * 0.70);
  col = mix(col, vec3(0.947, 0.866, 0.795), blob(uv, c2, 0.60) * 0.62);
  col = mix(col, vec3(0.810, 0.867, 0.908), blob(uv, c3, 0.40) * 0.53);
  /* glassy shading + highlight where the surface is being pushed */
  float m = length(disp);
  col -= vec3(0.042, 0.040, 0.034) * smoothstep(0.0, 0.05, m);
  col += vec3(0.026) * smoothstep(0.012, 0.09, m);
  o = vec4(col, 1.0);
}`;

export default function FluidTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // phones/tablets get the static washes only — no WebGL loop at all
    if (window.matchMedia("(max-width: 899px), (pointer: coarse)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;
    canvas.classList.add("fluid-on");

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uTrail = gl.getUniformLocation(prog, "uTrail");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uAspect = gl.getUniformLocation(prog, "aspect");

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // ring buffer of trail samples: x, y, dirX*str, dirY*str
    const trail = new Float32Array(TRAIL * 4);
    let head = 0;
    const pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = 1 - e.clientY / window.innerHeight;
      pointer.moved = true;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let last = performance.now();
    const t0 = last;
    let lastScroll = window.scrollY;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // scrolling stirs the liquid: swells sweep across the screen
      const scrollNow = window.scrollY;
      const sv = (scrollNow - lastScroll) / window.innerHeight;
      lastScroll = scrollNow;
      if (Math.abs(sv) > 0.002) {
        const s = Math.max(-0.055, Math.min(0.055, sv * 0.9));
        const phase = (now / 900) % 1;
        for (let n = 0; n < 3; n++) {
          const x = ((n + 0.5) / 3 + phase * 0.2) % 1;
          trail[head * 4] = x;
          trail[head * 4 + 1] = 0.35 + 0.3 * Math.sin(now / 700 + n * 2.1);
          trail[head * 4 + 2] = (n - 1) * 0.012;
          trail[head * 4 + 3] = s;
          head = (head + 1) % TRAIL;
        }
      }

      // decay all samples
      const k = Math.exp(-DECAY * dt * 2.2);
      for (let i = 0; i < TRAIL; i++) {
        trail[i * 4 + 2] *= k;
        trail[i * 4 + 3] *= k;
      }

      // lay new samples along the path travelled this frame
      if (pointer.moved) {
        pointer.moved = false;
        const dx = pointer.x - pointer.px;
        const dy = pointer.y - pointer.py;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.0004) {
          const steps = Math.min(6, Math.max(1, Math.ceil(dist * 60)));
          const s = Math.min(0.075, dist * 2.0);
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            trail[head * 4] = pointer.px + dx * t;
            trail[head * 4 + 1] = pointer.py + dy * t;
            trail[head * 4 + 2] = (dx / dist) * s;
            trail[head * 4 + 3] = (dy / dist) * s;
            head = (head + 1) % TRAIL;
          }
        }
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }

      gl.uniform4fv(uTrail, trail);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uAspect, canvas.width / canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
