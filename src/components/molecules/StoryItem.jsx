import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';

const StoryItem = ({ user, hasStory, storyViewed, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center space-y-1 cursor-pointer min-w-0"
      onClick={() => onClick(user.Id)}
    >
      <div className="relative">
        <Avatar
          src={user.profilePic}
          alt={user.username}
          size="lg"
          hasStory={hasStory}
          storyViewed={storyViewed}
          className={hasStory && !storyViewed ? 'story-pulse' : ''}
        />
        
        {user.Id === "1" && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">+</span>
          </motion.div>
        )}
      </div>
      
      <span className="text-xs text-gray-700 font-medium truncate w-16 text-center">
        {user.Id === "1" ? "Your story" : user.username}
      </span>
    </motion.div>
  );
};

export default StoryItem;