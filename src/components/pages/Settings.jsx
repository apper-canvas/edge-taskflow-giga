import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import App from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { logout } from "@/store/slices/authSlice";

const Settings = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  })
  
  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || "light",
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      push: user?.preferences?.notifications?.push ?? true,
      taskReminders: user?.preferences?.notifications?.taskReminders ?? true,
},
    timezone: user?.preferences?.timezone || "UTC"
  })

  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success("Profile updated successfully!")
    setLoading(false)
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600))
    toast.success("Preferences saved!")
    setLoading(false)
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      dispatch(logout())
      toast.success("Logged out successfully")
    }
  }

  const menuItems = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "security", label: "Security", icon: "Shield" }
  ]

  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" }
  ]

  const timezoneOptions = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ApperIcon name="Settings" size={32} className="mr-3 text-primary" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <ul className="space-y-1">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ApperIcon name={item.icon} size={18} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                  <p className="text-gray-600">Update your personal information and avatar.</p>
                </div>

                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                    <ApperIcon name="User" size={32} className="text-white" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Camera" size={16} className="mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">App Preferences</h2>
                  <p className="text-gray-600">Customize your TaskFlow experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <Select
                      value={preferences.theme}
                      onChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}
                      options={themeOptions}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <Select
                      value={preferences.timezone}
                      onChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                      options={timezoneOptions}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Notification Settings</h2>
                  <p className="text-gray-600">Choose what notifications you want to receive.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Checkbox
                      checked={preferences.notifications.email}
                      onChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <Checkbox
                      checked={preferences.notifications.push}
                      onChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Task Reminders</h3>
                      <p className="text-sm text-gray-500">Get reminded about upcoming task deadlines</p>
                    </div>
                    <Checkbox
                      checked={preferences.notifications.taskReminders}
                      onChange={(checked) => handleNotificationChange("taskReminders", checked)}
/>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Security & Privacy</h2>
                  <p className="text-gray-600">Manage your account security settings.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Keep your account secure by using a strong password.
                    </p>
                    <Button variant="outline">
                      <ApperIcon name="Key" size={16} className="mr-2" />
                      Change Password
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account.
                    </p>
                    <Button variant="outline">
                      <ApperIcon name="Shield" size={16} className="mr-2" />
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h3 className="font-medium text-red-900 mb-2">Sign Out</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Sign out of your account on this device.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="LogOut" size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings