"use client";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { 
  FaHome, 
  FaEdit, 
  FaUsers, 
  FaChartBar, 
  FaSun, 
  FaMoon,
  FaSignOutAlt,
  FaChevronDown,
  FaTimes,
  FaBars
} from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useUserAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
    setMounted(true);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <FaHome className="text-lg" /> },
    { name: "Editor", path: "/editor", icon: <FaEdit className="text-lg" /> },
    { name: "Collab", path: "/collab", icon: <FaUsers className="text-lg" /> },
    { name: "Dashboard", path: "/dashboard", icon: <FaChartBar className="text-lg" /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and navigation links */}
          <div className="flex items-center">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => router.push("/")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white hidden md:block">
                Speedobits
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`${
                    pathname === item.path
                      ? "border-indigo-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                  } cursor-pointer inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right section - Theme toggle and Profile */}
          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <FaMoon className="h-5 w-5" />
              ) : (
                <FaSun className="h-5 w-5 text-yellow-400" />
              )}
            </button>

            {/* Profile dropdown */}
            {user ? (
              <div className="ml-4 relative profile-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none"
                  id="user-menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {user.photoURL ? (
                    <img
                      className="h-8 w-8 rounded-full border-2 border-indigo-500"
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <a
                      onClick={() => {
                        router.push("/dashboard");
                        setIsDropdownOpen(false);
                      }}
                      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Your Profile
                    </a>
                    <a
                      onClick={handleLogout}
                      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth")}
                className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                className={`${
                  pathname === item.path
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } cursor-pointer flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                <span className="mr-3 text-indigo-500">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {user.photoURL ? (
                    <img
                      className="h-10 w-10 rounded-full border-2 border-indigo-500"
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {user.displayName || "User"}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  onClick={() => {
                    router.push("/dashboard");
                    setIsOpen(false);
                  }}
                  className="cursor-pointer block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Your Profile
                </a>
                <a
                  onClick={handleLogout}
                  className="cursor-pointer block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;