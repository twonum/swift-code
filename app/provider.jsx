"use client";

import React, { useState, useMemo, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActionContext } from "@/context/ActionContext";

// Lazy load heavy components for faster initial load
const Header = dynamic(() => import("@/components/custom/Header"), {
  ssr: false,
});
const AppSideBar = dynamic(() => import("@/components/custom/AppSideBar"), {
  ssr: false,
});

function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [action, setAction] = useState();
  const convex = useConvex();

  // Retrieve user info from localStorage once.
  const storedUser = useMemo(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }, []);

  // Use real-time query for authentication details.
  // When storedUser is available, pass the email as argument;
  // otherwise, the query is not run (returns undefined).
  const userDetail = useQuery(
    api.users.GetUser,
    storedUser ? { email: storedUser.email } : undefined
  );

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
    >
      <UserDetailsContext.Provider
        value={{ userDetail, setUserDetail: () => {} }}
      >
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <ActionContext.Provider value={{ action, setAction }}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense fallback={<div>Loading header...</div>}>
                <Header />
              </Suspense>
              <SidebarProvider defaultOpen={false}>
                <Suspense fallback={<div>Loading sidebar...</div>}>
                  <AppSideBar />
                </Suspense>
                {children}
              </SidebarProvider>
            </ThemeProvider>
          </ActionContext.Provider>
        </MessagesContext.Provider>
      </UserDetailsContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
