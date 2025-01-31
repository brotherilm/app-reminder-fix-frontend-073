import React from "react";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { Star, Share2, Shield, Zap, Notebook } from "lucide-react";
import { withAuth } from "@/components/withAuth";

const Subscription: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-yellow-400 font-sans min-h-screen flex flex-col">
      <Navbar />

      <motion.div
        initial="initial"
        animate="animate"
        className="flex-grow py-20 px-4 md:px-10"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Choose Your Plan
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>

            <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
            <p className="text-gray-400 mb-6">Perfect for getting started</p>

            <div className="text-3xl font-bold mb-8">
              $0{" "}
              <span className="text-lg font-normal text-gray-400">/month</span>
            </div>

            <div className="space-y-4">
              {[
                { icon: Notebook, text: "Manage up to 10 airdrops" },
                { icon: Star, text: "Airdrop countdown timer" },
                { icon: Share2, text: "Referral share feature" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            <a href="/airdrop-reminder">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full mt-8 py-3 px-6 bg-gray-700 text-yellow-400 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Get Started
              </motion.button>
            </a>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-black/20 rounded-bl-lg text-sm font-bold">
              MOST POPULAR
            </div>

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Premium Plan
            </h3>
            <p className="text-gray-800 mb-6">For serious airdrop hunters</p>

            <div className="mb-8">
              <span className="text-gray-700 line-through text-lg">
                $7/month
              </span>
              <div className="text-4xl font-bold text-gray-900">
                $1.5 <span className="text-lg font-normal">for 1 month</span>
              </div>
              <div className="inline-block mt-2 px-3 py-1 bg-black/10 rounded-full text-sm font-semibold text-gray-900">
                71% OFF Limited Time
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "Includes Free Acces Feature" },
                { icon: Notebook, text: "Manage over 100 airdrops" },
                { icon: Star, text: "Organize airdrops by rating" },
                { icon: Zap, text: "Additional notes for each airdrop" },
                {
                  icon: Share2,
                  text: "Provide Link for announcement channel.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5 text-gray-900" />
                  <span className="text-gray-900">{feature.text}</span>
                </div>
              ))}
            </div>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdmNzrUC_2J4r1-cWAAarUrEVfgOWt1hVr8co16HGqtQSSdaw/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full mt-8 py-3 px-6 bg-gray-900 text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Get Premium Now
              </motion.button>
            </a>

            <p className="mt-4 text-sm text-gray-800 text-center">
              30-day money-back guarantee
            </p>
          </motion.div>
        </div>

        {/* Additional Benefits */}
        <motion.div variants={fadeInUp} className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">All Plans Include</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "24/7 Support", desc: "Get help whenever you need it" },
              { title: "Regular Updates", desc: "New features added monthly" },
              {
                title: "Secure Platform",
                desc: "Your data is always protected",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-gray-800/30 rounded-xl"
              >
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-gray-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default withAuth(Subscription);
