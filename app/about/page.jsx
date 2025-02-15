/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { useRouter } from "next/navigation";

// Variants for overall container and sections.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, when: "beforeChildren" },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 12 },
  },
};

// Decorative floating particles.
const FloatingParticle = ({ left, delay, size }) => (
  <motion.div
    className="absolute rounded-full bg-[#adfa1d]"
    style={{ width: size, height: size, left }}
    initial={{ top: "-10%", opacity: 0 }}
    animate={{ top: "110%", opacity: [0, 1, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Pulsating overlay lines for added depth.
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

const AboutPage = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  return (
    <div className="w-full overflow-hidden relative">
      {/* Animated Floating Particles */}
      <FloatingParticle left="5%" delay={0} size={15} />
      <FloatingParticle left="30%" delay={1} size={20} />
      <FloatingParticle left="60%" delay={0.5} size={12} />
      <FloatingParticle left="85%" delay={1.2} size={18} />
      <FloatingParticle left="40%" delay={0.8} size={10} />

      {/* Pulsating Overlay */}
      <PulsatingOverlay />

      <motion.div
        className="min-h-screen text-white relative z-10"
        style={{ background: "linear-gradient(to bottom, #000, #adfa1d78)" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER SECTION */}
        <motion.header
          className="w-full p-6 border-b border-white"
          variants={headerVariants}
        >
          <h1 className="text-4xl font-extrabold text-center uppercase">
            About Us
          </h1>
        </motion.header>

        {/* HERO SECTION */}
        <motion.section
          className="py-16 px-4 md:px-8"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to Our Amazing App
            </motion.h2>
            <motion.p className="text-lg md:text-xl leading-relaxed">
              We are dedicated to creating extraordinary digital experiences
              that blend cutting-edge technology with unparalleled design.
            </motion.p>
          </div>
        </motion.section>

        {/* OUR STORY SECTION */}
        <motion.section
          className="py-16 px-4 md:px-8 border-t border-white"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Our Story
            </motion.h3>
            <motion.p className="mb-6 text-lg leading-relaxed">
              Our journey began with a simple idea in a small workspace, driven
              by a passion for innovation. We started as a small team with big
              dreams and a commitment to excellence.
            </motion.p>
            <motion.p className="mb-6 text-lg leading-relaxed">
              Every project we undertake is infused with creativity, precision,
              and the desire to push the boundaries of what's possible. Our
              dedication to quality and our vision for the future have helped us
              evolve and grow every day.
            </motion.p>
            <motion.p className="mb-6 text-lg leading-relaxed">
              We believe that technology should serve to inspire and empower,
              and our story is one of continuous evolution, creativity, and the
              relentless pursuit of perfection.
            </motion.p>
          </div>
        </motion.section>

        {/* MISSION & VISION SECTION */}
        <motion.section
          className="py-16 px-4 md:px-8 border-t border-white"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <motion.h4 className="text-2xl font-bold mb-4">
                Our Mission
              </motion.h4>
              <motion.p className="text-lg leading-relaxed">
                To drive innovation by crafting digital experiences that are
                both aesthetically stunning and functionally flawless. We are
                committed to delivering products that empower and delight our
                users.
              </motion.p>
            </div>
            <div>
              <motion.h4 className="text-2xl font-bold mb-4">
                Our Vision
              </motion.h4>
              <motion.p className="text-lg leading-relaxed">
                To be at the forefront of digital transformation, setting new
                standards for design and usability. We envision a future where
                technology and art seamlessly merge to create experiences that
                resonate with people around the globe.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* TEAM SECTION */}
        <motion.section
          className="py-16 px-4 md:px-8 border-t border-white"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Meet the Team
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <motion.div
                className="bg-black p-6 border border-white text-center rounded-none"
                whileHover={{ scale: 1.05 }}
              >
                <motion.h5 className="text-xl font-bold mb-2">
                  Muhammad Taha
                </motion.h5>
                <motion.p className="text-sm text-gray-400 mb-2">
                  Lead Developer
                </motion.p>
                <motion.p className="text-base">
                  With over a decade of experience, Alex leads our development
                  team, building robust and innovative solutions.
                </motion.p>
              </motion.div>
              {/* Team Member 2 */}
              <motion.div
                className="bg-black p-6 border border-white text-center rounded-none"
                whileHover={{ scale: 1.05 }}
              >
                <motion.h5 className="text-xl font-bold mb-2">
                  Maria Rodriguez
                </motion.h5>
                <motion.p className="text-sm text-gray-400 mb-2">
                  UX/UI Designer
                </motion.p>
                <motion.p className="text-base">
                  Maria transforms complex ideas into intuitive designs,
                  ensuring a seamless and engaging user experience.
                </motion.p>
              </motion.div>
              {/* Team Member 3 */}
              <motion.div
                className="bg-black p-6 border border-white text-center rounded-none"
                whileHover={{ scale: 1.05 }}
              >
                <motion.h5 className="text-xl font-bold mb-2">
                  Liam Smith
                </motion.h5>
                <motion.p className="text-sm mb-2 text-gray-400">
                  Product Manager
                </motion.p>
                <motion.p className="text-base">
                  Liam oversees our projects from conception to launch, ensuring
                  every product aligns with our strategic vision.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* TIMELINE SECTION */}
        <motion.section
          className="py-16 px-4 md:px-8 border-t border-white"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Our Journey
            </motion.h3>
            <div className="space-y-8">
              {/* Timeline Item 1 */}
              <motion.div
                className="flex flex-col md:flex-row items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="md:w-1/3 text-center md:text-left">
                  <motion.span className="text-xl font-bold">2015</motion.span>
                </div>
                <div className="md:w-2/3 mt-4 md:mt-0">
                  <motion.h4 className="text-xl font-bold mb-2">
                    The Beginning
                  </motion.h4>
                  <motion.p className="text-lg leading-relaxed">
                    Our humble origins in a small workspace ignited the spark
                    for what would become a journey of innovation and
                    creativity.
                  </motion.p>
                </div>
              </motion.div>
              {/* Timeline Item 2 */}
              <motion.div
                className="flex flex-col md:flex-row items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="md:w-1/3 text-center md:text-left">
                  <motion.span className="text-xl font-bold">2017</motion.span>
                </div>
                <div className="md:w-2/3 mt-4 md:mt-0">
                  <motion.h4 className="text-xl font-bold mb-2">
                    Growth & Innovation
                  </motion.h4>
                  <motion.p className="text-lg leading-relaxed">
                    With a growing team and increased ambition, we embraced new
                    ideas and expanded our capabilities.
                  </motion.p>
                </div>
              </motion.div>
              {/* Timeline Item 3 */}
              <motion.div
                className="flex flex-col md:flex-row items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="md:w-1/3 text-center md:text-left">
                  <motion.span className="text-xl font-bold">2020</motion.span>
                </div>
                <div className="md:w-2/3 mt-4 md:mt-0">
                  <motion.h4 className="text-xl font-bold mb-2">
                    Digital Transformation
                  </motion.h4>
                  <motion.p className="text-lg leading-relaxed">
                    The global shift towards digital accelerated our evolution
                    as we adapted and innovated in real time.
                  </motion.p>
                </div>
              </motion.div>
              {/* Timeline Item 4 */}
              <motion.div
                className="flex flex-col md:flex-row items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="md:w-1/3 text-center md:text-left">
                  <motion.span className="text-xl font-bold">2023</motion.span>
                </div>
                <div className="md:w-2/3 mt-4 md:mt-0">
                  <motion.h4 className="text-xl font-bold mb-2">
                    Future Horizons
                  </motion.h4>
                  <motion.p className="text-lg leading-relaxed">
                    Today, we stand on the brink of new innovations, ready to
                    push the boundaries of digital experiences even further.
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CALL TO ACTION SECTION */}
        <motion.section
          className="py-16 px-4 md:px-8 border-t border-white"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h3 className="text-2xl md:text-3xl font-bold mb-6">
              Join Our Journey
            </motion.h3>
            <motion.p className="mb-8 text-lg leading-relaxed">
              Become part of our story. Whether you're a user, a partner, or a
              future team member, we invite you to explore the possibilities
              with us.
            </motion.p>
            <motion.button
              onClick={() => router.push("/get-started")}
              className="inline-block px-14 py-3 text-lg font-bold rounded-none bg-[#adfa1d] hover:bg-white text-black transition"
              whileHover={{ scale: 1.1, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.section>

        {/* EXTRA SECTION FOR ADDED DEPTH */}
        <motion.section
          className="py-16 px-4 md:px-8 border-t border-white"
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Why Choose Us?
            </motion.h3>
            <div className="space-y-8">
              <motion.div whileHover={{ scale: 1.03 }}>
                <motion.h4 className="text-xl font-bold mb-2">
                  Innovation
                </motion.h4>
                <motion.p className="text-lg leading-relaxed">
                  We are committed to staying ahead of the curve, constantly
                  exploring new technologies and creative solutions.
                </motion.p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }}>
                <motion.h4 className="text-xl font-bold mb-2">
                  Quality
                </motion.h4>
                <motion.p className="text-lg leading-relaxed">
                  Every project is crafted with meticulous attention to detail,
                  ensuring a flawless end product that exceeds expectations.
                </motion.p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }}>
                <motion.h4 className="text-xl font-bold mb-2">
                  Passion
                </motion.h4>
                <motion.p className="text-lg leading-relaxed">
                  Our work is driven by passion and an unwavering commitment to
                  excellence, pushing us to deliver outstanding experiences
                  every time.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default AboutPage;
