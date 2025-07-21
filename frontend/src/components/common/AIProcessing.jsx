
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AIProcessing = ({ 
  isProcessing = false, 
  progress = 0, 
  stage = "Initializing", 
  onComplete,
  confidence = null 
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= progress) {
            clearInterval(interval);
            if (progress >= 100 && onComplete) {
              setTimeout(onComplete, 500);
            }
            return prev;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isProcessing, progress, onComplete]);

  const stages = [
    "Initializing AI models...",
    "Processing your input...",
    "Analyzing data patterns...",
    "Generating recommendations...",
    "Finalizing results..."
  ];

  const getStageIcon = () => {
    if (currentProgress >= 100) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    if (currentProgress > 0) {
      return <Zap className="w-6 h-6 text-blue-500 animate-pulse" />;
    }
    return <Brain className="w-6 h-6 text-purple-500" />;
  };

  if (!isProcessing && currentProgress === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center space-x-3">
        {getStageIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Processing
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stage || stages[Math.floor((currentProgress / 100) * (stages.length - 1))]}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(currentProgress)}%
          </span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>

      {confidence !== null && currentProgress >= 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Confidence</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {confidence}%
            </span>
          </div>
          <div className="confidence-bar">
            <motion.div
              className={`confidence-fill ${
                confidence >= 80 ? 'bg-green-500' :
                confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}

      {currentProgress < 100 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span>This may take a few moments...</span>
        </div>
      )}
    </motion.div>
  );
};

export default AIProcessing;
