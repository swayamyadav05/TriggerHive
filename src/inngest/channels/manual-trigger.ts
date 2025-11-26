import { channel, topic } from "@inngest/realtime";

export const MANNUAL_TRIGGER_CHANNEL_NAME =
  "mannual-trigger-execution";

export const mannualTriggerChannel = channel(
  MANNUAL_TRIGGER_CHANNEL_NAME
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
