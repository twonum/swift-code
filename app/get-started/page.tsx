"use client";

import React, { useState, useContext } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import SignInDialog from "@/components/custom/SignInDialog";
import { Button } from "@/components/ui/button";

// Cast the Button component to accept children.
const CustomButton = Button as React.FC<{
  children: React.ReactNode;
  variant: string;
  onClick: () => void;
  className?: string;
}>;

// ---------------------------------------------------------------------
// Background Animation Components
// ---------------------------------------------------------------------
const FloatingParticle = ({ left, top, size, delay, duration }) => (
  <motion.div
    className="absolute rounded-full bg-[#adfa1d]"
    style={{ width: size, height: size, left, top }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      rotate: [0, 360, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const PulsatingOverlay = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "mirror",
    }}
    style={{
      backgroundImage:
        "linear-gradient(45deg, rgba(173,250,29,0.3) 25%, transparent 25%), linear-gradient(-45deg, rgba(173,250,29,0.3) 25%, transparent 25%)",
      backgroundSize: "50px 50px",
      backgroundPosition: "0 0, 25px 25px",
    }}
  />
);

// Extra decorative floating blob (from Terms page)
const FloatingBlob = () => (
  <motion.div
    className="absolute z-[-1] rounded-full"
    style={{
      width: 150,
      height: 150,
      background: "radial-gradient(circle, #adfa1d, transparent)",
    }}
    initial={{ x: -100, y: 0, opacity: 0 }}
    animate={{ x: 100, y: 50, opacity: 0.2 }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
  />
);

// Extreme decorative elements similar to Terms page
const ExtremeDecor = () => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 flex justify-around items-center pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1, duration: 1.5 }}
  >
    {["line", "square", "circle", "triangle", "wave"].map((shape, i) => (
      <motion.div
        key={i}
        className={`decor-${shape}`}
        style={
          shape === "line"
            ? { width: "20%", height: "3px", backgroundColor: "#ADFA1D" }
            : shape === "square"
              ? { width: "20px", height: "20px", backgroundColor: "#ADFA1D" }
              : shape === "circle"
                ? {
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#ADFA1D",
                    borderRadius: "0",
                  }
                : shape === "triangle"
                  ? {
                      width: "0",
                      height: "0",
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderBottom: "18px solid #ADFA1D",
                    }
                  : {
                      width: "60px",
                      height: "12px",
                      background:
                        "repeating-linear-gradient(-45deg, #ADFA1D, #ADFA1D 6px, transparent 6px, transparent 12px)",
                    }
        }
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </motion.div>
);

// ---------------------------------------------------------------------
// Framer Motion Variants for Extreme Effects
// ---------------------------------------------------------------------
const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.1,
    rotate: 150,
    filter: "blur(25px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: 2,
      type: "spring",
      stiffness: 200,
      damping: 15,
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.1,
    rotate: -150,
    filter: "blur(25px)",
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const mainHeadingVariants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 0.7 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const pulseTitle = {
  animate: {
    textShadow: [
      "0px 0px 5px #ADFA1D",
      "0px 0px 20px #ADFA1D",
      "0px 0px 5px #ADFA1D",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Extreme Button Animations for the three main buttons
const extremeButtonVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: [0, 5, -5, 0],
    boxShadow: "0px 0px 20px #ADFA1D",
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "mirror", // "mirror" is now correctly inferred as a literal
    },
  },
  tap: { scale: 0.95 },
};

// ---------------------------------------------------------------------
// Get Started Page Component (Extreme Edition)
// ---------------------------------------------------------------------
function GetStartedPage() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);

  // Button Handlers
  const handleGetStarted = () => router.push("/");
  const handleLogin = () => router.push("/login");
  const handlePricing = () => router.push("/pricing");
  const handleTerms = () => router.push("/terms");

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black to-[#adfa1d78] p-4">
      {/* Background Animations */}
      <FloatingParticle left="5%" top="0%" size={15} delay={0} duration={10} />
      <FloatingParticle
        left="20%"
        top="10%"
        size={25}
        delay={1}
        duration={12}
      />
      <FloatingParticle
        left="40%"
        top="20%"
        size={20}
        delay={0.5}
        duration={8}
      />
      <FloatingParticle
        left="70%"
        top="30%"
        size={30}
        delay={1.5}
        duration={10}
      />
      <FloatingParticle
        left="85%"
        top="5%"
        size={18}
        delay={0.8}
        duration={11}
      />
      <PulsatingOverlay />
      <FloatingBlob />
      <ExtremeDecor />

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-8 bg-black bg-opacity-70 border border-[#ADFA1D] rounded-none shadow-2xl max-w-5xl w-full mx-4 flex flex-col items-center space-y-8"
        >
          {/* App Title */}
          <motion.div
            variants={mainHeadingVariants}
            whileHover={{ scale: 1.05 }}
            className="w-full text-center"
          >
            <h1
              className="text-6xl font-extrabold"
              style={{ color: "#ADFA1D" }}
            >
              SwiftCodee
            </h1>
          </motion.div>
          {/* App Description */}
          <motion.div
            variants={itemVariants}
            className="w-full text-center"
            {...pulseTitle}
          >
            <h2 className="text-3xl font-bold text-white">
              Empower your creativity &amp; transform ideas into deployable
              projects in seconds.
            </h2>
            <p className="mt-4 text-white text-xl max-w-3xl mx-auto">
              SwiftCodee harnesses advanced AI to generate high-quality,
              production-ready code with lightning speed. Whether you're a
              startup founder or a seasoned developer, experience the future of
              rapid development.
            </p>
          </motion.div>
          {/* Call-to-Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col items-center gap-6"
          >
            <motion.button
              onClick={handleGetStarted}
              variants={extremeButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full max-w-md py-4 text-black text-2xl bg-[#ADFA1D] hover:bg-white transition duration-300 ease-in-out rounded-none"
            >
              Get Started
            </motion.button>
            <div className="flex flex-wrap gap-4 justify-center">
              <CustomButton
                variant="secondary"
                onClick={handlePricing}
                className="px-6 py-3 text-xl"
              >
                Pricing
              </CustomButton>
              <CustomButton
                variant="secondary"
                onClick={handleLogin}
                className="px-6 py-3 text-xl"
              >
                Login
              </CustomButton>
              <CustomButton
                variant="secondary"
                onClick={handleTerms}
                className="px-6 py-3 text-xl"
              >
                Terms
              </CustomButton>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <SignInDialog openDialog={openDialog} closeDialog={setOpenDialog} />
    </div>
  );
}

export default GetStartedPage;
