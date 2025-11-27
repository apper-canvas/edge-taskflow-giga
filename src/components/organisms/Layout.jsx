import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth")
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/auth")
  }

  const menuItems = [
    { path: "/", icon: "BarChart3", label: "Dashboard", exact: true },
    { path: "/tasks", icon: "CheckSquare", label: "My Tasks" },
    { path: "/today", icon: "Calendar", label: "Today" },
    { path: "/upcoming", icon: "Clock", label: "Upcoming" },
    { path: "/completed", icon: "CheckCheck", label: "Completed" },
    { path: "/projects", icon: "FolderOpen", label: "Projects" },
    { path: "/calendar", icon: "CalendarDays", label: "Calendar" },
    { path: "/teams", icon: "Users", label: "Teams" },
    { path: "/settings", icon: "Settings", label: "Settings" }
  ]

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 z-50 transform transition-transform duration-300 ease-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Stay organized</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive: navIsActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  (navIsActive || isActive(item.path, item.exact))
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
              >
                <ApperIcon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-700"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center shadow">
                <ApperIcon name="CheckSquare" size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
<main className="pt-2 px-6 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout