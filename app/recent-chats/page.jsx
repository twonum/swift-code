"use client";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LockIcon } from "lucide-react";
import SignInDialog from "@/components/custom/SignInDialog";

// Spinner component for refresh and loading animations.
const Spinner = () => (
  <motion.div
    className="spinner"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    style={{
      border: "4px solid #adfa1d",
      borderTop: "4px solid transparent",
      borderRadius: "50%",
      width: 24,
      height: 24,
    }}
  />
);

// Additional animated debug/info component.
const DebugInfo = ({ message }) => (
  <motion.div
    className="debug-info"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.3 }}
  >
    {message}
  </motion.div>
);

// SortOptions component updated to accept a disabled prop.
const SortOptions = ({ sortOrder, toggleSort, disabled }) => (
  <motion.div
    className="sort-options flex items-center gap-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <span className="text-white">Order:</span>
    <motion.button
      onClick={toggleSort}
      whileTap={{ scale: 0.9 }}
      disabled={disabled}
      className="px-3 py-1 border border-[#adfa1d] text-white bg-black bg-opacity-70 rounded-none transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50"
    >
      {sortOrder === "desc" ? "Newest First" : "Oldest First"}
    </motion.button>
  </motion.div>
);

// ChatCard component with a delete button.
const ChatCard = ({ workspace, onDelete }) => {
  const displayDate = workspace?.createdAt || workspace?._creationTime;
  return (
    <motion.div
      className="chat-card-wrapper relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={"/workspace/" + workspace?._id}
        className="chat-card block p-6 border border-[#adfa1d] bg-black bg-opacity-70 shadow-lg transition-all duration-300 hover:bg-opacity-90 rounded-none"
      >
        <h2 className="chat-snippet text-lg font-bold text-white mb-2">
          {workspace?.messages && workspace?.messages[0]
            ? workspace?.messages[0]?.content.slice(0, 100) +
              (workspace?.messages[0]?.content.length > 100 ? "..." : "")
            : "No chat content available"}
        </h2>
        <p className="chat-info text-sm text-white text-opacity-80">
          {displayDate
            ? new Date(displayDate).toLocaleDateString()
            : "Unknown Date"}
        </p>
      </Link>
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete(workspace?._id);
        }}
        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-none hover:bg-red-700 transition-all duration-300"
      >
        Delete
      </button>
    </motion.div>
  );
};

