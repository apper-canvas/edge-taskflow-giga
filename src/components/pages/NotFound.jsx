import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
          <ApperIcon name="AlertTriangle" size={40} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to organizing your tasks.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3"
        >
          <ApperIcon name="Home" size={18} className="mr-2" />
          Back to Tasks
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="px-6 py-3"
        >
          <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default NotFound