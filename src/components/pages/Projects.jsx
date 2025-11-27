import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Projects = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="FolderOpen" size={32} className="mr-3 text-primary" />
            Projects
          </h1>
          <p className="text-gray-600 mt-1">Organize your tasks into meaningful projects</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary text-white">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8">
          <ApperIcon name="FolderOpen" size={40} className="text-white" />
        </div>
        
        <div className="space-y-4 max-w-lg mx-auto">
          <h3 className="text-3xl font-bold text-gray-800">Projects Coming Soon!</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            We're working on an amazing project management system that will help you organize your tasks into meaningful projects with team collaboration features.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-8">
            <h4 className="font-semibold text-gray-800 mb-3">What's Coming:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <ApperIcon name="CheckCircle" size={16} className="text-primary flex-shrink-0" />
                <span>Create & manage projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Users" size={16} className="text-primary flex-shrink-0" />
                <span>Team collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="BarChart3" size={16} className="text-primary flex-shrink-0" />
                <span>Progress tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-primary flex-shrink-0" />
                <span>Project timelines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Want to be notified when projects are available?
          </p>
          <Button variant="outline" className="mt-3">
            <ApperIcon name="Bell" size={16} className="mr-2" />
            Get Notified
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Projects