function RecentChatsPage() {
  const { userDetail } = useContext(UserDetailsContext);
  const convex = useConvex();
  const router = useRouter();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [debugMessage, setDebugMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Add state for dialog

  // Debounce effect for live search.
  useEffect(() => {
    const handler = setTimeout(() => {
      setActiveSearchQuery(searchInput);
      if (searchInput.trim() !== "") {
        setDebugMessage(`Live search: "${searchInput}"`);
      } else {
        setDebugMessage("");
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch workspaces using GetRecentWorkspaces.
  const fetchWorkspaces = useCallback(async () => {
    if (!userDetail) return;
    try {
      const result = await convex.query(api.workspace.GetRecentWorkspaces, {
        userId: userDetail?._id,
      });
      setWorkspaceList(result);
      setDebugMessage(
        `Fetched ${result.length} workspaces at ${new Date().toLocaleTimeString()}`
      );
      console.log("Workspaces:", result);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setDebugMessage("Error fetching workspaces");
    }
  }, [convex, userDetail]);

  // Initial fetch when userDetail becomes available.
  useEffect(() => {
    if (userDetail) {
      fetchWorkspaces();
    }
  }, [userDetail, fetchWorkspaces]);

  // Handler to refresh workspaces.
  const handleRefresh = async () => {
    if (!userDetail) return;
    setRefreshing(true);
    await fetchWorkspaces();
    setRefreshing(false);
  };

  // Toggle sort order.
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setDebugMessage(
      `Sort order changed to ${sortOrder === "desc" ? "Oldest First" : "Newest First"}`
    );
  };

  // Delete workspace handler.
  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      await convex.mutation(api.workspace.DeleteWorkspace, { workspaceId });
      setDebugMessage(`Workspace deleted: ${workspaceId}`);
      fetchWorkspaces();
    } catch (error) {
      console.error("Error deleting workspace:", error);
      setDebugMessage("Error deleting workspace");
    }
  };

  // Filter workspaces based on search query.
  const filteredWorkspaces = useMemo(() => {
    if (!activeSearchQuery) return workspaceList;
    return workspaceList.filter((workspace) => {
      return (
        workspace?.messages &&
        workspace?.messages[0] &&
        workspace?.messages[0]?.content
          .toLowerCase()
          .includes(activeSearchQuery.toLowerCase())
      );
    });
  }, [workspaceList, activeSearchQuery]);

  // Sort workspaces.
  const sortedWorkspaces = useMemo(() => {
    return [...filteredWorkspaces].sort((a, b) => {
      const dateA = new Date(a.createdAt || a._creationTime);
      const dateB = new Date(b.createdAt || b._creationTime);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredWorkspaces, sortOrder]);

  // Compute last update date.
  const lastUpdateDate = useMemo(() => {
    if (
      sortedWorkspaces.length > 0 &&
      (sortedWorkspaces[0].createdAt || sortedWorkspaces[0]._creationTime)
    ) {
      return new Date(
        sortedWorkspaces[0].createdAt || sortedWorkspaces[0]._creationTime
      ).toLocaleDateString();
    }
    return "N/A";
  }, [sortedWorkspaces]);

  return (
    <div className="recent-chats-page min-h-screen bg-gradient-to-br from-black to-[#adfa1d78] text-white flex flex-col items-center p-6">
      {/* Animated Header Section */}
      <motion.header
        className="w-full mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="page-title text-5xl font-extrabold text-[#adfa1d] underline text-center"
          style={{ textShadow: "2px 2px 10px rgba(173,250,29,0.7)" }}
        >
          Recent Chats
        </h1>
        <p className="sub-title text-center text-white text-opacity-80 mt-5">
          Stay connected with your latest conversations.
        </p>
      </motion.header>

      {/* Live Search Bar */}
      <motion.div
        className="search-bar w-full max-w-4xl mb-8 flex justify-center"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="text"
          placeholder="Type to search chats..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={!userDetail}
          className="w-full p-3 bg-black border border-[#adfa1d] text-white placeholder-white rounded-none focus:outline-none focus:ring-2 focus:ring-[#adfa1d] transition-all duration-300 disabled:opacity-50"
        />
      </motion.div>

      {/* Refresh and Sort Options */}
      <motion.div
        className="w-full max-w-4xl flex justify-between mb-4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={handleRefresh}
          whileTap={{ scale: 0.95 }}
          disabled={!userDetail}
          className="refresh-btn px-4 py-2 flex items-center gap-2 border border-[#adfa1d] text-white bg-black bg-opacity-70 shadow-lg transition-all duration-300 hover:bg-opacity-90 rounded-none disabled:opacity-50"
        >
          {refreshing ? (
            <>
              <Spinner />
              <span>Refreshing...</span>
            </>
          ) : (
            "Refresh Chats"
          )}
        </motion.button>
        <SortOptions
          sortOrder={sortOrder}
          toggleSort={toggleSort}
          disabled={!userDetail}
        />
      </motion.div>

      {/* Animated Search Status */}
      <AnimatePresence>
        {activeSearchQuery && (
          <motion.div
            key="searchStatus"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-[#adfa1d] text-sm"
          >
            Showing results for: <strong>{activeSearchQuery}</strong>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="decorative-bar w-96 h-1 bg-[#adfa1d] rounded-none"></div>

      {/* Chats Grid or Login Prompt Card */}
      {userDetail ? (
        <>
          <motion.div
            className="chats-container mt-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {sortedWorkspaces && sortedWorkspaces.length > 0 ? (
                sortedWorkspaces.map((workspace, index) => (
                  <ChatCard
                    key={workspace?._id || index}
                    workspace={workspace}
                    onDelete={handleDeleteWorkspace}
                  />
                ))
              ) : (
                <motion.div
                  className="w-full font-mono text-center text-[#adfa1d] text-opacity-80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Oops! Nothing to show here...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Floating New Chat Button */}
          <motion.div
            className="fixed bottom-8 right-8 z-50" // ensures the button stays visible on top of other content
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={() => router.push("/")}
              variant="secondary"
              className="px-4 py-2 text-sm shadow-lg rounded-full hover:shadow-xl"
            >
              New Chat!
            </Button>
          </motion.div>
        </>
      ) : (
        // Big rectangular card prompting login.
        <motion.div
          className="chat-card-wrapper relative mt-11 w-full max-w-6xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="chat-card block p-6 border border-[#adfa1d] bg-black bg-opacity-70 shadow-lg transition-all duration-300 hover:bg-opacity-90 rounded-none text-center">
            <h2 className="chat-snippet text-lg font-bold text-white mb-2">
              Please login first.
            </h2>
            <Button
              onClick={() => setOpenDialog(true)} // Open dialog on click
              variant="secondary"
            >
              Login
            </Button>
          </div>
        </motion.div>
      )}

      {/* Additional Decorative Section */}
      <motion.div
        className="decorative-section w-full max-w-6xl mt-12 flex flex-col items-center space-y-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="decorative-bar mt-14 w-full h-1 bg-[#adfa1d] rounded-none"></div>
        <div className="decorative-text text-white text-opacity-80 text-center">
          Keep your conversations alive and vibrant.
        </div>
        <div className="decorative-bar w-full h-1 bg-[#adfa1d] rounded-none"></div>
        <div className="decorative-animation flex space-x-4">
          <div className="anim-box w-8 h-8 bg-[#adfa1d] animate-pulse rounded-none"></div>
          <div className="anim-box w-8 h-8 bg-[#adfa1d] animate-pulse rounded-none"></div>
          <div className="anim-box w-8 h-8 bg-[#adfa1d] animate-pulse rounded-none"></div>
        </div>
      </motion.div>

      {/* Statistics Section with Login Overlay */}
      <div className="relative w-full max-w-4xl mt-12">
        <motion.div
          className="stats-section p-4 border border-[#adfa1d] bg-black bg-opacity-70 rounded-none shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="stats-title text-3xl font-bold text-[#adfa1d] text-center mb-4">
            Chat Statistics
          </h2>
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="stat-item p-4 border border-[#adfa1d] bg-black bg-opacity-80 rounded-none">
              <h3 className="stat-label text-lg font-semibold text-white">
                Total Workspaces
              </h3>
              <p className="stat-value text-2xl font-bold text-[#adfa1d]">
                {workspaceList ? workspaceList.length : 0}
              </p>
            </div>
            <div className="stat-item p-4 border border-[#adfa1d] bg-black bg-opacity-80 rounded-none">
              <h3 className="stat-label text-lg font-semibold text-white">
                Last Update
              </h3>
              <p className="stat-value text-2xl font-bold text-[#adfa1d]">
                {lastUpdateDate}
              </p>
            </div>
          </div>
          {/* Debug Message */}
          <div className="mt-4 font-mono text-center">
            <AnimatePresence>
              {debugMessage && <DebugInfo message={debugMessage} key="debug" />}
            </AnimatePresence>
          </div>
        </motion.div>
        {/* Login overlay on chat stats */}
        {!userDetail && (
          <div
            className="p-10 bg-lime-800 opacity-80 absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <LockIcon className="h-10 w-10 text-black" aria-hidden="true" />
            <h2 className="text-black pl-2 mb-4">Please login first.</h2>
            <Button
              onClick={() => setOpenDialog(true)} // Open dialog on click
              variant="secondary"
            >
              Login
            </Button>
          </div>
        )}
      </div>
      <style jsx>{`
        /* Overall Page Styles */
        .recent-chats-page {
          width: 100%;
        }
        .page-title {
          margin-bottom: 0.5rem;
        }
        .sub-title {
          font-size: 1.2rem;
        }
        .search-bar input {
          font-size: 1rem;
        }
        .refresh-btn {
          font-size: 0.9rem;
        }
        .chats-container {
          margin-top: 1rem;
        }
        .chat-card {
          text-decoration: none;
          border-radius: 0;
        }
        .chat-card:hover {
          transform: scale(1.02);
        }
        .chat-snippet {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        /* Decorative Section Styles */
        .decorative-section .decorative-bar {
          margin: 0.5rem 0;
        }
        .decorative-animation .anim-box {
          animation-duration: 1.5s;
          animation-iteration-count: infinite;
        }
        /* Statistics Section */
        .stats-section {
          margin-top: 2rem;
        }
        .stats-title {
          text-shadow: 2px 2px 8px rgba(173, 250, 29, 0.7);
        }
        .stat-item {
          text-align: center;
        }
        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }
          .sub-title {
            font-size: 1rem;
          }
          .search-bar input {
            font-size: 0.9rem;
          }
          .refresh-btn {
            font-size: 0.8rem;
          }
        }
        .debug-info {
          margin-top: 2rem;
          font-size: 0.8rem;
          color: #adfa1d;
        }
      `}</style>
      {/* Render the SignInDialog */}
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
}

export default RecentChatsPage;
