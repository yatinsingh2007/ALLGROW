'use client';

import { useRef, useEffect } from 'react';
import type { Renderer, Mesh } from 'ogl';

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] }; // top-center
  }
};

type Uniforms = {
  [key: string]: { value: any };
};

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Uniforms>();
  const rendererRef = useRef<Renderer>();
  const meshRef = useRef<Mesh>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number>();
  const cleanupRef = useRef<() => void>();

  // Mouse tracking
  useEffect(() => {
    if (!followMouse) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [followMouse]);

  // WebGL initialization
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    let isMounted = true;

    const initWebGL = async () => {
      const { Renderer, Program, Triangle, Mesh } = await import('ogl');
      if (!isMounted || !containerRef.current) return;

      // Renderer
      const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
      rendererRef.current = renderer;
      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(gl.canvas);

      // Shaders
      const vert = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }`;
      const frag = `precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 rayPos;
        uniform vec2 rayDir;
        uniform vec3 raysColor;
        uniform float raysSpeed;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        uniform float fadeDistance;
        uniform float saturation;
        uniform vec2 mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;
        varying vec2 vUv;
        float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
        float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed){
          vec2 sourceToCoord = coord - raySource;
          vec2 dirNorm = normalize(sourceToCoord);
          float cosAngle = dot(dirNorm, rayRefDirection);
          float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
          float spreadFactor = pow(max(distortedAngle,0.0),1.0/max(lightSpread,0.001));
          float distance = length(sourceToCoord);
          float maxDistance = iResolution.x * rayLength;
          float lengthFalloff = clamp((maxDistance - distance)/maxDistance,0.0,1.0);
          float fadeFalloff = clamp((iResolution.x*fadeDistance-distance)/(iResolution.x*fadeDistance),0.5,1.0);
          float pulse = pulsating>0.5?(0.8+0.2*sin(iTime*speed*3.0)):1.0;
          float baseStrength = clamp(
            (0.45 + 0.15*sin(distortedAngle*seedA+iTime*speed)) + 
            (0.3 + 0.2*cos(-distortedAngle*seedB+iTime*speed)),
            0.0,1.0
          );
          return baseStrength*lengthFalloff*fadeFalloff*spreadFactor*pulse;
        }
        void mainImage(out vec4 fragColor, in vec2 fragCoord){
          vec2 coord = vec2(fragCoord.x,iResolution.y-fragCoord.y);
          vec2 finalRayDir = rayDir;
          if(mouseInfluence>0.0){
            vec2 mouseScreenPos = mousePos*iResolution.xy;
            vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
            finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
          }
          vec4 rays1 = vec4(1.0)*rayStrength(rayPos,finalRayDir,coord,36.2214,21.11349,1.5*raysSpeed);
          vec4 rays2 = vec4(1.0)*rayStrength(rayPos,finalRayDir,coord,22.3991,18.0234,1.1*raysSpeed);
          fragColor = rays1*0.5 + rays2*0.4;
          if(noiseAmount>0.0){float n=noise(coord*0.01+iTime*0.1);fragColor.rgb*=(1.0-noiseAmount+noiseAmount*n);}
          float brightness = 1.0 - (coord.y/iResolution.y);
          fragColor.x *= 0.1 + brightness*0.8;
          fragColor.y *= 0.3 + brightness*0.6;
          fragColor.z *= 0.5 + brightness*0.5;
          if(saturation!=1.0){float gray = dot(fragColor.rgb,vec3(0.299,0.587,0.114)); fragColor.rgb = mix(vec3(gray),fragColor.rgb,saturation);}
          fragColor.rgb *= raysColor;
        }
        void main(){ vec4 color; mainImage(color, gl_FragCoord.xy); gl_FragColor=color; }`;

      // Uniforms
      const uniforms: Uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion }
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      // Update placement & animation
      const updatePlacement = () => {
        if (!containerRef.current || !rendererRef.current || !uniformsRef.current) return;
        const renderer = rendererRef.current;
        const u = uniformsRef.current;
        const w = containerRef.current.clientWidth * renderer.dpr;
        const h = containerRef.current.clientHeight * renderer.dpr;
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        u.iResolution.value = [w, h];
        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
        u.rayPos.value = anchor;
        u.rayDir.value = dir;
      };

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) return;
        const renderer = rendererRef.current;
        const u = uniformsRef.current;
        u.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0) {
          const smoothing = 0.92;
          smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);
          u.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
        }

        renderer.render({ scene: meshRef.current });
        animationIdRef.current = requestAnimationFrame(loop);
      };

      window.addEventListener('resize', updatePlacement);
      updatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupRef.current = () => {
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        window.removeEventListener('resize', updatePlacement);
        if (rendererRef.current) {
          const canvas = rendererRef.current.gl.canvas;
          const ext = rendererRef.current.gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
          if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
        }
        rendererRef.current = undefined;
        meshRef.current = undefined;
        uniformsRef.current = undefined;
      };
    };

    initWebGL();

    return () => {
      isMounted = false;
      cleanupRef.current?.();
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  // Update uniforms dynamically
  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return;
    const u = uniformsRef.current;
    const renderer = rendererRef.current;

    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;

    const w = containerRef.current.clientWidth * renderer.dpr;
    const h = containerRef.current.clientHeight * renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion,
    raysOrigin
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none z-[3] overflow-hidden relative ${className}`.trim()}
    />
  );
};

export default LightRays;
