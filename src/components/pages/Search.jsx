import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // posts, users, tags

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [postsData, usersData] = await Promise.all([
          postService.getAll(),
          userService.getAll()
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        toast.error('Failed to load search data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    
    return posts.filter(post => 
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [posts, searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    return users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const popularHashtags = useMemo(() => {
    const tagCounts = {};
    posts.forEach(post => {
      post.hashtags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const filteredTags = useMemo(() => {
    if (!searchQuery) return popularHashtags;
    
    return popularHashtags.filter(({ tag }) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [popularHashtags, searchQuery]);

  const handleHashtagClick = (hashtag) => {
    setSearchQuery(hashtag);
    setActiveTab('posts');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          {/* Search Bar Skeleton */}
          <div className="mb-6">
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex space-x-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search posts, users, or hashtags..."
          className="mb-4"
        />

        {/* Tabs */}
        <div className="flex space-x-4">
          {[
            { id: 'posts', label: 'Posts' },
            { id: 'users', label: 'Users' },
            { id: 'tags', label: 'Tags' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Image" size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try searching for something else' : 'Posts will appear here once they are created'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 max-w-full">
                {filteredPosts.map((post, index) => (
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
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No users found' : 'No users yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try searching for someone else' : 'Users will appear here'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Avatar src={user.profilePic} alt={user.username} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.bio}</p>
                    <p className="text-xs text-gray-400">
                      {user.followers} followers • {user.following} following
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Hash" size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No tags found' : 'No tags yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try searching for a different hashtag' : 'Tags will appear here once posts are created'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTags.map(({ tag, count }, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleHashtagClick(tag)}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Hash" size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">#{tag}</h3>
                        <p className="text-sm text-gray-500">
                          {count} {count === 1 ? 'post' : 'posts'}
                        </p>
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;