"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const LogouButton = () => {
  return <Button onClick={() => authClient.signOut()}>Logout</Button>;
};

export default LogouButton;
