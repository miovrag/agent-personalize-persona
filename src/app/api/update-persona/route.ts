import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { persona_instructions } = await req.json();

  const res = await fetch(
    "https://app.customgpt.ai/api/v1/projects/89781/settings",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer 9965|LRsLVmnm62ggkjxLJs5DG1HX9euLC72QzamZtlja1ae67639",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ persona_instructions }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
