import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import * as Sentry from "@sentry/nextjs";

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  try {
    return await handler.POST(req);
  } catch (error) {
    console.error("Auth POST error:", error);
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    return await handler.GET(req);
  } catch (error) {
    console.error("Auth GET error:", error);
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
