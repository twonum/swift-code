"use client";

import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader, LockIcon } from "lucide-react";
import { countToken } from "./ChatView";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { Button } from "../ui/button";
import SignInDialog from "./SignInDialog";

// ErrorBoundary to catch any render errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE || {});
  const [loading, setLoading] = useState(false);

  const { messages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false); // Add state for dialog

  const convex = useConvex();
  const updateFilesMutation = useMutation(api.workspace.UpdateFiles);
  const updateTokensMutation = useMutation(api.users.UpdateToken);

  // Fetch workspace files when workspace ID is available
  const fetchWorkspaceFiles = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      // Ensure mergedFiles is an object even if result or fileData is missing
      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...(result?.fileData || {}),
      };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error fetching workspace files:", error);
    } finally {
      setLoading(false);
    }
  }, [convex, id]);

  useEffect(() => {
    try {
      fetchWorkspaceFiles().catch((error) =>
        console.error("Error in fetchWorkspaceFiles effect:", error)
      );
    } catch (error) {
      console.error(
        "Unexpected error in useEffect for fetchWorkspaceFiles:",
        error
      );
    }
  }, [fetchWorkspaceFiles]);

  // Generate AI code when a new user message is added
  useEffect(() => {
    try {
      if (
        Array.isArray(messages) &&
        messages.length > 0 &&
        messages[messages.length - 1]?.role === "user"
      ) {
        generateAiCode().catch((error) =>
          console.error("Error in generateAiCode effect:", error)
        );
      }
    } catch (error) {
      console.error("Error in messages useEffect:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const generateAiCode = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const promptData = JSON.stringify(messages) + Prompt.CODE_GEN_PROMPT;
      const response = await axios.post("/api/gen-ai-code", {
        prompt: promptData,
      });
      const aiResponse = response.data || {};

      // Merge default files with AI generated files safely
      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...(aiResponse?.files || {}),
      };
      setFiles(mergedFiles);

      // Update files in the workspace backend if files are present
      if (aiResponse?.files) {
        await updateFilesMutation({
          workspaceId: id,
          files: aiResponse.files,
        });
      }

      // Calculate token usage and update user's token balance if userDetail exists
      const tokenUsage = countToken(JSON.stringify(aiResponse));
      const currentToken = Number(userDetail?.token) || 0;
      const updatedToken = currentToken - Number(tokenUsage);
      if (userDetail?._id) {
        await updateTokensMutation({
          userId: userDetail._id,
          token: updatedToken,
        });
      }

      // Switch to code tab after generating code
      setActiveTab("code");
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative">
        {/* Header with tab selectors */}
        <div className="bg-[#ADFA1D] w-full p-2 border">
          <div className="text-white flex items-center flex-wrap shrink-0 p-1 justify-center bg-black w-[140px] gap-3">
            <h2
              onClick={() => setActiveTab("code")}
              className={`text-sm cursor-pointer ${
                activeTab === "code"
                  ? "text-[#ADFA1D] bg-[#ADFA1D] bg-opacity-25 p-1 px-2"
                  : ""
              }`}
            >
              Code
            </h2>
            <h2
              onClick={() => setActiveTab("preview")}
              className={`text-sm cursor-pointer ${
                activeTab === "preview"
                  ? "text-[#ADFA1D] bg-[#ADFA1D] bg-opacity-25 p-1 px-2"
                  : ""
              }`}
            >
              Preview
            </h2>
          </div>
        </div>

        {/* Sandpack live coding environment */}
        <SandpackProvider
          template="react"
          theme="dark"
          files={files}
          customSetup={{
            dependencies: { ...Lookup.DEPENDANCY },
          }}
          options={{
            externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
          }}
        >
          {/* Outer container fixes the overall width/height */}
          <div style={{ height: "80vh", width: "100%" }}>
            <SandpackLayout style={{ height: "100%", width: "100%" }}>
              {activeTab === "code" ? (
                // Code view: divide the space between the file explorer and code editor
                <div style={{ display: "flex", height: "100%", width: "100%" }}>
                  <SandpackFileExplorer
                    style={{ width: "25%", height: "100%" }}
                  />
                  <SandpackCodeEditor
                    style={{ width: "75%", height: "100%" }}
                  />
                </div>
              ) : (
                // Preview view: fills the container exactly
                <SandpackPreview
                  style={{ height: "100%", width: "100%" }}
                  showNavigator
                />
              )}
            </SandpackLayout>
          </div>
        </SandpackProvider>

        {/* Loading overlay */}
        {loading && (
          <div
            className="p-10 bg-lime-800 opacity-80 absolute top-0 w-full h-full flex items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <Loader
              className="animate-spin h-10 w-10 text-black"
              aria-hidden="true"
            />
            <h2 className="text-black pl-2">Cooking files...</h2>
          </div>
        )}
        {/* Login overlay */}
        {!userDetail && !loading && (
          <div
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-lime-800 bg-opacity-80 p-10 space-y-4"
            role="status"
            aria-live="polite"
          >
            <LockIcon className="h-12 w-12 text-black" aria-hidden="true" />
            <h2 className="text-black text-xl font-bold">
              Please login first.
            </h2>
            <Button
              onClick={() => setOpenDialog(true)} // Open dialog on click
              variant="secondary"
              className="px-6 py-3 border border-[#ADFA1D] text-[#ADFA1D] font-semibold rounded-none transition-colors duration-300 hover:bg-[#ADFA1D] hover:text-black"
            >
              Login
            </Button>
          </div>
        )}
      </div>
      {/* Render the SignInDialog */}
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </ErrorBoundary>
  );
}

export default CodeView;
