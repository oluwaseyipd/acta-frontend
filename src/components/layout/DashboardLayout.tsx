import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/SideBar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />

      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "ml-[72px]" : "ml-[256px]",
        )}
      >
        <TopBar />

        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
        >
          <div className="flex-1 p-6 flex flex-col min-w-0 max-w-full overflow-hidden">
            <Outlet />
          </div>
        </motion.main>
      </div>

      <CommandPalette />
    </div>
  );
}
