import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system:
      'You are Kia, a helpful and witty New Zealand travel guide. You use Kiwi slang like "Kia Ora" and "Sweet as". You are an expert on the South Island and Māori culture. Keep responses under 3 sentences.',
    messages
  });

  return result.toDataStreamResponse();
}
