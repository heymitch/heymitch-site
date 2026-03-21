"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { useRef, useState, useEffect, useCallback, Suspense } from "react"
import { AsciiEffect } from "./ascii-effect"
import { Vector2, VideoTexture, SRGBColorSpace, Mesh } from "three"

function VideoPlane() {
  const meshRef = useRef<Mesh>(null)
  const { viewport } = useThree()
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null)

  useEffect(() => {
    const video = document.createElement("video")
    video.src = "/crt-feed.mp4"
    video.crossOrigin = "anonymous"
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked — retry on interaction
        const handler = () => {
          video.play()
          document.removeEventListener("click", handler)
        }
        document.addEventListener("click", handler)
      })
    }

    video.addEventListener("canplaythrough", () => {
      const tex = new VideoTexture(video)
      tex.colorSpace = SRGBColorSpace
      setVideoTexture(tex)
      playVideo()
    }, { once: true })

    video.load()

    return () => {
      video.pause()
      video.src = ""
      if (videoTexture) videoTexture.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (videoTexture) videoTexture.needsUpdate = true
  })

  if (!videoTexture) return null

  // Scale plane to fill viewport while preserving video aspect ratio (1768x1152)
  const videoAspect = 1768 / 1152
  const viewAspect = viewport.width / viewport.height
  let planeW, planeH
  if (viewAspect > videoAspect) {
    planeW = viewport.width
    planeH = viewport.width / videoAspect
  } else {
    planeH = viewport.height
    planeW = viewport.height * videoAspect
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeW, planeH]} />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  )
}

function ResolutionTracker({ onResize }: { onResize: (v: Vector2) => void }) {
  const { size } = useThree()
  useEffect(() => {
    onResize(new Vector2(size.width, size.height))
  }, [size, onResize])
  return null
}

function Scene() {
  const [resolution, setResolution] = useState(new Vector2(800, 400))
  const handleResize = useCallback((v: Vector2) => setResolution(v), [])

  return (
    <>
      <ResolutionTracker onResize={handleResize} />
      <VideoPlane />
      <EffectComposer>
        <AsciiEffect
          cellSize={10}
          color={false}
          invert={false}
          resolution={resolution}
          postfx={{
            colorPalette: 2,
            scanlineIntensity: 0.15,
            scanlineCount: 300,
            vignetteIntensity: 0.4,
            vignetteRadius: 1.2,
            noiseIntensity: 0.04,
            noiseScale: 3,
            noiseSpeed: 0.5,
            brightnessAdjust: 0.05,
            contrastAdjust: 1.3,
          }}
        />
      </EffectComposer>
    </>
  )
}

export default function EffectScene() {
  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-terminal text-amber-600/60 text-sm tracking-widest animate-pulse">
              LOADING...
            </span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 1], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ antialias: false }}
          orthographic
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
