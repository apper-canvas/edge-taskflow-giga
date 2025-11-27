import React, { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { authService } from "@/services/api/authService"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleChange = (value) => {
    setEmail(value)
    if (error) {
      setError("")
    }
  }

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }

    try {
      setLoading(true)
      const response = await authService.forgotPassword(email.trim())
      toast.success(response.message)
      setSent(true)
    } catch (error) {
      toast.error(error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
          <ApperIcon name="Mail" size={32} className="text-white" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-600 mt-2">
            We've sent a password reset link to:
          </p>
          <p className="font-medium text-primary mt-1">{email}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Clock" size={16} className="text-gray-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">The reset link will expire in 1 hour</p>
            </div>
            <div className="flex items-start space-x-3">
              <ApperIcon name="AlertCircle" size={16} className="text-gray-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">Don't see the email? Check your spam folder</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => setSent(false)}
              variant="outline"
              className="w-full"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Try different email
            </Button>
            
            <Link to="/auth" className="block">
              <Button variant="ghost" className="w-full text-primary">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="lg:hidden flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-xl">
            <ApperIcon name="CheckSquare" size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Forgot password?</h2>
        <p className="text-gray-600 mt-2">Enter your email to reset your password</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter your email address"
              error={error}
              className="w-full"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="Loader2" size={18} className="animate-spin" />
                <span>Sending reset link...</span>
              </div>
            ) : (
              <>
                <ApperIcon name="Mail" size={18} className="mr-2" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/auth"
            className="text-primary hover:text-secondary font-medium transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={16} className="inline mr-1" />
            Back to sign in
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ForgotPassword