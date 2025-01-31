import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useRouter(); // Mendapatkan path URL saat ini

  const handleLogout = () => {
    logout();
  };

  const menuVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  const linkHoverStyle =
    "relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 hover:after:w-full after:transition-all";

  useEffect(() => {
    // Reset open state ketika navigasi terjadi (untuk menutup mobile menu)
    setIsOpen(false);
  }, [pathname]); // Hook ini akan dipicu setiap kali URL berubah

  return (
    <nav className="relative backdrop-blur-lg bg-black/80 border-t-4 border-b-4 border-yellow-400 z-50">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="container mx-auto px-4"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center py-4">
          <div className="flex space-x-8">
            <a
              href="/"
              className={`text-white hover:text-yellow-400 transition-colors ${linkHoverStyle}`}
            >
              Home
            </a>
            <a
              href="/airdrop-reminder"
              className={`text-white hover:text-yellow-400 transition-colors ${linkHoverStyle}`}
            >
              Airdrop Reminder
            </a>
            <a
              href="/subcription"
              className={`text-white hover:text-yellow-400 transition-colors ${linkHoverStyle}`}
            >
              Subscription
            </a>
          </div>
          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <a href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    Login
                  </motion.button>
                </a>
                <a href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
                  >
                    Register
                  </motion.button>
                </a>
              </>
            ) : (
              <>
                <a href="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    Profile
                  </motion.button>
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  Logout
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-4">
          <a href="/" className="text-white text-xl font-bold">
            AirdropReminder
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="md:hidden overflow-hidden bg-black/95"
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <a
            href="/"
            className="text-white hover:text-yellow-400 transition-colors py-2"
          >
            Home
          </a>
          <a
            href="/airdrop-reminder"
            className="text-white hover:text-yellow-400 transition-colors py-2"
          >
            Airdrop Reminder
          </a>
          <a
            href="/subcription"
            className="text-white hover:text-yellow-400 transition-colors py-2"
          >
            Subscription
          </a>
          {!isAuthenticated ? (
            <>
              <a
                href="/auth/login"
                className="text-white hover:text-yellow-400 transition-colors py-2"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="text-white hover:text-yellow-400 transition-colors py-2"
              >
                Register
              </a>
            </>
          ) : (
            <>
              <a
                href="/profile"
                className="text-white hover:text-yellow-400 transition-colors py-2"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-400 transition-colors py-2 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
