import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const resp = await result.response.text(); // ensure await if it's a promise
    return NextResponse.json(JSON.parse(resp));
  } catch (e) {
    // Return the error message from the caught exception
    return NextResponse.json({ error: e.toString() });
  }
}
