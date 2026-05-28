'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import type { AnswerDot, ArchetypeName, Vec3 } from '@/lib/aiNative/types';
import { AXIS_META } from '@/lib/aiNative/model';

// ─── Prop interface ───────────────────────────────────────────────────────────

export interface Plot3DProps {
  dots: AnswerDot[];        // ~9 answer dots, each point in [0,1]^3
  centroid: Vec3;           // the user's location, [0,1]^3
  archetype: ArchetypeName; // label that floats on the centroid sphere
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const S = 1.3; // half-extent of the cube in world units

function toWorld(v: number): number {
  return (v - 0.5) * 2 * S;
}

function vec3ToWorld(v: Vec3): [number, number, number] {
  return [toWorld(v.autonomy), toWorld(v.openness), toWorld(v.value)];
}

const AXIS_COLORS: Record<string, string> = {
  autonomy: '#E8682A',
  openness: '#2B6B8A',
  value:    '#5B8C5A',
};

// ─── Inner scene components ───────────────────────────────────────────────────

function AnswerDotMesh({ dot }: { dot: AnswerDot }) {
  const color = AXIS_COLORS[dot.axis] ?? '#888888';
  const pos = vec3ToWorld(dot.point);
  return (
    <mesh position={pos}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
}

function CentroidSphere({ centroid, archetype }: { centroid: Vec3; archetype: ArchetypeName }) {
  const pos = vec3ToWorld(centroid);
  return (
    <mesh position={pos}>
      <sphereGeometry args={[0.13, 20, 20]} />
      <meshStandardMaterial color="#C4601A" emissive="#E8682A" emissiveIntensity={0.6} />
      <Html
        center
        distanceFactor={6}
        position={[0, 0.22, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            background: '#2D2118',
            color: '#F0E4D0',
            padding: '3px 9px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          }}
        >
          {archetype}
        </div>
      </Html>
    </mesh>
  );
}

function AxisLines() {
  const lo = -S;
  const hi = S;

  return (
    <>
      {/* X axis — Autonomy — orange */}
      <Line points={[[lo, 0, 0], [hi, 0, 0]]} color="#E8682A" lineWidth={1.5} />
      {/* Y axis — Openness — teal */}
      <Line points={[[0, lo, 0], [0, hi, 0]]} color="#2B6B8A" lineWidth={1.5} />
      {/* Z axis — Value — green */}
      <Line points={[[0, 0, lo], [0, 0, hi]]} color="#5B8C5A" lineWidth={1.5} />

      {/* Axis labels at positive ends */}
      <Html position={[hi + 0.12, 0, 0]} center distanceFactor={8} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ textAlign: 'center', whiteSpace: 'nowrap', color: '#E8682A', fontFamily: 'inherit' }}>
          <div style={{ fontSize: '11px', fontWeight: 700 }}>{AXIS_META.autonomy.name}</div>
          <div style={{ fontSize: '9px', opacity: 0.8 }}>{AXIS_META.autonomy.sublabel}</div>
        </div>
      </Html>

      <Html position={[0, hi + 0.12, 0]} center distanceFactor={8} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ textAlign: 'center', whiteSpace: 'nowrap', color: '#2B6B8A', fontFamily: 'inherit' }}>
          <div style={{ fontSize: '11px', fontWeight: 700 }}>{AXIS_META.openness.name}</div>
          <div style={{ fontSize: '9px', opacity: 0.8 }}>{AXIS_META.openness.sublabel}</div>
        </div>
      </Html>

      <Html position={[0, 0, hi + 0.12]} center distanceFactor={8} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ textAlign: 'center', whiteSpace: 'nowrap', color: '#5B8C5A', fontFamily: 'inherit' }}>
          <div style={{ fontSize: '11px', fontWeight: 700 }}>{AXIS_META.value.name}</div>
          <div style={{ fontSize: '9px', opacity: 0.8 }}>{AXIS_META.value.sublabel}</div>
        </div>
      </Html>
    </>
  );
}

function BoundingBox() {
  const lo = -S;
  const hi = S;
  const color = '#C8B89A';
  const opacity = 0.18;

  // 12 edges of the cube
  const edges: Array<[[number,number,number],[number,number,number]]> = [
    // bottom face
    [[lo,lo,lo],[hi,lo,lo]], [[hi,lo,lo],[hi,lo,hi]],
    [[hi,lo,hi],[lo,lo,hi]], [[lo,lo,hi],[lo,lo,lo]],
    // top face
    [[lo,hi,lo],[hi,hi,lo]], [[hi,hi,lo],[hi,hi,hi]],
    [[hi,hi,hi],[lo,hi,hi]], [[lo,hi,hi],[lo,hi,lo]],
    // verticals
    [[lo,lo,lo],[lo,hi,lo]], [[hi,lo,lo],[hi,hi,lo]],
    [[hi,lo,hi],[hi,hi,hi]], [[lo,lo,hi],[lo,hi,hi]],
  ];

  return (
    <>
      {edges.map((pts, i) => (
        <Line key={i} points={pts} color={color} lineWidth={0.6} transparent opacity={opacity} />
      ))}
    </>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.0} />
    </>
  );
}

function PlotScene({ dots, centroid, archetype }: { dots: AnswerDot[]; centroid: Vec3; archetype: ArchetypeName }) {
  return (
    <>
      <SceneLights />
      <BoundingBox />
      <AxisLines />
      {dots.map((dot, i) => (
        <AnswerDotMesh key={`${dot.questionId}-${i}`} dot={dot} />
      ))}
      <CentroidSphere centroid={centroid} archetype={archetype} />
      <OrbitControls
        enableDamping
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minDistance={2.5}
        maxDistance={8}
      />
    </>
  );
}

// ─── WebGL fallback ───────────────────────────────────────────────────────────

function NoWebGLFallback({ centroid, archetype }: { centroid: Vec3; archetype: ArchetypeName }) {
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  return (
    <div
      style={{
        background: '#F5EDE0',
        border: '1px solid #C8B89A',
        borderRadius: '12px',
        padding: '24px',
        color: '#2D2118',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '15px', fontWeight: 700, color: '#C4601A' }}>
        Your archetype: {archetype}
      </div>
      <div style={{ fontSize: '13px', opacity: 0.75 }}>3D plot unavailable — sub-scores:</div>
      {(['autonomy', 'openness', 'value'] as const).map(axis => (
        <div key={axis} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: AXIS_COLORS[axis],
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '13px', minWidth: '100px', fontWeight: 600 }}>
            {AXIS_META[axis].name}
          </span>
          <span style={{ fontSize: '13px', opacity: 0.8 }}>{pct(centroid[axis])}</span>
          <span style={{ fontSize: '11px', opacity: 0.55 }}>{AXIS_META[axis].sublabel}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Plot3D({ dots, centroid, archetype, className }: Plot3DProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl =
        (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: 'clamp(320px, 60vh, 520px)',
  };

  if (!mounted) {
    // SSR-safe placeholder — same height so layout doesn't shift
    return <div className={className} style={containerStyle} aria-hidden="true" />;
  }

  if (!hasWebGL) {
    return (
      <div className={className} style={containerStyle}>
        <NoWebGLFallback centroid={centroid} archetype={archetype} />
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <Suspense fallback={
        <div
          style={{
            ...containerStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C4601A',
            fontSize: '13px',
            opacity: 0.6,
          }}
        >
          Loading plot…
        </div>
      }>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [3.2, 2.6, 3.6], fov: 45 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <PlotScene dots={dots} centroid={centroid} archetype={archetype} />
        </Canvas>
      </Suspense>
    </div>
  );
}
