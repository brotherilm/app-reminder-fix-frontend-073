import React from "react";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-custom-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-yellow-400 font-sans min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="flex flex-col items-center text-center py-20 px-4 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="animate-float absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="animate-float-delayed absolute bottom-10 right-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200"
        >
          Save your Crypto Airdrop progress, with over 100 airdrops!
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl mb-8 max-w-2xl text-gray-300"
        >
          Manage and track your favorite airdrops with our automatic reminders.
        </motion.p>

        <motion.div variants={fadeInUp} className="space-x-4">
          <a href="/subcription">
            <button className="transform hover:scale-105 transition-all bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-yellow-400/50">
              Get Premium
            </button>
          </a>
          <a href="/airdrop-reminder">
            <button className="transform hover:scale-105 transition-all bg-gray-800 hover:bg-gray-700 text-yellow-400 px-8 py-3 rounded-lg font-semibold border border-yellow-400/30">
              Try for Free
            </button>
          </a>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 md:px-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Product Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Airdrop Reminder",
              description:
                "Never miss an airdrop with our automatic reminders.",
            },
            {
              title: "Manage Airdrops",
              description:
                "Easily manage your airdrops, from dozens to hundreds, and maximize your chances to be a winner!",
            },
            {
              title: "Referral System",
              description:
                "Share all your links and airdrop data with others! Get 3 weeks free if you receive more than 10 referrals.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Subscription Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 md:px-10 bg-gray-800/50 backdrop-blur-lg"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Subscription
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-700/50 backdrop-blur-lg p-8 rounded-xl border border-yellow-400/10"
          >
            <h3 className="text-2xl font-semibold mb-4">Free</h3>
            <p className="text-gray-300">
              Enjoy the basic features at no cost.
            </p>
            <ul className="list-none space-y-3 mt-6">
              {[
                "Manage up to 10 airdrops",
                "Airdrop countdown timer",
                "Referral share feature",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 p-8 rounded-xl shadow-xl"
          >
            <h3 className="text-2xl font-semibold mb-4">Premium</h3>
            <p>Unlock exclusive features for the best experience.</p>
            <ul className="list-none space-y-3 mt-6">
              {[
                "Manage over 100 airdrops",
                "Airdrop countdown timer",
                "Organize airdrops by rating",
                "Additional notes for each airdrop",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <a href="/subcription">
              <button className="mt-8 w-full py-3 px-6 bg-gray-900 text-yellow-400 font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                Buy Premium
              </button>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900/80 backdrop-blur-lg text-center mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <span className="text-xl font-semibold">About Us</span>
          <div className="text-yellow-400 space-y-2">
            {[
              {
                text: "Follow us on X",
                link: "https://x.com",
                label: "AirdropReminder",
              },
              {
                text: "Email us at",
                link: "mailto:support@airdropreminder.com",
                label: "support@airdropreminder.com",
              },
              {
                text: "Join our Telegram group",
                link: "https://t.me/yourgroupname",
                label: "Click here",
              },
            ].map((item, index) => (
              <p key={index}>
                {item.text}:{" "}
                <a
                  href={item.link}
                  className="underline hover:text-yellow-300 transition-colors"
                >
                  {item.label}
                </a>
              </p>
            ))}
          </div>
        </motion.div>
        <p className="text-gray-500 mt-8">
          &copy; 2025 Airdrop Reminder. All Rights Reserved.
        </p>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
