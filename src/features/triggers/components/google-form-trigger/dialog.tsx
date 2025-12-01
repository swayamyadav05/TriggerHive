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
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const trpc = useTRPC();

  // Fetch webhook info including secret
  const { data: webhookInfo, isLoading } = useQuery(
    trpc.workflows.getWebhookInfo.queryOptions({ id: workflowId })
  );

  const webhookUrl = webhookInfo?.webhookUrl || "";
  const webhookSecret = webhookInfo?.webhookSecret || "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form&apos;s Apps
            Script to trigger this workflow when a form is submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">
              Setup Instructions
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Google Form</li>
              <li>
                Click the three dots menu &rarr; App Scripts &rarr;
                Editor
              </li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with your webhook URL above</li>
              <li>
                Save and click &quot;Triggers&quot; &rarr; Add Trigger
              </li>
              <li>
                Choose: From form &rarr; On form submit &rarr; Save
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium text-sm">
              Google Apps Script:
            </h4>
            <Button
              type="button"
              variant={"outline"}
              disabled={isLoading || !webhookSecret}
              onClick={async () => {
                const script = generateGoogleFormScript(
                  webhookUrl,
                  webhookSecret
                );

                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch {
                  toast.error("Failed to copy Script to clipboard");
                }
              }}>
              <CopyIcon className="size-4 mr-2" />
              Copy Google Apps Script
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook URL with
              authentication and handles form submissions securely
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">
              Available Variables
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.respondentEmail}}"}
                </code>
                - Respondent&apos;s email
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                - Specific answer
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json.googleForm.responses}}"}
                </code>
                - All responses as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
