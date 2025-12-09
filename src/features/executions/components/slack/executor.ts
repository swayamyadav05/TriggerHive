import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import Handlebars from "handlebars";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type SlackNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const slackExecutor: NodeExecutor<SlackNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Slack node: Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          "Slack node: Webhook URL is missing"
        );
      }
      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000), // Slack's max message length
          username,
        },
      });

      if (!data.variableName) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          "Slack node: Variable name is missing"
        );
      }
      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
