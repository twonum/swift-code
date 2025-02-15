"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Container variants for staggered reveal.
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.3,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Variants for individual items.
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Variants for social icons.
const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  hover: { scale: 1.15, rotate: 10, transition: { duration: 0.3 } },
};

// Separator animation.
const separatorVariants = {
  hidden: { width: 0 },
  visible: { width: "100%", transition: { duration: 1, ease: "easeInOut" } },
};

// Credit text animation.
const creditVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Extra decorative floating blob.
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

// Pulsating overlay for extra texture.
const PulsatingOverlay = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.15 }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "reverse",
    }}
    style={{
      backgroundImage:
        "linear-gradient(45deg, rgba(173,250,29,0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(173,250,29,0.2) 25%, transparent 25%)",
      backgroundSize: "50px 50px",
      backgroundPosition: "0 0, 25px 25px",
    }}
  />
);

export default function Footer() {
  return (
    <motion.footer
      className="w-full overflow-x-hidden flex flex-col items-center mt-12 md:mt-24 pb-8 space-y-6 text-white relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <FloatingBlob />
      <PulsatingOverlay />

      {/* Separator */}
      <motion.div className="w-full max-w-4xl mx-auto" variants={itemVariants}>
        <motion.div
          className="w-full h-px bg-gradient-to-r from-black to-[#adfa1d] mb-8 rounded-none"
          variants={separatorVariants}
        />
      </motion.div>

      {/* Social Icons */}
      <motion.div
        className="flex flex-wrap justify-center gap-6"
        variants={itemVariants}
      >
        <motion.a
          className="border border-[#adfa1d] rounded-none p-2"
          href="https://taha-saleem.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariants}
          whileHover="hover"
        >
          <Image
            src="/portfolio.svg"
            alt="Portfolio"
            width={32}
            height={32}
            className="transition-all duration-300"
          />
        </motion.a>
        <motion.a
          className="border border-[#adfa1d] rounded-none p-2"
          href="https://github.com/twonum"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariants}
          whileHover="hover"
        >
          <Image
            src="/github.svg"
            alt="GitHub"
            width={32}
            height={32}
            className="transition-all duration-300"
          />
        </motion.a>
        <motion.a
          className="border border-[#adfa1d] rounded-none p-2"
          href="https://linkedin.com/in/taha-saleem/"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariants}
          whileHover="hover"
        >
          <Image
            src="/linkedin.svg"
            alt="LinkedIn"
            width={32}
            height={32}
            className="transition-all duration-300"
          />
        </motion.a>
      </motion.div>

      {/* Copyright & Links */}
      <motion.p className="text-sm" variants={itemVariants}>
        &copy; {new Date().getFullYear()} SwiftCode by "M Taha Saleem". All
        rights reserved.
      </motion.p>
      <motion.div variants={itemVariants}>
        <Link href="/terms" className="text-sm hover:underline">
          Terms and Conditions
        </Link>
      </motion.div>

      {/* Designer Credit */}
      <motion.div
        className="text-center mt-6 text-lg font-semibold"
        variants={creditVariants}
      >
        <p className="design-credit text-transparent bg-clip-text bg-gradient-to-r from-black via-[#adfa1d] to-black text-2xl">
          Developed by{" "}
          <span className="designer-name">Muhammad Taha Saleem</span>
        </p>
      </motion.div>

      <style jsx>{`
        .design-credit {
          font-size: 1.8rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition:
            transform 0.3s ease,
            text-shadow 0.3s ease,
            color 0.5s ease;
          position: relative;
          text-shadow: 0 0 10px rgba(173, 250, 29, 0.2);
        }
        .design-credit:hover {
          color: #ffffff;
          text-shadow:
            0 0 25px rgba(173, 250, 29, 0.7),
            0 0 35px rgba(173, 250, 29, 0.9);
          transform: scale(1.15);
        }
        .designer-name {
          position: relative;
          display: inline-block;
          font-size: 2rem;
          animation: pulse 1.5s infinite ease-in-out;
        }
        .designer-name::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #ffffff, #adfa1d);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease-out;
        }
        .designer-name:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .designer-name:hover {
          color: #ffffff;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.75;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </motion.footer>
  );
}
