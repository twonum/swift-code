"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailsContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const mobileMenuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateName = (name, maxLength = windowWidth < 480 ? 10 : 14) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  const truncatedUserName =
    userDetail && userDetail.name ? truncateName(userDetail.name) : "";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleSignOut = () => {
    // Clear stored user data in localStorage.
    localStorage.removeItem("user");
    // Clear the auth-token cookie by setting an expired date.
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // Update the user context.
    setUserDetail(null);
    // Optionally reload the page.
    window.location.reload();
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Brand Logo */}
        <div className="brand">
          <Link
            href="/"
            className="relative text-[#8cba35] inline-block group brand-link"
          >
            SwiftCodee
            <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links px-4 py-2">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="relative text-[#adfa1de3] inline-block group"
              >
                Home
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="relative text-[#adfa1d89] inline-block group"
              >
                Pricing
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/get-started"
                className="relative  text-[#adfa1d69] inline-block group"
              >
                Start
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className="relative text-[#adfa1d42] inline-block group"
              >
                About
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="relative text-[#adfa1d25] inline-block group"
              >
                Contact
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/recent-chats"
                className="relative inline-block text-[#acff11] group"
              >
                Chats
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="user-actions">
          {userDetail && userDetail.name ? (
            <div className="user-info">
              <span className="relative inline-block group welcome-message">
                Welcome, {truncatedUserName}!
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </span>
              <Button
                variant="secondary"
                onClick={handleSignOut}
                className="signout-btn h-7"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Button
                onClick={() => router.push("/get-started")}
                variant="secondary"
                className="get-started-btn"
              >
                Start Now
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="secondary"
                className="signin-btn"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Hamburger for Mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Mobile Menu with Framer Motion animations */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu scrollbar-hide"
              ref={mobileMenuRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              transition={{ duration: 0.3 }}
            >
              <ul className="mobile-nav-list">
                <li className="mobile-nav-item">
                  <Link
                    href="/"
                    className="relative inline-block group mobile-nav-link text-[#adfa1de3]"
                    onClick={handleCloseMenu}
                  >
                    Home
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    href="/pricing"
                    className="relative inline-block group mobile-nav-link text-[#adfa1d89]"
                    onClick={handleCloseMenu}
                  >
                    Pricing
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    href="/get-started"
                    className="relative inline-block group mobile-nav-link text-[#adfa1d69]"
                    onClick={handleCloseMenu}
                  >
                    Start
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    href="/about"
                    className="relative inline-block group mobile-nav-link text-[#adfa1d42]"
                    onClick={handleCloseMenu}
                  >
                    About
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    href="/contact"
                    className="relative inline-block group mobile-nav-link text-[#adfa1d25]"
                    onClick={handleCloseMenu}
                  >
                    Contact
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    href="/recent-chats"
                    className="relative inline-block group mobile-nav-link text-[#acff11]"
                    onClick={handleCloseMenu}
                  >
                    Chats
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Extra Decorative Elements */}
      <div className="header-decor">
        <div className="decor-line"></div>
        <div className="decor-line"></div>
        <div className="decor-circle"></div>
        <div className="decor-square"></div>
        <div className="decor-triangle"></div>
        <div className="decor-wave"></div>
        <div className="extra-element-1"></div>
        <div className="extra-element-2"></div>
        <div className="extra-element-3"></div>
        <div className="extra-element-4"></div>
        <div className="extra-element-5"></div>
        <div className="extra-element-6"></div>
        <div className="extra-element-7"></div>
        <div className="extra-element-8"></div>
        <div className="extra-element-9"></div>
        <div className="extra-element-10"></div>
        <div className="extra-element-11"></div>
        <div className="extra-element-12"></div>
        <div className="extra-element-13"></div>
        <div className="extra-element-14"></div>
        <div className="extra-element-15"></div>
      </div>

      {/* Styled JSX CSS */}
      <style jsx>{`
        /* Header Container */
        .header-container {
          background: linear-gradient(to right, #000, #adfa1d78);
          padding: 1.3rem 2rem;
          position: relative;
          z-index: 100;
          border-bottom: 2px solid #adfa1d;
        }
        /* Header Inner */
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          transition: all 0.3s ease;
        }
        /* Brand */
        .brand {
          flex: 1;
          transition: all 0.3s ease;
        }
        .brand-link {
          font-size: 3rem;
          font-weight: bold;
          color: #adfa1d;
          text-decoration: none;
          transition: color 0.7s ease-in-out;
        }
        .brand-link:hover {
          color: #a6ff00bc;
        }
        /* Navigation Links */
        .nav-links {
          flex: 2;
          text-align: center;
        }
        .nav-list {
          list-style: none;
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          font-size: 1.5rem;
          font-weight: bold;
          color: black;
          position: relative;
          text-decoration: none;
          transition: all 0.5s ease;
        }
        .nav-link:hover {
          color: #a6ff00bc;
        }
        .nav-link:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0;
          height: 2px;
          background-color: #a6ff00bc;
          transition: width 0.3s ease-out;
        }
        .nav-link:hover:after {
          width: 100%;
        }
        /* User Actions */
        .user-actions {
          flex: 1;
          text-align: right;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .auth-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        .get-started-btn {
          background: #adfa1d;
          color: black;
          border-radius: 0;
          font-size: 1.2rem;
          font-weight: bold;
          transition: transform 0.5s ease;
        }
        .get-started-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 0 10px #adfa1d;
        }
        .signin-btn {
          background: transparent;
          color: #adfa1d;
          border: 1px solid #adfa1d;
          border-radius: 0;
          font-size: 1.2rem;
          font-weight: bold;
          transition: background 0.5s ease;
        }
        .signin-btn:hover {
          background: #adfa1d;
          color: black;
        }
        .user-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          justify-content: flex-end;
        }
        .welcome-message {
          font-size: 1.1rem;
          font-family: "Courier New", Courier, monospace;
          color: #adfa1d;
          font-weight: 500;
          text-shadow:
            1px 1px 3px rgba(173, 250, 29, 0.7),
            0 0 10px rgba(173, 250, 29, 0.6);
          animation: pulseText 2s ease-in-out infinite alternate;
        }
        @keyframes pulseText {
          from {
            text-shadow:
              1px 1px 3px rgba(173, 250, 29, 0.7),
              0 0 10px rgba(173, 250, 29, 0.6);
          }
          to {
            text-shadow:
              2px 2px 5px rgba(173, 250, 29, 1),
              0 0 20px rgba(173, 250, 29, 0.8);
          }
        }
        .signout-btn {
          background: transparent;
          color: #adfa1d;
          border: 1px solid #adfa1d;
          border-radius: 0;
          font-size: 1.2rem;
          font-weight: bold;
          transition: background 0.5s ease;
        }
        .signout-btn:hover {
          background: #adfa1d;
          color: black;
        }
        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          transition: transform 0.3s ease;
        }
        .hamburger:hover {
          transform: rotate(10deg);
        }
        .bar {
          width: 25px;
          height: 3px;
          background-color: #adfa1d;
          transition: all 0.3s ease;
        }
        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          left: 0;
          background: #000;
          padding: 1rem;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 200;
        }
        .mobile-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .mobile-nav-item {
          margin: 1rem 0;
        }
        .mobile-nav-link {
          font-size: 1.75rem;
          font-weight: bold;
          color: black;
          text-decoration: none;
          transition: color 0.5s ease;
        }
        .mobile-nav-link:hover {
          color: #a6ff00bc;
        }
        @media (max-width: 1024px) {
          .header-inner {
            flex-direction: row;
            align-items: center;
          }
          .brand {
            margin-right: 1rem;
          }
          .user-actions {
            margin-left: 1rem;
          }
          .brand-link {
            font-size: 2.8rem;
          }
          .nav-link {
            font-size: 1.4rem;
          }
        }
        @media (max-width: 768px) {
          .brand {
            margin-bottom: 1rem;
          }
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
            margin-bottom: 0.9rem;
            margin-left: 1rem;
          }
          .mobile-menu {
            display: block;
          }
          .user-info,
          .auth-buttons {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            width: 80%;
          }
        }
        @media (max-width: 480px) {
          .brand {
            margin-bottom: 1rem;
          }
          .brand-link {
            font-size: 2.5rem;
          }
          .mobile-nav-link {
            font-size: 1.5rem;
          }
          /* Increase button touch areas and stack them for mobile */
          .auth-buttons {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
            width: 80%;
            margin-bottom: 1rem;
          }
          .signout-btn,
          .signin-btn,
          .get-started-btn {
            font-size: 1rem;
            padding: 0.75rem 1.25rem;
            width: 100%;
            max-width: 230px;
            text-align: center;
            margin-bottom: 1rem;
          }
          /* Center user actions on small screens */
          .user-actions {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .header-container {
            padding: 1rem 1.5rem;
          }
          .hamburger {
            margin-bottom: 0.9rem;
          }
          .hamburger .bar {
            width: 20px;
            height: 2.5px;
          }
        }
        /* Apply styles for screens 384px and below */
        @media screen and (max-width: 384px) {
          .signout-btn,
          .signin-btn,
          .get-started-btn {
            margin-top: 3rem;
          }
        }

        /* Extra Decorative Elements */
        .header-decor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          pointer-events: none;
        }
        .decor-line {
          width: 20%;
          height: 2px;
          background-color: #adfa1d;
        }
        .decor-circle {
          width: 15px;
          height: 15px;
          background-color: #adfa1d;
          border-radius: 0;
        }
        .decor-square {
          width: 15px;
          height: 15px;
          background-color: #adfa1d;
          border-radius: 0;
        }
        .decor-triangle {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 15px solid #adfa1d;
        }
        .decor-wave {
          width: 50px;
          height: 10px;
          background: repeating-linear-gradient(
            -45deg,
            #adfa1d,
            #adfa1d 5px,
            transparent 5px,
            transparent 10px
          );
        }
        /* Extra Elements for Extended Styling */
        .extra-element-1,
        .extra-element-2,
        .extra-element-3,
        .extra-element-4,
        .extra-element-5,
        .extra-element-6,
        .extra-element-7,
        .extra-element-8,
        .extra-element-9,
        .extra-element-10,
        .extra-element-11,
        .extra-element-12,
        .extra-element-13,
        .extra-element-14,
        .extra-element-15 {
          width: 10px;
          height: 10px;
          background-color: #adfa1d;
          border-radius: 0;
          transition: background 0.3s ease;
        }
        .extra-element-1:hover,
        .extra-element-2:hover,
        .extra-element-3:hover,
        .extra-element-4:hover,
        .extra-element-5:hover,
        .extra-element-6:hover,
        .extra-element-7:hover,
        .extra-element-8:hover,
        .extra-element-9:hover,
        .extra-element-10:hover,
        .extra-element-11:hover,
        .extra-element-12:hover,
        .extra-element-13:hover,
        .extra-element-14:hover,
        .extra-element-15:hover {
          background-color: #a6ff00bc;
        }
      `}</style>
    </header>
  );
}

export default Header;
