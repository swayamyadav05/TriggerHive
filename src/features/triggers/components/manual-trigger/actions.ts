"use server";

import { mannualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";
import {
  getSubscriptionToken,
  type Realtime,
} from "@inngest/realtime";

export type MannualTriggerToken = Realtime.Token<
  typeof mannualTriggerChannel,
  ["status"]
>;

export async function fetchMannualTriggerRealtimeToken(): Promise<MannualTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: mannualTriggerChannel(),
    topics: ["status"],
  });

  return token;
}
