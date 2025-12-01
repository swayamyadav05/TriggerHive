import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/webhook-auth";
import { z } from "zod";

// Zod schema for Google Form webhook payload validation
const googleFormPayloadSchema = z.object({
  formId: z.string().min(1, "formId is required"),
  formTitle: z.string().min(1, "formTitle is required"),
  responseId: z.string().min(1, "responseId is required"),
  timestamp: z
    .string()
    .or(z.date())
    .transform((val) =>
      typeof val === "string" ? val : val.toISOString()
    ),
  respondentEmail: z.string().email().optional().or(z.literal("")),
  responses: z.record(z.string(), z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 }
      );
    }

    // Verify workflow exists and get webhook secret
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { webhookSecret: true, userId: true },
    });

    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          error: "Workflow not found",
        },
        { status: 404 }
      );
    }

    // Handle signature verification if secret is configured
    let body: unknown;

    if (workflow.webhookSecret) {
      const signature = request.headers.get("x-webhook-signature");

      if (!signature) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing webhook signature",
          },
          { status: 401 }
        );
      }

      const rawBody = await request.text();
      const isValid = verifyWebhookSignature(
        workflow.webhookSecret,
        rawBody,
        signature
      );

      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid webhook signature",
          },
          { status: 401 }
        );
      }

      // Parse body after verification
      body = JSON.parse(rawBody);
    } else {
      // No webhook secret configured - read body normally
      body = await request.json();
    }

    // Validate payload with Zod schema
    const validationResult = googleFormPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payload format",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Build form data from validated payload
    const formData = {
      formId: validatedData.formId,
      formTitle: validatedData.formTitle,
      responseId: validatedData.responseId,
      timestamp: validatedData.timestamp,
      respondentEmail: validatedData.respondentEmail,
      responses: validatedData.responses,
      raw: body,
    };

    // Send workflow execution event
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Google form webhook error: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Google Form submission",
      },
      { status: 500 }
    );
  }
}
