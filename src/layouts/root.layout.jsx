// Icons
import {
  X,
  Home,
  Menu,
  Users,
  LogOut,
  ChartBar,
  MessageCircle,
} from "lucide-react";

// React
import { useState } from "react";

// Images
import { logoImg } from "@/assets/images";

// Utils
import { formatDateUZ, getDayOfWeekUZ } from "@/utils/date.utils";

// Router
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  // Role-based navigation
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Foydalanuvchilar", href: "/users", icon: Users },
    { name: "Xabarlar", href: "/messages", icon: MessageCircle },
    { name: "Statistika", href: "/stats", icon: ChartBar },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out border-r lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  width={40}
                  alt="Logo"
                  height={40}
                  src={logoImg}
                  className="size-10 rounded-full"
                />

                <span className="lg:text-xl font-bold text-gray-900">
                  Insta Saver
                </span>
              </div>

              {/* Close sidebar */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="size-5 mr-3" strokeWidth={1.5} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="size-5 mr-3" strokeWidth={1.5} />
                Chiqish
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 inset-x-0 bg-white h-16 border-b border-gray-200">
            <div className="flex items-center justify-between gap-3.5 h-16 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center size-11 lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="size-6" strokeWidth={1.5} />
              </button>

              <div className="flex-1 lg:flex-none">
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find((item) => isActive(item.href))?.name ||
                    "Insta Saver"}
                </h1>
              </div>

              <p className="">
                <span className="hidden text-sm text-gray-500 sm:inline">
                  {formatDateUZ(new Date())}
                </span>{" "}
                <span className="capitalize text-sm text-gray-500">
                  {getDayOfWeekUZ(new Date())}
                </span>
              </p>
            </div>
          </header>

          {/* Page content */}
          <main className="p-5 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default RootLayout;
