import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Empty prompt." }, { status: 400 });
    }

    if (prompt.length > 200) {
      return NextResponse.json({ error: "Prompt too long." }, { status: 400 });
    }

    // Call OpenAI Images API.
    const openai = getOpenAIClient();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const urls: string[] =
      (response.data?.map((obj: { url: string }) => obj.url).filter(Boolean)) ?? [];

    if (urls.length === 0) {
      return NextResponse.json(
        { error: "No images generated. Please try another prompt." },
        { status: 502 }
      );
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json(
      { error: "Image generation failed. Please try again later." },
      { status: 500 }
    );
  }
}