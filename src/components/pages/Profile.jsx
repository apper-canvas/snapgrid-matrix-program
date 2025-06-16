import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService } from '@/services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    profilePic: ''
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [userData, allPosts] = await Promise.all([
          userService.getCurrentUser(),
          postService.getAll()
        ]);
        
        setUser(userData);
        setEditForm({
          username: userData.username,
          bio: userData.bio,
          profilePic: userData.profilePic
        });
        
        // Filter posts by current user
        const currentUserPosts = allPosts.filter(post => post.userId === userData.Id.toString());
        setUserPosts(currentUserPosts);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditToggle = () => {
    if (editing) {
      // Cancel editing - reset form
      setEditForm({
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic
      });
    }
    setEditing(!editing);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await userService.updateProfile(editForm);
      setUser(updatedUser);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        
        <div className="p-4">
          {/* Profile Header Skeleton */}
          <div className="flex flex-col items-center text-center mb-8 animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex space-x-8 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-6 bg-gray-200 rounded w-8 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Grid Skeleton */}
          <div className="grid grid-cols-3 gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load profile</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <Button
            variant={editing ? "secondary" : "ghost"}
            onClick={handleEditToggle}
            icon={editing ? "X" : "Settings"}
            size="sm"
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-8"
        >
          {editing ? (
            <div className="space-y-4 w-full max-w-sm">
              <div className="flex flex-col items-center">
                <Avatar 
                  src={editForm.profilePic} 
                  alt={editForm.username}
                  size="xl"
                  className="mb-4"
                />
                <Input
                  label="Profile Picture URL"
                  type="url"
                  name="profilePic"
                  value={editForm.profilePic}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              <Input
                label="Username"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              
              <Button
                onClick={handleSaveProfile}
                className="w-full"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <>
              <Avatar 
                src={user.profilePic} 
                alt={user.username}
                size="xl"
                className="mb-4"
              />
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h2>
              <p className="text-gray-600 mb-4 max-w-sm break-words">{user.bio}</p>
              
              <div className="flex space-x-8 mb-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{userPosts.length}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{user.followers}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{user.following}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {!editing && (
          <>
            {/* Posts Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-2 text-gray-900">
                  <ApperIcon name="Grid3x3" size={16} />
                  <span className="font-medium">POSTS</span>
                </div>
              </div>

              {userPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  >
                    <ApperIcon name="Camera" size={64} />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-4">
                    Share your first photo to get started
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-button-gradient text-white rounded-lg font-medium"
                    onClick={() => {
                      toast.info('Navigate to New Post tab to create your first post!');
                    }}
                  >
                    Share Photo
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-3 gap-1 max-w-full">
                  {userPosts.map((post, index) => (
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;