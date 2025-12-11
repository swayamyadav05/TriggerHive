import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import Stripe from "stripe";
import { decrypt } from "@/lib/encryption";

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

    // Verify workflow exists and get Stripe webhook secret
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { stripeWebhookSecret: true, userId: true },
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

    if (!workflow.stripeWebhookSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stripe webhook secret not configured. Please add your Stripe signing secret in the workflow configuration.",
        },
        { status: 401 }
      );
    }

    // Get Stripe API secret key from credentials
    const stripeCredential = await prisma.credential.findFirst({
      where: {
        userId: workflow.userId,
        type: "STRIPE",
      },
    });

    if (!stripeCredential) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stripe API key not configured. Please add your Stripe API secret key in credentials.",
        },
        { status: 401 }
      );
    }

    // Get raw body and Stripe signature header
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Stripe signature header",
        },
        { status: 401 }
      );
    }

    // Verify webhook signature using Stripe SDK
    let event: Stripe.Event;

    try {
      const stripe = new Stripe(decrypt(stripeCredential.value), {
        apiVersion: "2025-11-17.clover",
      });

      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        workflow.stripeWebhookSecret
      );
    } catch (err) {
      console.error(
        "Stripe webhook signature verification failed:",
        err
      );
      return NextResponse.json(
        {
          success: false,
          error: `Webhook signature verification failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        },
        { status: 401 }
      );
    }

    // Extract relevant data from Stripe event
    const stripeData = {
      eventId: event.id,
      eventType: event.type,
      timestamp: new Date(event.created * 1000).toISOString(),
      livemode: event.livemode,
      data: event.data.object,
      raw: event,
    };

    // Send workflow execution event
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
        eventId: event.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Stripe event",
      },
      { status: 500 }
    );
  }
}
