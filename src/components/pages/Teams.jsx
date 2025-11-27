import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Teams = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="Users" size={32} className="mr-3 text-primary" />
            Teams
          </h1>
          <p className="text-gray-600 mt-1">Collaborate with your team members on shared projects</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary text-white">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Create Team
        </Button>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8">
          <ApperIcon name="Users" size={40} className="text-white" />
        </div>
        
        <div className="space-y-4 max-w-lg mx-auto">
          <h3 className="text-3xl font-bold text-gray-800">Team Collaboration Coming Soon!</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            We're developing powerful team collaboration features that will make it easy to work together on projects, assign tasks, and track progress as a team.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-8">
            <h4 className="font-semibold text-gray-800 mb-3">What's Coming:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <ApperIcon name="UserPlus" size={16} className="text-primary flex-shrink-0" />
                <span>Invite team members</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Share2" size={16} className="text-primary flex-shrink-0" />
                <span>Shared workspaces</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="MessageSquare" size={16} className="text-primary flex-shrink-0" />
                <span>Team discussions</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="UserCheck" size={16} className="text-primary flex-shrink-0" />
                <span>Task assignments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            Ready to collaborate? Get notified when teams are available:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline">
              <ApperIcon name="Bell" size={16} className="mr-2" />
              Get Notified
            </Button>
            <Button variant="outline">
              <ApperIcon name="Mail" size={16} className="mr-2" />
              Join Waiting List
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Teams