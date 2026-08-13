import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Command, Bell, Moon, Sun, Monitor, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/lib/profile";
import { authApi } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";


export function TopBar() {
  const { setCommandPaletteOpen, setColorMode, colorMode, toggleSidebar } = useUIStore();
  const { setTheme, theme } = useTheme();
  const isMobile = useIsMobile();

  // Get username and email from currently logged in user. Create an avater with the first two letters of the username.
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => profileApi.getProfile(),
  });

  const initials = (
    (user?.first_name?.slice(0, 1) || "") +
    (user?.last_name?.slice(0, 1) || "")
  ).toUpperCase() || "??";



  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    setColorMode(mode);
    setTheme(mode);
  };




  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 glass border-b border-border/50"
    >
      {/* Mobile Logo & Toggle */}
      {isMobile && (
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="/icon.png" className="h-7 w-7 object-contain" alt="Acta" />
          </div>
        </div>
      )}

      {/* Search */}
      <Button
        variant="outline"
        className="relative w-full md:w-72 justify-start text-muted-foreground hover:text-foreground hidden md:flex"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="flex-1 text-left">Search tasks...</span>
        <div className="flex items-center gap-1 text-xs">
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">
            <Command className="h-3 w-3 inline" />
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">
            K
          </kbd>
        </div>
      </Button>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Sun
                className={cn(
                  "h-5 w-5 transition-all",
                  theme === "dark" && "scale-0 rotate-90",
                )}
              />
              <Moon
                className={cn(
                  "absolute h-5 w-5 transition-all",
                  theme !== "dark" && "scale-0 -rotate-90",
                )}
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass">
            <DropdownMenuItem onClick={() => handleThemeChange("light")}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("system")}>
              <Monitor className="h-4 w-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />

                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.first_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="profile" className="w-full cursor-pointer">
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="settings" className="w-full cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => authApi.logout()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
