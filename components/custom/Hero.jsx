"use client";
import React, { useState, useContext } from "react";
import { ArrowRight } from "lucide-react";
import SignInDialog from "./SignInDialog";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { motion, AnimatePresence } from "framer-motion";

// Container variants for the entire hero section.
const heroContainerVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { staggerChildren: 0.2, duration: 1.2, ease: "easeOut" },
  },
};

// Variants for the hero heading with an extra dramatic entrance.
const headingVariants = {
  hidden: { opacity: 0, y: -100, rotateX: -45, rotate: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 150, damping: 10 },
  },
};

// Variants for the hero description.
const descriptionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.4, duration: 1, ease: "easeOut" },
  },
};

// Variants for the input container.
const inputContainerVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.6, duration: 1, ease: "easeOut" },
  },
};

// Variants for suggestion items.
const suggestionVariants = {
  hidden: { opacity: 0, x: -100, rotate: -20 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Floating decorative blob.
const FloatingBlob = () => (
  <motion.div
    className="absolute z-[-1] rounded-full"
    style={{
      width: 200,
      height: 200,
      background: "radial-gradient(circle, #adfa1d, transparent)",
    }}
    initial={{ x: -150, y: -100, opacity: 0 }}
    animate={{ x: 150, y: 100, opacity: 0.15 }}
    transition={{
      duration: 12,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
  />
);

// Pulsating gradient overlay.
const PulsatingOverlay = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.1 }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
    style={{
      background:
        "linear-gradient(45deg, rgba(173,250,29,0.2), transparent 70%)",
    }}
  />
);

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    if (userDetail?.token < 10) {
      toast.error("You don't have enough tokens to generate a response.");
      return;
    }
    const msg = { role: "user", content: input };
    setMessages(msg);
    try {
      const workspaceId = await CreateWorkspace({
        user: userDetail._id,
        messages: [msg],
      });
      console.log("Workspace ID:", workspaceId);
      // Append ?new=true so that middleware bypasses ownership check for this first load
      router.push(`/workspace/${workspaceId}?new=true`);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  return (
    <div
      className="hero-wrapper w-full min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #000, #000)" }}
    >
      {/* Extra Floating Elements */}
      <FloatingBlob />
      <PulsatingOverlay />

      <motion.div
        className="hero-container flex flex-col items-center gap-4 text-center relative z-10"
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="hero-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#ADFA1D] shadow-lg"
          variants={headingVariants}
          // Removed whileHover to prevent continuous movement on hover
          animate={{
            textShadow: "0px 0px 20px #ADFA1D",
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {Lookup.HERO_HEADING}
        </motion.h2>
        <motion.p
          className="hero-description text-sm sm:text-base md:text-lg text-gray-400 font-medium max-w-3xl"
          variants={descriptionVariants}
        >
          {Lookup.HERO_DESC}
        </motion.p>
        <motion.div
          className="input-container p-4 sm:p-5 border rounded-none max-w-2xl w-full mt-3"
          style={{ backgroundColor: Colors.BACKGROUND }}
          variants={inputContainerVariants}
          whileHover={{ boxShadow: "0 0 20px #adfa1d", scale: 1.05 }}
        >
          <div className="input-inner flex flex-col sm:flex-row gap-2">
            <textarea
              autoComplete="off"
              onChange={(e) => setUserInput(e.target.value)}
              className="hero-textarea outline-none bg-transparent resize-none w-full h-28 sm:h-32 md:h-36 max-h-56 text-base text-white"
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
            />
            {userInput && (
              <motion.div
                whileHover={{ scale: 1.3, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight
                  onClick={() => onGenerate(userInput)}
                  className="hero-arrow p-2 h-8 w-8 transition duration-200 ease-in-out cursor-pointer bg-[#ADFA1D] text-black"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
        <motion.div
          className="suggestions-container flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-4"
          variants={suggestionVariants}
        >
          {Lookup.SUGGSTIONS.map((suggestion, index) => (
            <motion.h2
              key={index}
              onClick={() => onGenerate(suggestion)}
              className="suggestion-item p-1 px-2 border rounded-none text-xs sm:text-sm text-gray-400 cursor-pointer transition duration-200 ease-in-out"
              whileHover={{
                background: "#ffffff",
                color: "black",
                boxShadow: "0 0 10px #adfa1d",
              }}
            >
              {suggestion}
            </motion.h2>
          ))}
        </motion.div>
      </motion.div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
      {/* Extra placeholder lines for design (animated fade-in) */}
      <motion.div
        className="extra-lines flex flex-col gap-1 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="extra-line h-1 bg-[#adfa1d]"
            initial={{ scaleX: 0, rotate: -10 }}
            animate={{ scaleX: 1, rotate: 0 }}
            transition={{ delay: 1 + i * 0.2, duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      <style jsx>{`
        .hero-wrapper {
          /* Background already set inline */
        }
        .hero-container {
          padding: 0 1rem;
        }
        .hero-heading {
          transition: transform 0.3s ease;
          text-shadow: 1px 1px 4px rgba(173, 250, 29, 0.5);
        }
        .input-container {
          border: 2px solid #adfa1d;
          transition: box-shadow 0.3s ease;
        }
        .hero-textarea {
          font-size: 1.1rem;
        }
        .hero-arrow {
          transition: opacity 0.2s ease;
        }
        .hero-arrow:hover {
          opacity: 0.9;
        }
        .suggestion-item {
          border: 1px solid #adfa1d;
        }
        @media (max-width: 768px) {
          .hero-heading {
            font-size: 3rem;
          }
          .hero-description {
            font-size: 1rem;
          }
          .input-container {
            padding: 1rem;
          }
          .hero-textarea {
            font-size: 0.95rem;
          }
        }
        @media (max-width: 480px) {
          .hero-heading {
            font-size: 2.5rem;
          }
          .hero-description {
            font-size: 0.9rem;
          }
          .input-container {
            padding: 0.8rem;
          }
          .hero-textarea {
            font-size: 0.85rem;
            height: 110px;
          }
        }
      `}</style>
    </div>
  );
}

export default Hero;
