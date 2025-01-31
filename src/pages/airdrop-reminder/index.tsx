import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Airdrop from "@/components/Airdrop";
import { withAuth } from "@/components/withAuth";
import Navbar from "@/components/navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <Airdrop />
    </div>
  );
}

export default withAuth(Home);
