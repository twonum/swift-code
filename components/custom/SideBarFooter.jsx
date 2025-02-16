"use client";
import {
  Contact,
  LogOut,
  LogIn,
  MessageCircleMore,
  SidebarClose,
  Wallet,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "../ui/sidebar";
import { UserDetailsContext } from "@/context/UserDetailsContext";

function SideBarFooter() {
  const { toggleSidebar } = useSidebar();
  const { userDetail, setUserDetail } = useContext(UserDetailsContext);
  const router = useRouter();

  // Options list with conditional functionality:
  const options = [
    { name: "Hide", icon: SidebarClose },
    {
      name: "Manage Chats",
      icon: MessageCircleMore,
      path: "/recent-chats",
      disabled: !userDetail,
    },
    { name: "Contact", icon: Contact, path: "/contact" },
    { name: "Subscriptions", icon: Wallet, path: "/pricing" },
    userDetail
      ? { name: "Sign Out", icon: LogOut }
      : { name: "Sign In", icon: LogIn },
  ];
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

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleOptionClick = (option) => {
    if (option.name === "Sign Out") {
      handleSignOut();
    } else if (option.name === "Sign In") {
      handleSignIn();
    } else if (option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className="mb-3">
      {options.map((option, index) => (
        <Button
          onClick={() => {
            if (!option.disabled) {
              handleOptionClick(option);
              toggleSidebar();
            }
          }}
          variant="secondary"
          key={index}
          className="w-full mb-2"
          disabled={option.disabled}
        >
          {option.name}
          <option.icon className="ml-2" />
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
