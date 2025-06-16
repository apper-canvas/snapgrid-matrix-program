import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { storyService } from '@/services';
import { formatDistanceToNow } from 'date-fns';

const StoryViewer = ({ user, stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = stories[currentIndex];
  const duration = 5000; // 5 seconds per story

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            // End of stories
            onClose();
            return 100;
          }
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose, duration]);

  useEffect(() => {
    // Mark story as viewed
    if (currentStory && !currentStory.viewed) {
      storyService.markAsViewed(currentStory.Id).catch(() => {
        // Silently fail for better UX
      });
    }
  }, [currentStory]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={onClose}
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Avatar src={user.profilePic} alt={user.username} size="sm" />
            <div>
              <p className="text-white font-medium">{user.username}</p>
              <p className="text-white/70 text-xs">
                {formatDistanceToNow(new Date(currentStory.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Story Content */}
        <motion.div
          key={currentStory.Id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="relative w-full h-full max-w-sm mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.content}
              alt="Story"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
              <p className="text-white text-xl font-medium text-center px-8 break-words">
                {currentStory.content}
              </p>
            </div>
          )}

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex">
            <div 
              className="flex-1 cursor-pointer" 
              onClick={handlePrevious}
            />
            <div 
              className="flex-1 cursor-pointer" 
              onClick={handleNext}
            />
          </div>
        </motion.div>

        {/* Navigation Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {currentIndex > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="ChevronLeft" size={20} className="text-white" />
            </motion.button>
          )}
          
          {currentIndex < stories.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="ChevronRight" size={20} className="text-white" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;