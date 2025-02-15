/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Variants for overall container and its children.
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
      staggerChildren: 0.3,
      when: "beforeChildren",
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const textVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const decorVariants = {
  animate: {
    rotate: [0, 360],
    transition: { duration: 10, repeat: Infinity, ease: "linear" },
  },
};

// Extra decorative floating blob
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

export default function TermsAndConditions() {
  return (
    <div className="w-full terms-container min-h-screen bg-gradient-to-br from-lime-900 to-black text-white relative overflow-hidden">
      {/* Extra Floating Blob & Pulsating Overlay */}
      <FloatingBlob />
      <PulsatingOverlay />

      <motion.div
        className="container mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="terms-content max-w-4xl mx-auto px-8 py-16 border border-[#ADFA1D] shadow-xl bg-black bg-opacity-80"
          variants={sectionVariants}
        >
          <motion.h1
            className="terms-title text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 text-gray-100"
            variants={headerVariants}
          >
            Terms and Conditions
          </motion.h1>
          <motion.p
            className="terms-intro text-gray-300 leading-relaxed mb-6"
            variants={textVariants}
          >
            Welcome to our application. By using this application, you agree to
            comply with and be bound by the following terms and conditions.
            Please review them carefully.
          </motion.p>

          <motion.section
            className="terms-section mb-6"
            variants={sectionVariants}
          >
            <motion.h2
              className="section-title text-2xl font-semibold text-gray-100 mb-4 border-b border-[#ADFA1D] pb-2"
              variants={headerVariants}
            >
              1. Acceptance of Terms
            </motion.h2>
            <motion.p
              className="section-text text-gray-300 mb-4"
              variants={textVariants}
            >
              By accessing and using our application, you acknowledge that you
              have read, understood, and agree to be legally bound by these
              terms and conditions.
            </motion.p>
          </motion.section>

          <motion.section
            className="terms-section mb-6"
            variants={sectionVariants}
          >
            <motion.h2
              className="section-title text-2xl font-semibold text-gray-100 mb-4 border-b border-[#ADFA1D] pb-2"
              variants={headerVariants}
            >
              2. Usage
            </motion.h2>
            <motion.p
              className="section-text text-gray-300 mb-4"
              variants={textVariants}
            >
              Our application provides a streamlined platform for managing your
              tasks and projects. You are solely responsible for the accuracy of
              the information you provide and for using the results responsibly.
            </motion.p>
          </motion.section>

          <motion.section
            className="terms-section mb-6"
            variants={sectionVariants}
          >
            <motion.h2
              className="section-title text-2xl font-semibold text-gray-100 mb-4 border-b border-[#ADFA1D] pb-2"
              variants={headerVariants}
            >
              3. Limitations and Disclaimers
            </motion.h2>
            <motion.p
              className="section-text text-gray-300 mb-4"
              variants={textVariants}
            >
              This application is provided "as-is" without any warranties,
              express or implied. We are not responsible for any inaccuracies or
              errors in the calculations and results.
            </motion.p>
          </motion.section>

          <motion.section
            className="terms-section mb-6"
            variants={sectionVariants}
          >
            <motion.h2
              className="section-title text-2xl font-semibold text-gray-100 mb-4 border-b border-[#ADFA1D] pb-2"
              variants={headerVariants}
            >
              4. Intellectual Property
            </motion.h2>
            <motion.p
              className="section-text text-gray-300 mb-4"
              variants={textVariants}
            >
              All content, design, and source code within this application are
              the exclusive intellectual property of the developer, and are
              protected under copyright laws.
            </motion.p>
          </motion.section>

          <motion.section
            className="terms-section mb-6"
            variants={sectionVariants}
          >
            <motion.h2
              className="section-title text-2xl font-semibold text-gray-100 mb-4 border-b border-[#ADFA1D] pb-2"
              variants={headerVariants}
            >
              5. Amendments
            </motion.h2>
            <motion.p
              className="section-text text-gray-300 mb-4"
              variants={textVariants}
            >
              We reserve the right to modify these terms and conditions at any
              time. Changes will be posted within the application and, if
              necessary, communicated via email.
            </motion.p>
          </motion.section>

          <motion.footer
            className="terms-footer mt-12 text-center text-gray-400"
            variants={sectionVariants}
          >
            <motion.p variants={textVariants}>
              For further details, please contact us at{" "}
              <motion.a
                href="mailto:tahasaleem.professional@gmail.com"
                className="underline hover:text-gray-200 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                tahasaleem.professional@gmail.com
              </motion.a>
              .
            </motion.p>
          </motion.footer>
        </motion.div>
      </motion.div>

      {/* Decorative Elements with Extreme Animations */}
      <motion.div
        className="terms-decor absolute bottom-0 left-0 right-0 flex justify-around items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      >
        <motion.div
          className="decor-line"
          variants={decorVariants}
          style={{ width: "20%", height: "3px", backgroundColor: "#ADFA1D" }}
        />
        <motion.div
          className="decor-square"
          variants={decorVariants}
          style={{ width: "20px", height: "20px", backgroundColor: "#ADFA1D" }}
        />
        <motion.div
          className="decor-circle"
          variants={decorVariants}
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#ADFA1D",
            borderRadius: "0",
          }}
        />
        <motion.div
          className="decor-triangle"
          variants={decorVariants}
          style={{
            width: "0",
            height: "0",
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "18px solid #ADFA1D",
          }}
        />
        <motion.div
          className="decor-wave"
          variants={decorVariants}
          style={{
            width: "60px",
            height: "12px",
            background:
              "repeating-linear-gradient(-45deg, #ADFA1D, #ADFA1D 6px, transparent 6px, transparent 12px)",
          }}
        />
        <motion.div
          className="decor-line"
          variants={decorVariants}
          style={{ width: "20%", height: "3px", backgroundColor: "#ADFA1D" }}
        />
      </motion.div>

      {/* Extra Placeholder Elements (for extended styling, hidden in production) */}
      <div className="terms-placeholders">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="extra-placeholder"></div>
        ))}
      </div>

      <style jsx>{`
        .terms-container {
          position: relative;
          overflow: hidden;
        }
        .terms-content {
          background: rgba(0, 0, 0, 0.85);
        }
        .terms-title {
          text-shadow: 2px 2px 8px rgba(173, 250, 29, 0.7);
        }
        .section-title {
          padding-bottom: 0.5rem;
        }
        .section-text {
          line-height: 1.6;
        }
        .terms-footer a {
          color: #adfa1d;
        }
        .terms-footer a:hover {
          color: #a6ff00bc;
        }
        /* Decorative Elements */
        .terms-decor {
          bottom: 0;
          height: 80px;
        }
        /* Extra Placeholders */
        .terms-placeholders {
          display: none;
        }
        .extra-placeholder {
          margin: 0;
          padding: 0;
          height: 1px;
        }
        @media (max-width: 768px) {
          .terms-content {
            padding: 1rem;
          }
          .terms-title {
            font-size: 2.5rem;
          }
          .section-title {
            font-size: 1.5rem;
          }
          .section-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
