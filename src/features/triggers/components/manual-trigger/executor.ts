import type { NodeExecutor } from "@/features/executions/types";
import { mannualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<
  ManualTriggerData
> = async ({ nodeId, context, step, publish }) => {
  await publish(
    mannualTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );
  const result = await step.run(
    "manual-trigger",
    async () => context
  );

  await publish(
    mannualTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
