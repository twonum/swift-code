// /components/custom/PricingModel.js
"use client";
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { LockIcon } from "lucide-react";
import SignInDialog from "./SignInDialog";

const containerVariants = {
  /* your animation variants */
};
const cardVariants = {
  /* your animation variants */
};

const PricingModel = ({ onSelectPlan }) => {
  const { userDetail } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <motion.div
        className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div key={index} className="relative">
            <motion.div
              className="border border-gray-400 p-7 flex flex-col gap-3 bg-black/50 rounded-none shadow-xl"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.h2 className="font-bold text-[#ADFA1D] text-2xl" layout>
                {pricing.name}
              </motion.h2>
              <motion.h2 className="font-medium text-lg text-gray-300" layout>
                {pricing.tokens}
              </motion.h2>
              <motion.p className="text-gray-400 font-mono" layout>
                {pricing.desc}
              </motion.p>
              <motion.h2
                className="font-bold text-4xl text-center mt-6 text-lime-500"
                layout
              >
                ${pricing.price}
              </motion.h2>
              <Button
                disabled={!userDetail}
                variant="secondary"
                className="mt-auto"
                onClick={() => onSelectPlan(pricing.name)}
              >
                Upgrade to {pricing.name}
              </Button>
            </motion.div>
            {!userDetail && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-lime-800 bg-opacity-80 p-10 space-y-4"
                role="status"
                aria-live="polite"
              >
                <LockIcon className="h-10 w-10 text-black" aria-hidden="true" />
                <h2 className="text-black text-xl font-bold">
                  Please login first.
                </h2>
                <Button
                  onClick={() => setOpenDialog(true)}
                  variant="secondary"
                  className="px-6 py-3 border border-[#ADFA1D] text-[#ADFA1D] font-semibold rounded-none transition-colors duration-300 hover:bg-[#ADFA1D] hover:text-black"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        ))}
      </motion.div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </>
  );
};

export default PricingModel;
