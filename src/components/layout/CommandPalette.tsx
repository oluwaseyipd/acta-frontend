import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Settings,
  User,
  Search,
  Moon,
  Sun,
  Palette,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUIStore, ThemePreset } from "@/store/ui-store";
import { useTheme } from "next-themes";

const navigationItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
  { icon: PlusCircle, label: "Create Task", href: "/dashboard/create" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const themePresets: { value: ThemePreset; label: string; color: string }[] = [
  { value: "midnight", label: "Midnight", color: "bg-slate-800" },
  { value: "forest", label: "Forest", color: "bg-emerald-600" },
  { value: "sunset", label: "Sunset", color: "bg-amber-500" },
  { value: "lavender", label: "Lavender", color: "bg-violet-500" },
  { value: "nordic", label: "Nordic", color: "bg-slate-400" },
  { value: "cyberpunk", label: "Cyberpunk", color: "bg-pink-500" },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setThemePreset,
    setColorMode,
  } = useUIStore();
  const { setTheme } = useTheme();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!commandPaletteOpen) {
      setSearch("");
    }
  }, [commandPaletteOpen]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setCommandPaletteOpen(false);
  };

  const handleThemePreset = (preset: ThemePreset) => {
    setThemePreset(preset);
    setCommandPaletteOpen(false);
  };

  const handleColorMode = (mode: "light" | "dark") => {
    setColorMode(mode);
    setTheme(mode);
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput
        placeholder="Search tasks, navigate, or run commands..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleNavigation(item.href)}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme Presets">
          {themePresets.map((preset) => (
            <CommandItem
              key={preset.value}
              onSelect={() => handleThemePreset(preset.value)}
              className="cursor-pointer"
            >
              <div className={`mr-2 h-4 w-4 rounded-full ${preset.color}`} />
              {preset.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Appearance">
          <CommandItem
            onSelect={() => handleColorMode("light")}
            className="cursor-pointer"
          >
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </CommandItem>
          <CommandItem
            onSelect={() => handleColorMode("dark")}
            className="cursor-pointer"
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
