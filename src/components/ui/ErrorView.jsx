import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
        <ApperIcon name="AlertCircle" size={36} className="text-white" />
      </div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-bold text-gray-800">Oops!</h3>
        <p className="text-gray-600 text-lg">{message}</p>
        <p className="text-gray-500 text-sm">
          Don't worry, let's try loading your tasks again.
        </p>
      </div>

      {onRetry && (
        <div className="mt-8 space-y-3">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 text-base"
          >
            <ApperIcon name="RefreshCw" size={18} className="mr-2" />
            Try Again
          </Button>
          
          <p className="text-xs text-gray-400">
            If the problem persists, please refresh the page
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default ErrorView