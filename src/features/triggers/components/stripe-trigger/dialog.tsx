"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyIcon, SaveIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
import Link from "next/link";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const trpc = useTRPC();

  // Fetch webhook info including secret
  const {
    data: webhookInfo,
    isLoading,
    refetch,
  } = useQuery(
    trpc.workflows.getWebhookInfo.queryOptions({
      id: workflowId,
      triggerType: "stripe",
    })
  );

  const webhookUrl = webhookInfo?.webhookUrl || "";
  const stripeWebhookSecret = webhookInfo?.stripeWebhookSecret || "";

  const [secretInput, setSecretInput] = useState("");

  // Fetch Stripe credentials
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.STRIPE);

  const saveSecretMutation = useMutation(
    trpc.workflows.saveStripeWebhookSecret.mutationOptions({
      onSuccess: () => {
        toast.success("Stripe signing secret saved successfully");
        setSecretInput("");
        refetch();
      },
      onError: (error) => {
        toast.error(`Failed to save: ${error.message}`);
        console.error(error);
      },
    })
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const saveStripeSecret = () => {
    if (!secretInput.trim()) {
      toast.error("Please enter a Stripe signing secret");
      return;
    }

    if (!secretInput.startsWith("whsec_")) {
      toast.error(
        "Invalid Stripe signing secret format. It should start with 'whsec_'"
      );
      return;
    }

    saveSecretMutation.mutate({
      id: workflowId,
      secret: secretInput,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Stripe Dashboard to trigger
            this workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-credential">Stripe API Key</Label>
            <Select disabled={isLoadingCredentials}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    credentials && credentials.length > 0
                      ? credentials[0].name
                      : "No Stripe credentials found"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {credentials?.map((credential) => (
                  <SelectItem
                    key={credential.id}
                    value={credential.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={"/logo/stripe.svg"}
                        alt="Stripe"
                        width={16}
                        height={16}
                      />
                      {credential.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Add your Stripe{" "}
              <Link
                href="/credentials"
                className="text-primary hover:underline">
                Credentials
              </Link>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size={"icon"}
                variant={"outline"}
                disabled={isLoading}
                onClick={copyToClipboard}>
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-secret">
              Stripe Signing Secret
              {stripeWebhookSecret && (
                <span className="ml-2 text-xs text-green-600 dark:text-green-500">
                  ✓ Configured
                </span>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                id="stripe-secret"
                type="password"
                placeholder={
                  stripeWebhookSecret
                    ? "••••••••••••••••"
                    : "whsec_..."
                }
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size={"icon"}
                variant={"outline"}
                disabled={
                  saveSecretMutation.isPending || !secretInput.trim()
                }
                onClick={saveStripeSecret}>
                <SaveIcon className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy the signing secret from Stripe Dashboard after
              creating the webhook endpoint
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">
              Setup Instructions
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers &rarr; Webhooks</li>
              <li>Click &quot;Add endpoint&quot;</li>
              <li>Paste the webhook URL from above</li>
              <li>
                Select events to listen for (e.g.,
                payment_intent.succeeded)
              </li>
              <li>
                Save and copy the signing secret (starts with whsec_)
              </li>
              <li>
                Paste the signing secret in the field above and save
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">
              Available Variables
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>{" "}
                - Payment amount
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>{" "}
                - Currency code
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>{" "}
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>{" "}
                - Full event data as JSON
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>{" "}
                - Event type (e.g., payment_intent.succeeded)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
