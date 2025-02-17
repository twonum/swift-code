"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";
import { useRouter } from "next/navigation";

function AppSideBar() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar className="app-sidebar">
      <SidebarHeader className="sidebar-header p-5">
        <a
          href="/"
          className="sidebar-brand text-4xl font-bold text-[#ADFA1D] transition-all duration-700 ease-in-out hover:text-[#a6ff00bc] text-center"
        >
          SwiftCodee
        </a>
        <Button
          onClick={() => {
            router.push("/");
            toggleSidebar();
          }}
          variant="secondary"
          className="w-full mt-5"
        >
          <MessageCircleCode />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="sidebar-content p-3 scrollbar-hide overscroll-contain">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="sidebar-footer">
        <SideBarFooter />
      </SidebarFooter>
      <style jsx>{`
        .app-sidebar {
          width: 280px;
          min-height: 100vh;
          background: #000;
          border-right: 2px solid #adfa1d;
        }
        .sidebar-header {
          border-bottom: 2px solid #adfa1d;
          text-align: center;
        }
        .sidebar-brand {
          text-decoration: none;
        }
        .sidebar-content {
          overflow-y: auto;
          flex: 1;
        }
        .sidebar-footer {
          border-top: 2px solid #adfa1d;
          padding: 1rem;
        }
        @media (max-width: 768px) {
          .app-sidebar {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 2px solid #adfa1d;
          }
        }
        /* Extra decorative styles */
        .extra-element {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </Sidebar>
  );
}

export default AppSideBar;
