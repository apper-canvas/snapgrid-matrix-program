import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService, commentService } from '@/services';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.likes > 0);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user data
  useState(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getById(post.userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, [post.userId]);

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      const updatedPost = await postService.toggleLike(post.Id);
      onUpdate?.(updatedPost);
    } catch (error) {
      // Revert optimistic update
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      toast.error('Failed to update like');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved);
      const updatedPost = await postService.toggleSave(post.Id);
      onUpdate?.(updatedPost);
      toast.success(isSaved ? 'Post removed from saved' : 'Post saved');
    } catch (error) {
      setIsSaved(isSaved);
      toast.error('Failed to save post');
    }
  };

  const loadComments = async () => {
    if (showComments && comments.length === 0) {
      try {
        const postComments = await commentService.getByPostId(post.Id);
        setComments(postComments);
      } catch (error) {
        toast.error('Failed to load comments');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const comment = await commentService.create({
        postId: post.Id,
        text: newComment.trim()
      });
      setComments(prev => [...prev, comment]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      loadComments();
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 max-w-full overflow-hidden"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={user.profilePic} 
            alt={user.username}
            size="sm"
          />
          <div>
            <h3 className="font-medium text-gray-900">{user.username}</h3>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <ApperIcon name="MoreHorizontal" size={16} />
        </Button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full h-80 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop';
          }}
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center space-x-1"
            >
              <motion.div
                key={isLiked ? 'liked' : 'not-liked'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={isLiked ? 'heart-pop-animation' : ''}
              >
                <ApperIcon 
                  name="Heart" 
                  size={24}
                  className={isLiked ? 'text-red-500 fill-current' : 'text-gray-700'}
                />
              </motion.div>
            </motion.button>
            
            <Button variant="ghost" size="sm" onClick={handleShowComments}>
              <ApperIcon name="MessageCircle" size={24} className="text-gray-700" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Send" size={24} className="text-gray-700" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <ApperIcon 
              name="Bookmark" 
              size={24}
              className={isSaved ? 'text-primary fill-current' : 'text-gray-700'}
            />
          </Button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="font-medium text-gray-900 mb-2">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        <div className="mb-2">
          <span className="font-medium text-gray-900 mr-2">{user.username}</span>
          <span className="text-gray-800 break-words">{post.caption}</span>
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="text-primary text-sm cursor-pointer hover:underline">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 pt-3 mt-3"
            >
              {/* Comments List */}
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.Id} className="flex space-x-2 text-sm">
                    <span className="font-medium text-gray-900">
                      {comment.userId === "1" ? "you" : `user${comment.userId}`}
                    </span>
                    <span className="text-gray-800 break-words flex-1 min-w-0">
                      {comment.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  disabled={!newComment.trim() || loading}
                >
                  Post
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostCard;