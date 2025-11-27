import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ onAddTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl mb-8">
        <ApperIcon name="CheckSquare" size={40} className="text-white" />
      </div>
      
      <div className="space-y-4 max-w-lg">
        <h3 className="text-3xl font-bold text-gray-800">Ready to Get Organized?</h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          You don't have any tasks yet. Create your first task and start building productive habits that stick.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <ApperIcon name="Lightbulb" size={16} className="text-primary flex-shrink-0" />
            <span>Pro tip: Start with your most important task for today</span>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <Button
          onClick={onAddTask}
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
        >
          <ApperIcon name="Plus" size={20} className="mr-3" />
          Add Your First Task
        </Button>
        
        <p className="text-sm text-gray-500">
          It only takes a few seconds to get started
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
    </motion.div>
  )
}

export default Empty