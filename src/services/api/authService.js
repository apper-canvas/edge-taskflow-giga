import mockUsers from "@/services/mockData/users.json"

const STORAGE_KEY = "taskflow_auth"
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock JWT token generation
const generateToken = (user) => {
  return `mock_jwt_${user.Id}_${Date.now()}`
}

// Get stored auth data
const getStoredAuth = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

// Save auth data to localStorage
const saveAuth = (authData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
}

// Clear auth data
const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const authService = {
  // Login
  async login(email, password) {
    await delay(800)
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error("User not found")
    }
    
    // Mock password verification (in real app, this would be hashed)
    if (password !== "password123") {
      throw new Error("Invalid password")
    }
    
    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in")
    }
    
    const token = generateToken(user)
    const authData = { user, token }
    
    saveAuth(authData)
    return authData
  },

  // Signup
  async signup(userData) {
    await delay(1000)
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error("Email already registered")
    }
    
    const newUser = {
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      ...userData,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      preferences: {
        theme: "light",
        notifications: {
          email: true,
          push: true,
          taskReminders: true,
          teamUpdates: true
        },
        timezone: "UTC"
      }
    }
    
    // In a real app, this would save to database
    mockUsers.push(newUser)
    
    return { user: newUser, message: "Account created successfully. Please verify your email." }
  },

  // Forgot Password
  async forgotPassword(email) {
    await delay(600)
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error("Email not found")
    }
    
    // In real app, would send reset email
    return { message: "Password reset email sent successfully" }
  },

  // Reset Password
  async resetPassword(token, newPassword) {
    await delay(500)
    
    // Mock token validation
    if (!token || token.length < 10) {
      throw new Error("Invalid or expired reset token")
    }
    
    // In real app, would update password in database
    return { message: "Password reset successfully" }
  },

  // Email Verification
  async verifyEmail(token) {
    await delay(400)
    
    // Mock token validation
    if (!token || token.length < 10) {
      throw new Error("Invalid or expired verification token")
    }
    
    // In real app, would update email verification status
    return { message: "Email verified successfully" }
  },

  // Resend Verification Email
  async resendVerification(email) {
    await delay(300)
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error("Email not found")
    }
    
    if (user.emailVerified) {
      throw new Error("Email is already verified")
    }
    
    return { message: "Verification email sent successfully" }
  },

  // Check Authentication Status
  async checkAuth() {
    await delay(200)
    
    const authData = getStoredAuth()
    if (!authData || !authData.token) {
      return null
    }
    
    // Mock token validation
    const user = mockUsers.find(u => u.Id === authData.user.Id)
    if (!user) {
      clearAuth()
      return null
    }
    
    return authData
  },

  // Logout
  async logout() {
    await delay(100)
    clearAuth()
    return { message: "Logged out successfully" }
  },

  // Get Current User
  async getCurrentUser() {
    await delay(150)
    
    const authData = getStoredAuth()
    if (!authData) {
      return null
    }
    
    const user = mockUsers.find(u => u.Id === authData.user.Id)
    return user ? { ...user } : null
  }
}