"use client";
import React, { Suspense } from "react";
import Hero from "@/components/custom/Hero";
import StunningLoader from "@/components/StunningLoader";

export default function Home() {
  return (
    <Suspense fallback={<StunningLoader />}>
      <Hero />
    </Suspense>
  );
}
