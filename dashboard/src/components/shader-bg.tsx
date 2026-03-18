"use client";

import { DitheringShader } from "@/components/ui/dithering-shader";

export function ShaderBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen">
      <DitheringShader
        shape="swirl"
        type="4x4"
        colorBack="#111111"
        colorFront="#201a14"
        pxSize={4}
        speed={0.4}
      />
    </div>
  );
}
