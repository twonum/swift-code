import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await chatSession.sendMessage(prompt);
    const ai_resp = result.response.text();
    return NextResponse.json({ result: ai_resp });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
