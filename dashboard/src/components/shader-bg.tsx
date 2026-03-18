"use client";

import { DitheringShader } from "@/components/ui/dithering-shader";

export function ShaderBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-40"
      style={{ background: "#1a1a1a" }}
    >
      <DitheringShader
        shape="swirl"
        type="4x4"
        colorBack="#1a1a1a"
        colorFront="#353535"
        pxSize={4}
        speed={0.4}
      />
    </div>
  );
}
