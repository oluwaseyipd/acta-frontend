import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarClock,
  PlusCircle,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Waves,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: CalendarClock, label: "Today", href: "/dashboard/today" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
  { icon: CheckCircle2, label: "Completed", href: "/dashboard/completed" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
];

const bottomNavItems = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({
    icon: Icon,
    label,
    href,
  }: {
    icon: typeof LayoutDashboard;
    label: string;
    href: string;
  }) => {
    const active = isActive(href);

    const content = (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
          active
            ? "bg-primary text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <Icon
          className={cn("h-5 w-5 shrink-0", active && "animate-pulse-subtle")}
        />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {active && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-xl bg-primary -z-10"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );

    if (sidebarCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const CreateTaskButton = () => {
    const content = (
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative w-full",
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90",
        )}
      >
        <PlusCircle className="h-5 w-5 shrink-0" />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              Create Task
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );

    if (sidebarCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Create Task
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-screen fixed top-0 left-0 flex flex-col glass border-r border-border/50 z-50"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground shrink-0">
            <Waves className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h1 className="text-xl font-bold text-gradient">Acta</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Create Task - First with gap */}
          <div className="mb-6">
            <CreateTaskButton />
          </div>

          {/* Other Nav Items */}
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4 space-y-1.5 border-t border-border/50">
          {bottomNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {/* Collapse Toggle */}
        <div className="px-3 py-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-center hover:bg-secondary"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </motion.aside>

      {/* Create Task Modal */}
      {/*<CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />*/}
    </>
  );
}
