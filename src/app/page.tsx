import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trcp/server";
import LogouButton from "./logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
      <LogouButton />
    </div>
  );
};

export default Page;
