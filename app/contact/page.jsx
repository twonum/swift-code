/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

// Extra decorative floating particle component
const FloatingParticle = ({ delay, left, size }) => (
  <motion.div
    className="absolute rounded-full bg-[#adfa1d]"
    style={{ width: size, height: size, left }}
    initial={{ top: "-10%", opacity: 0 }}
    animate={{ top: "110%", opacity: [0, 1, 0] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

// Variants for the outer container with pulsating border animation.
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -50, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const labelVariants = {
  focus: { color: "#adfa1d", transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: {
    scale: 1.08,
    boxShadow: "0px 0px 25px #adfa1d",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const formBorderVariants = {
  animate: {
    boxShadow: ["0 0 0px #adfa1d", "0 0 20px #adfa1d", "0 0 0px #adfa1d"],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      access_key: "d5e71c26-c571-44c9-a647-d1d7307f3567",
      name,
      email,
      message,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Email Sent Successfully!",
          timer: 5000,
          showConfirmButton: false,
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "An unknown error occurred",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <motion.div
        className="h-screen flex items-center justify-center p-6 relative"
        style={{ background: "linear-gradient(to bottom, #000, #adfa1d78)" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating particles as extra background decoration */}
        <FloatingParticle delay={0} left="10%" size={15} />
        <FloatingParticle delay={1} left="40%" size={20} />
        <FloatingParticle delay={0.5} left="70%" size={12} />
        <FloatingParticle delay={1.2} left="85%" size={18} />
        <FloatingParticle delay={0.8} left="30%" size={10} />

        {/* Updated form container for inputs */}
        <motion.div
          className="p-8 bg-black bg-opacity-70 border border-[#ADFA1D] rounded-none shadow-xl max-w-3xl w-full mx-4 flex flex-col items-center relative z-10 max-h-[80vh] overflow-y-scroll scrollbar-hide overscroll-contain"
          variants={formBorderVariants}
          animate="animate"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center mb-8 text-white"
            variants={headerVariants}
          >
            Contact Us
          </motion.h1>
          <motion.form className="space-y-6 w-full" onSubmit={onSubmit}>
            <motion.div variants={fieldVariants}>
              <motion.label
                htmlFor="name"
                className="block text-sm mb-2 text-white"
                animate={focusedField === "name" ? "focus" : ""}
                variants={labelVariants}
              >
                Your Name
              </motion.label>
              <input
                type="text"
                id="name"
                autoComplete="off"
                value={name}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField("")}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-black border border-[#ADFA1D] text-white placeholder-white rounded-none focus:outline-none focus:ring-2 focus:ring-[#ADFA1D] transition-all duration-300"
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <motion.label
                htmlFor="email"
                className="block text-sm mb-2 text-white"
                animate={focusedField === "email" ? "focus" : ""}
                variants={labelVariants}
              >
                Your Email
              </motion.label>
              <input
                type="email"
                id="email"
                value={email}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-black border border-[#ADFA1D] text-white placeholder-white rounded-none focus:outline-none focus:ring-2 focus:ring-[#ADFA1D] transition-all duration-300"
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <motion.label
                htmlFor="message"
                className="block text-sm mb-2 text-white"
                animate={focusedField === "message" ? "focus" : ""}
                variants={labelVariants}
              >
                Your Message
              </motion.label>
              <textarea
                id="message"
                value={message}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField("")}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="w-full p-3 bg-black border border-[#ADFA1D] text-white placeholder-white rounded-none focus:outline-none focus:ring-2 focus:ring-[#ADFA1D] transition-all duration-300"
              ></textarea>
            </motion.div>
            <motion.div variants={fieldVariants} className="text-center">
              <motion.button
                type="submit"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full px-8 py-3 text-lg font-bold rounded-none bg-[#adfa1d] hover:bg-white text-black transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
      {/* Additional Animated Overlay Lines */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #adfa1d33 25%, transparent 25%), linear-gradient(-45deg, #adfa1d33 25%, transparent 25%)",
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0, 25px 25px",
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
