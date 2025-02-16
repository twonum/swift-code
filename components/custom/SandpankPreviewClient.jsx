"use client";

import { ActionContext } from "@/context/ActionContext";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import React, { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function SandpankPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action } = useContext(ActionContext);
  const router = useRouter();

  useEffect(() => {
    if (sandpack) {
      GetSandpackClient();
    }
  }, [sandpack, action]);

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();
    if (client) {
      console.log(client);
      const result = await client.getCodeSandboxURL();
      if (action?.actionType === "deploy") {
        // Navigate to your custom Deploy Success page with the deploy URL as a query param
        const deployUrl = `https://${result?.sandboxId}.csb.app/`;
        router.push(`/deploy-success?url=${encodeURIComponent(deployUrl)}`);
      } else if (action?.actionType === "export") {
        window.open(result?.editorUrl);
      }
    }
  };

  return (
    <SandpackPreview
      ref={previewRef}
      style={{ height: "100%", width: "100%" }}
      showNavigator
    />
  );
}

export default SandpankPreviewClient;
