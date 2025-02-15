"use client";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useContext } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSidebar } from "../ui/sidebar";
import { LockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function WorkspaceHistory() {
  const { userDetail } = useContext(UserDetailsContext);
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  // Use useQuery for a reactive, real-time subscription.
  // When userDetail exists, we pass the userId; otherwise, the query input is undefined.
  // The fallback (?? []) ensures workspaceList is always an array.
  const workspaceList =
    useQuery(
      api.workspace.GetAllWorkspace,
      userDetail ? { userId: userDetail._id } : undefined
    ) ?? [];

  const containerVariants = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, rotateX: 90 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <div className="relative">
      <motion.div
        className="p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl font-mono font-extrabold text-center text-[#ADFA1D]"
          variants={itemVariants}
        >
          Recent Chats
        </motion.h2>
        <motion.div className="mt-4" variants={containerVariants}>
          {workspaceList.map((workspace, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Link
                onClick={toggleSidebar}
                href={`/workspace/${workspace?._id}`}
              >
                <h2 className="text-xs text-gray-400 mt-2 font-mono font-bold hover:text-white cursor-pointer transition-all duration-700 ease-in-out text-center">
                  <div className="flex justify-start items-center">
                    <span className="w-4 text-left">{">"}</span>
                    <span className="ml-2 text-left">
                      {workspace?.messages[0]?.content}
                    </span>
                  </div>
                </h2>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      {/* Login overlay */}
      {!userDetail && (
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-neutral-800 bg-opacity-90 p-10 space-y-4"
          role="status"
          aria-live="polite"
        >
          <LockIcon className="h-12 w-12 text-black" aria-hidden="true" />
          <h2 className="text-black text-sm text-center font-semibold">
            Please login first.
          </h2>
          <Button
            onClick={() => router.push("/login")}
            variant="secondary"
            className="px-6 py-3 border border-[#ADFA1D] text-[#ADFA1D] font-semibold rounded-none transition-colors duration-300 hover:bg-[#ADFA1D] hover:text-black"
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceHistory;
