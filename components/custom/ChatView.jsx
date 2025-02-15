"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Loader, Menu, LockIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import SignInDialog from "./SignInDialog";

// ErrorBoundary component to catch render errors
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

// Utility: Count tokens by splitting the input text by whitespace.
export const countToken = (inputText) => {
  try {
    if (typeof inputText !== "string") return 0;
    return inputText.trim().split(/\s+/).filter(Boolean).length;
  } catch (error) {
    console.error("Error counting tokens:", error);
    return 0;
  }
};

const chatContainerVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", boxShadow: "0 0 20px #ADFA1D" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    boxShadow: "0 0 5px #ADFA1D",
    transition: { duration: 1, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const messageVariants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const inputVariants = {
  hidden: { opacity: 0, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8 },
  },
};

const toggleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ChatMessages Component with fixed max-height for scrolling
const ChatMessages = ({ messages, loading, userDetail }) => {
  try {
    return (
      <motion.div className="flex-1 max-h-[49vh] overscroll-contain overflow-y-auto scrollbar-hide flex flex-col gap-2">
        {Array.isArray(messages) &&
          messages.map((msg, index) => (
            <motion.div
              key={index}
              className="p-3 flex items-center gap-2 leading-7"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              {msg.role === "user" && userDetail?.picture && (
                <Image
                  src={userDetail.picture}
                  alt="User Image"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              )}
              <ReactMarkdown className="flex flex-col text-gray-400 w-full justify-center">
                {msg.content}
              </ReactMarkdown>
            </motion.div>
          ))}
        {loading && (
          <motion.div
            className="p-3 flex items-center"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            role="status"
            aria-live="polite"
          >
            <Loader
              className="animate-spin text-[#ADFA1D]"
              aria-hidden="true"
            />
            <h2 className="ml-2">Generating response...</h2>
          </motion.div>
        )}
      </motion.div>
    );
  } catch (error) {
    console.error("Error rendering ChatMessages:", error);
    return <div>Error rendering messages.</div>;
  }
};

// ChatInput Component remains largely unchanged
const ChatInput = ({
  userInput,
  setUserInput,
  onGenerate,
  toggleSidebar,
  userDetail,
}) => {
  try {
    return (
      <motion.div
        className="flex items-end gap-2 mt-10"
        variants={inputVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="p-5 border rounded-none max-w-2xl w-full"
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <div className="flex gap-2 mt-4">
            <textarea
              autoComplete="off"
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none overscroll-contain scrollbar-hide bg-transparent resize-none w-full h-32 max-h-56"
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
            />
            {userInput && (
              <ArrowRight
                disabled={!userDetail}
                onClick={() => onGenerate(userInput)}
                className="p-2 h-8 w-8 hover:opacity-80 transition duration-300 ease-in-out text-black cursor-pointer bg-[#ADFA1D]"
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  } catch (error) {
    console.error("Error rendering ChatInput:", error);
    return <div>Error rendering input area.</div>;
  }
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail } = useContext(UserDetailsContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const { toggleSidebar } = useSidebar();
  const [openDialog, setOpenDialog] = useState(false); // Add state for dialog

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const updateMessagesMutation = useMutation(api.workspace.UpdateMessages);
  const updateTokensMutation = useMutation(api.users.UpdateToken);

  // Fetch workspace data based on workspace ID
  const fetchWorkspaceData = useCallback(async () => {
    if (!id) return;
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      if (result && Array.isArray(result.messages)) {
        setMessages(result.messages);
      } else {
        setMessages([]);
      }
      console.log(result);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  }, [convex, id, setMessages]);

  useEffect(() => {
    if (id) {
      fetchWorkspaceData().catch((error) =>
        console.error("Error in fetchWorkspaceData effect:", error)
      );
    }
  }, [id, fetchWorkspaceData]);

  // Trigger AI response when the last message is from the user
  useEffect(() => {
    try {
      if (Array.isArray(messages) && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "user") {
          fetchAiResponse().catch((error) =>
            console.error("Error in fetchAiResponse effect:", error)
          );
        }
      }
    } catch (error) {
      console.error("Error in messages effect:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Fetch AI-generated response
  const fetchAiResponse = async () => {
    setLoading(true);
    try {
      const promptData = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const response = await axios.post("/api/ai-chat", { prompt: promptData });
      if (
        !response ||
        !response.data ||
        typeof response.data.result !== "string"
      ) {
        throw new Error("Invalid response from AI API");
      }
      const aiResponse = {
        role: "ai",
        content: response.data.result,
      };

      const updatedMessages = [
        ...(Array.isArray(messages) ? messages : []),
        aiResponse,
      ];
      setMessages(updatedMessages);

      // Update messages on the backend
      await updateMessagesMutation({
        messages: updatedMessages,
        workspaceId: id,
      });

      // Calculate token usage and update user tokens
      const tokenUsage = countToken(JSON.stringify(aiResponse));
      const currentToken = Number(userDetail?.token) || 0;
      const updatedToken = currentToken - tokenUsage;
      await updateTokensMutation({
        userId: userDetail?._id,
        token: updatedToken,
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for generating a new message
  const onGenerate = (input) => {
    try {
      if (!input.trim()) return;
      setMessages((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        { role: "user", content: input },
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Error in onGenerate:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative items-center">
        {userDetail && (
          <motion.div
            onClick={toggleSidebar}
            className="toggle-sidebar justify-items-center cursor-pointer transform -translate-y-1/2 p-1 border border-[#ADFA1D] rounded transition-colors duration-300 hover:bg-lime-800"
            variants={toggleVariants}
            initial="hidden"
            animate="visible"
          >
            <Menu className="w-auto h-5 text-[#ADFA1D]" />
          </motion.div>
        )}
        <motion.div
          className="max-w-screen-md mx-auto p-4 flex flex-col"
          variants={chatContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <ChatMessages
            messages={messages}
            loading={loading}
            userDetail={userDetail}
          />
          <ChatInput
            userInput={userInput}
            setUserInput={setUserInput}
            onGenerate={onGenerate}
            toggleSidebar={toggleSidebar}
            userDetail={userDetail}
          />
        </motion.div>
        {/* Login overlay */}
        {!userDetail && !loading && (
          <div
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-neutral-800 bg-opacity-80 p-10 space-y-4"
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

export default ChatView;
