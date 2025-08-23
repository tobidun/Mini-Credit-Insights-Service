import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CreditCardIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useCurrentUser, useLogout } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Statements", href: "/statements", icon: DocumentTextIcon },
  { name: "Insights", href: "/insights", icon: ChartBarIcon },
  { name: "Credit Bureau", href: "/bureau", icon: CreditCardIcon },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  const getPageTitle = () => {
    const current = navigation.find((item) => item.href === location.pathname);
    return current?.name || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                Credit Insights
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile user section */}
          <div className="border-t border-gray-200 p-4">
            {userLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Not signed in</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72">
        <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-lg">
          {/* Desktop sidebar header */}
          <div className="flex h-16 items-center px-6 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                Credit Insights
              </h1>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop user section */}
          <div className="border-t border-gray-200 p-4">
            {userLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Not signed in</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 lg:hidden"
              >
                <Bars3Icon className="h-5 w-5 text-gray-600" />
              </button>

              {/* Page title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-4">
              {/* Search bar - hidden on mobile */}
              <div className="hidden sm:block">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
              </button>

              {/* User avatar - desktop only */}
              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};
