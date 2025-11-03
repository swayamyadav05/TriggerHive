import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generateive-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is a blow fish?",
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generateive-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You are a helpful assistant.",
        prompt: "What is a blow fish?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generateive-text",
      generateText,
      {
        model: anthropic("claude-3-5-haiku-20241022"),
        system: "You are a helpful assistant.",
        prompt: "What is a blow fish?",
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
