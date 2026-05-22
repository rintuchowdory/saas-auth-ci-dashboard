/**
 * DashboardLayout — persistent sidebar + header
 * Design: Slate Precision — dark sidebar, indigo active states, Geist font
 */
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  GitBranch,
  FolderGit2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Activity,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Pipelines", icon: GitBranch, href: "/pipelines", badge: "2" },
  { label: "Projects", icon: FolderGit2, href: "/projects" },
  { label: "Activity", icon: Activity, href: "/activity" },
  { label: "Security", icon: Shield, href: "/security" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]", collapsed && "justify-center px-2")}>
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-4 h-4 text-indigo-400" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-white tracking-tight">SaaS CI/CD</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
          const Icon = item.icon;
          const isPlaceholder = ["/activity", "/security", "/settings"].includes(item.href);

          return (
            <div key={item.href} className={`animate-slide-in-left stagger-${Math.min(i + 1, 5)}`}>
              {isPlaceholder ? (
                <button
                  onClick={() => toast.info("Feature coming soon", { description: `${item.label} page is under construction.` })}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150",
                    "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              ) : (
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 cursor-pointer",
                      isActive
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn("border-t border-white/[0.06] p-3", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <Avatar className="w-7 h-7 flex-shrink-0">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs">
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="hidden lg:flex items-center justify-center w-full py-2 text-slate-600 hover:text-slate-400 transition-colors border-t border-white/[0.04]"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center gap-3 px-4 lg:px-6 h-14 border-b border-white/[0.06] bg-background/80 backdrop-blur-sm flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Header actions */}
          <button
            onClick={() => toast.info("Notifications", { description: "No new notifications." })}
            className="relative text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-md hover:bg-white/5"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.06]">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs">
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm text-slate-300 font-medium">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
