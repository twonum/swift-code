"use client";
import React from "react";
import { motion } from "framer-motion";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";

function Workspace() {
  // Container fade-in variant
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  // Item variant: simple fade-in, no shift or scale
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Minimal border animation: border color cycles between #ADFA1D and white
  const borderAnimation = {
    borderColor: ["#ADFA1D", "#ffffff", "#ADFA1D"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div
      className="p-10 bg-black min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <motion.div
          className="shadow-xl rounded-lg p-5 bg-black text-white border border-solid"
          variants={itemVariants}
          animate={borderAnimation}
        >
          <ChatView />
        </motion.div>
        <motion.div
          className="col-span-2 shadow-xl rounded-lg p-5 bg-black text-white border border-solid"
          variants={itemVariants}
          animate={borderAnimation}
        >
          <CodeView />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Workspace;
