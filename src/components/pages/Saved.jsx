import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services';

const Saved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const posts = await postService.getSaved();
        setSavedPosts(posts);
      } catch (err) {
        setError(err.message || 'Failed to load saved posts');
        toast.error('Failed to load saved posts');
      } finally {
        setLoading(false);
      }
    };

    loadSavedPosts();
  }, []);

  const handleUnsave = async (postId) => {
    try {
      await postService.toggleSave(postId);
      setSavedPosts(prev => prev.filter(post => post.Id !== postId));
      toast.success('Post removed from saved');
    } catch (error) {
      toast.error('Failed to remove post from saved');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
          <h1 className="text-xl font-bold text-gray-900">Saved Posts</h1>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
          <h1 className="text-xl font-bold text-gray-900">Saved Posts</h1>
        </div>
        
        <div className="flex items-center justify-center p-8 mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Saved Posts</h1>
          {savedPosts.length > 0 && (
            <span className="text-sm text-gray-500">
              {savedPosts.length} {savedPosts.length === 1 ? 'post' : 'posts'}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {savedPosts.length === 0 ? (
          <div className="flex items-center justify-center mt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
              >
                <ApperIcon name="Bookmark" size={64} />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved posts</h3>
              <p className="text-gray-500 mb-4">
                Posts you save will appear here for easy access
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-button-gradient text-white rounded-lg font-medium cursor-pointer"
                onClick={() => {
                  toast.info('Go to Feed to find posts to save!');
                }}
              >
                Explore Posts
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 max-w-full">
            {savedPosts.map((post, index) => (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square relative group cursor-pointer overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Heart" size={16} />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MessageCircle" size={16} />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Unsave Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsave(post.Id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                >
                  <ApperIcon name="BookmarkMinus" size={16} className="text-white" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;