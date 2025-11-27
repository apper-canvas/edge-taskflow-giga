import React, { useState, useEffect } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { authService } from "@/services/api/authService"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const EmailVerification = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const emailFromState = location.state?.email
    const emailFromParams = searchParams.get("email")
    const token = searchParams.get("token")

    setEmail(emailFromState || emailFromParams || "")

    // If token is present, auto-verify
    if (token) {
      verifyEmail(token)
    }
  }, [location.state, searchParams])

  const verifyEmail = async (token) => {
    try {
      setVerifying(true)
      const response = await authService.verifyEmail(token)
      toast.success(response.message)
      setVerified(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setVerifying(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email address not found")
      return
    }

    try {
      setLoading(true)
      const response = await authService.resendVerification(email)
      toast.success(response.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl mx-auto">
          <ApperIcon name="Loader2" size={32} className="text-white animate-spin" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Verifying email</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify your email...</p>
        </div>
      </motion.div>
    )
  }

  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
          <ApperIcon name="CheckCircle" size={32} className="text-white" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Email verified!</h2>
          <p className="text-gray-600 mt-2">
            Your email has been successfully verified. You can now sign in to your account.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <Link to="/auth">
            <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-base">
              <ApperIcon name="LogIn" size={18} className="mr-2" />
              Continue to Sign In
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
        <ApperIcon name="Mail" size={32} className="text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Verify your email</h2>
        <p className="text-gray-600 mt-2">
          We've sent a verification link to:
        </p>
        {email && (
          <p className="font-medium text-primary mt-1">{email}</p>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <div className="space-y-4 text-left mb-6">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Inbox" size={16} className="text-gray-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">Check your inbox and click the verification link</p>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertCircle" size={16} className="text-gray-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">Don't see the email? Check your spam folder</p>
          </div>
        </div>

        <div className="space-y-3">
          {email && (
            <Button
              onClick={handleResendVerification}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                  Resend verification email
                </>
              )}
            </Button>
          )}
          
          <Link to="/auth" className="block">
            <Button variant="ghost" className="w-full text-primary">
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailVerification