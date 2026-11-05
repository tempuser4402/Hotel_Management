import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";

import sidebarMenu from "../Menu/sidebarMenu";

export default function Sidebar() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Automatically expand the active menu
  useEffect(() => {
    const activeItem = sidebarMenu
      .flatMap((section) => section.items)
      .find(
        (item) =>
          item.children?.length > 0 &&
          (location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`) ||
            item.children.some((child) => location.pathname === child.path)),
      );

    setExpandedMenu(activeItem?.label || null);
  }, [location.pathname]);

  // Toggle submenu
  const toggleMenu = (label) => {
    setExpandedMenu((current) => (current === label ? null : label));
  };

  // Check active menu
  const isItemActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-dvh w-67.5 flex-col overflow-hidden border-r border-white/10 bg-[#172B4D] text-white">
      {/* BRAND */}
      <div className="flex h-19 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22A06B] text-white shadow-lg shadow-black/20">
          <span className="text-xl font-bold">Y</span>
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">
            ASH
          </h1>

          <p className="text-[10px] font-medium uppercase tracking-[2px] text-white/50">
            Hotel Management
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-5">
        {sidebarMenu.map((section) => (
          <div key={section.title} className="mb-6">
            {/* SECTION TITLE */}
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-white/45">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const hasChildren = item.children && item.children.length > 0;

                const isExpanded = expandedMenu === item.label;

                const isActive = isItemActive(item.path);

                return (
                  <div key={item.label}>
                    {/* MAIN MENU ITEM */}
                    <div
                      className={`group relative flex items-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#22A06B]/15 text-white"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {/* ACTIVE INDICATOR */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-0.75 rounded-r-full bg-[#22A06B]" />
                      )}

                      <NavLink
                        to={item.path}
                        end={!hasChildren}
                        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5"
                      >
                        <Icon
                          size={19}
                          strokeWidth={1.8}
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? "text-[#22A06B]"
                              : "text-white/55 group-hover:text-white"
                          }`}
                        />

                        <span className="truncate text-[13px] font-medium">
                          {item.label}
                        </span>
                      </NavLink>

                      {/* SUBMENU TOGGLE */}
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.label)}
                          aria-label={`Toggle ${item.label} submenu`}
                          aria-expanded={isExpanded}
                          className="mr-2 rounded-md p-1.5 text-white/45 transition-all duration-200 hover:bg-white/10 hover:text-white"
                        >
                          <ChevronDown
                            size={15}
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-[#F59E0B]" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* SUBMENU ITEMS */}
                    {hasChildren && (
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="ml-5.5 mt-1 space-y-1 border-l border-white/15 pl-4">
                            {item.children.map((child) => {
                              const ChildIcon = child.icon;

                              return (
                                <NavLink
                                  key={child.path}
                                  to={child.path}
                                  end
                                  className={({ isActive }) =>
                                    `relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] transition-all duration-200 ${
                                      isActive
                                        ? "bg-[#22A06B]/15 font-semibold text-[#22A06B]"
                                        : "text-white/50 hover:bg-white/10 hover:text-white/90"
                                    }`
                                  }
                                >
                                  <ChildIcon
                                    size={15}
                                    strokeWidth={1.8}
                                    className="shrink-0"
                                  />

                                  <span>{child.label}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* USER PROFILE */}
      <div className="shrink-0 border-t border-white/10 bg-white/3 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/6 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22A06B]/20 text-[#22A06B]">
            <UserCircle2 size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Admin User
            </p>

            <p className="text-xs text-white/45">Hotel Administrator</p>
          </div>

          <button
            type="button"
            title="Logout"
            onClick={() => {
              // Connect your authentication logout function here.
            }}
            className="rounded-lg p-2 text-white/45 transition-all duration-200 hover:bg-[#E5484D]/15 hover:text-[#E5484D]"
          >
            <LogOut size={17} />
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-white/30">
          ASH PMS · Version 0.0.0
        </p>
      </div>
    </aside>
  );
}
