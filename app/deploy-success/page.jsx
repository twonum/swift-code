"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"; // Use your UI button component (e.g., from shadcn/ui)
import { useRouter } from "next/navigation";

// The deployed URL (this could be passed as a prop or obtained from context)
const DEPLOY_URL = "https://mhdllj.csb.app/";

const DeploySuccessPage = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DEPLOY_URL).then(() => {
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);

      // Redirect after 6 seconds
      setTimeout(() => {
        router.back(); // Navigates to the previous page
      }, 6000);
    });
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* New animated gradient background */}
      <AnimatedBackground />
      {/* Existing animated elements */}
      <FloatingParticles />
      <PulsatingOverlay />
      <ExtremeDecor />
      {/* Additional explosive particle effects for extra pizzazz */}
      <ExplosiveParticles />

      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
            rotate: 150,
            filter: "blur(25px)",
          }}
          animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.5, rotate: -150, filter: "blur(25px)" }}
          transition={{
            duration: 1.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="p-8 bg-black bg-opacity-80 border border-[#ADFA1D] shadow-2xl max-w-2xl w-full text-center space-y-6 z-10"
        >
          <motion.h1
            className="text-6xl font-extrabold"
            style={{ color: "#ADFA1D" }}
            initial={{ filter: "blur(8px)", scale: 0.7 }}
            animate={{ filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Congratulations!
          </motion.h1>
          <motion.p className="text-xl text-white">
            Your web app is deployed successfully.
          </motion.p>
          <motion.p className="text-lg text-gray-300">
            URL: <span className="font-mono underline">{DEPLOY_URL}</span>
          </motion.p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="px-6 py-3 text-xl"
            >
              Copy URL
            </Button>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-green-400 text-lg"
              >
                URL Copied to clipboard!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DeploySuccessPage;

/* ----------------------- Auxiliary Animated Components ----------------------- */

const AnimatedBackground = () => {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{
        background: "linear-gradient(270deg, #000, #1a1a1a, #ADFA1D, #000)",
        backgroundSize: "600% 600%",
      }}
    />
  );
};

const FloatingParticles = () => {
  return (
    <>
      <motion.div
        className="absolute rounded-full bg-[#ADFA1D]"
        style={{ width: 15, height: 15, left: "10%", top: "5%" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
          rotate: [0, 360, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bg-[#ADFA1D]"
        style={{ width: 20, height: 20, left: "80%", top: "15%" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 12,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Additional particle */}
      <motion.div
        className="absolute rounded-full bg-[#ADFA1D]"
        style={{ width: 25, height: 25, left: "50%", top: "20%" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.2, 0.5],
          rotate: [0, -360, 0],
        }}
        transition={{
          duration: 15,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
};

const PulsatingOverlay = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
    style={{
      backgroundImage:
        "linear-gradient(45deg, rgba(173,250,29,0.3) 25%, transparent 25%), linear-gradient(-45deg, rgba(173,250,29,0.3) 25%, transparent 25%)",
      backgroundSize: "50px 50px",
      backgroundPosition: "0 0, 25px 25px",
    }}
  />
);

const ExtremeDecor = () => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 flex justify-around items-center pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1, duration: 1.5 }}
  >
    {["line", "square", "circle"].map((shape, i) => (
      <motion.div
        key={i}
        style={
          shape === "line"
            ? { width: "20%", height: "3px", backgroundColor: "#ADFA1D" }
            : shape === "square"
              ? { width: "20px", height: "20px", backgroundColor: "#ADFA1D" }
              : {
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#ADFA1D",
                  borderRadius: "50%",
                }
        }
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </motion.div>
);

const ExplosiveParticles = () => {
  return (
    <>
      <motion.div
        className="absolute rounded-full bg-[#ADFA1D]"
        style={{ width: 10, height: 10, left: "30%", top: "70%" }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bg-[#ADFA1D]"
        style={{ width: 15, height: 15, left: "70%", top: "80%" }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2, 0] }}
        transition={{
          duration: 10,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full bg-[#ADFA1D]"
        style={{ width: 12, height: 12, left: "85%", top: "30%" }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.8, 0] }}
        transition={{
          duration: 9,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
};
