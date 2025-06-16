import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StoryItem from '@/components/molecules/StoryItem';
import StoryViewer from '@/components/organisms/StoryViewer';
import { storyService, userService } from '@/services';

const StoriesCarousel = () => {
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    const loadStoriesData = async () => {
      try {
        setLoading(true);
        const [usersData, storiesData] = await Promise.all([
          userService.getAll(),
          storyService.getActiveStories()
        ]);
        
        setUsers(usersData);
        setStories(storiesData);
      } catch (error) {
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    loadStoriesData();
  }, []);

  const handleStoryClick = async (userId) => {
    if (userId === "1") {
      // Handle adding new story for current user
      // For now, just show a toast
      toast.info('Story creation coming soon!');
      return;
    }

    const user = users.find(u => u.Id.toString() === userId.toString());
    if (user && stories[userId]) {
      setSelectedUser({ user, stories: stories[userId] });
      setShowViewer(true);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1 animate-pulse min-w-0">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide max-w-full">
          {users.map((user, index) => {
            const hasStory = stories[user.Id] && stories[user.Id].length > 0;
            const storyViewed = hasStory && stories[user.Id].every(s => s.viewed);
            
            return (
              <motion.div
                key={user.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StoryItem
                  user={user}
                  hasStory={hasStory || user.Id === "1"}
                  storyViewed={storyViewed}
                  onClick={handleStoryClick}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {showViewer && selectedUser && (
        <StoryViewer
          user={selectedUser.user}
          stories={selectedUser.stories}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};

export default StoriesCarousel;