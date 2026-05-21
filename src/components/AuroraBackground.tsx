import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* Aurora borealis shader background — runs fixed behind all page content.
   Opacity is kept low so it reads as atmosphere, not foreground. */
export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current!;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });

    /* Render at half resolution for performance, CSS scales it up */
    const DPR = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.inset    = '0';
    renderer.domElement.style.width    = '100%';
    renderer.domElement.style.height   = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex   = '0';
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        iTime:       { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth * DPR, window.innerHeight * DPR) },
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 3

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u  = fract(p);
          u = u * u * (3.0 - 2.0 * u);
          return mix(
            mix(rand(ip), rand(ip + vec2(1,0)), u.x),
            mix(rand(ip + vec2(0,1)), rand(ip + vec2(1,1)), u.x), u.y);
        }
        float fbm(vec2 x) {
          float v = 0.0; float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }
        void main() {
          vec2 p = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y
                   * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);
          float f = 2.0 + fbm(p + vec2(iTime * 4.0, 0.0)) * 0.5;

          for (float i = 0.0; i < 28.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.06) * 0.020 + i * vec2(13.0, 11.0)) * 3.0;
            vec4 col = vec4(
              0.05 + 0.18 * sin(i * 0.18 + iTime * 0.3),
              0.15 + 0.28 * cos(i * 0.22 + iTime * 0.4),
              0.42 + 0.22 * sin(i * 0.30 + iTime * 0.25),
              1.0);
            o += col * exp(sin(i * i + iTime * 0.6)) / length(max(v, vec2(v.x * f * 0.014, v.y * 1.4)));
          }

          o = tanh(pow(o / 120.0, vec4(1.5)));
          /* Alpha is kept at 0.28 so the dark page bg stays dominant */
          gl_FragColor = vec4(o.rgb, o.r * 0.28 + o.g * 0.18 + o.b * 0.32);
        }
      `,
    });

    const geo  = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    let frameId: number;
    let paused = false;

    /* Pause when tab is hidden — saves battery on mobile */
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (paused) return;
      material.uniforms.iTime.value += 0.012;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight;
      renderer.setSize(W, H);
      material.uniforms.iResolution.value.set(W * DPR, H * DPR);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
