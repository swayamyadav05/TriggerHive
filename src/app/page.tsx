"use client";

import LogouButton from "./logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const testAi = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: () => {
        toast.success("AI Job queued!");
      },
    })
  );

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued!");
      },
    })
  );

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button
        disabled={testAi.isPending}
        onClick={() => testAi.mutate()}>
        Test AI
      </Button>
      <Button
        disabled={create.isPending}
        onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <LogouButton />
    </div>
  );
};

export default Page;
