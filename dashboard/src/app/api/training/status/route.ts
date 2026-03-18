import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Connect to real Python training backend
  return NextResponse.json({
    status: "idle",
    metrics: {
      step: 0,
      totalSteps: 0,
      loss: 0,
      lr: 0,
      tokensPerSec: 0,
      gpuMem: "",
      epoch: 0,
      eta: "",
    },
    lossHistory: [],
  });
}
