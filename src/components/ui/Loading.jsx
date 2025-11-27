import React from "react"
import { motion } from "framer-motion"

const Loading = () => {
  return (
    <div className="space-y-8">
      {/* Filter Bar Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Task List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse flex-shrink-0 mt-1" />
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-sm"
        >
          Loading your tasks...
        </motion.p>
      </div>
    </div>
  )
}

export default Loading