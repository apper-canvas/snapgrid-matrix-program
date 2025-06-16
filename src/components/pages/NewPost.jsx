import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services';

const NewPost = () => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    hashtags: ''
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update preview image when URL changes
    if (name === 'imageUrl') {
      setPreviewImage(value);
    }
  };

  const parseHashtags = (hashtagString) => {
    return hashtagString
      .split(/[\s,#]+/)
      .filter(tag => tag.trim())
      .map(tag => tag.replace(/^#+/, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl.trim()) {
      toast.error('Please add an image URL');
      return;
    }

    if (!formData.caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    try {
      setLoading(true);
      
      const postData = {
        imageUrl: formData.imageUrl.trim(),
        caption: formData.caption.trim(),
        hashtags: parseHashtags(formData.hashtags)
      };

      await postService.create(postData);
      
      toast.success('Post created successfully!');
      
      // Reset form
      setFormData({ imageUrl: '', caption: '', hashtags: '' });
      setPreviewImage('');
      
      // Navigate to feed
      navigate('/feed');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setPreviewImage('');
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Create New Post</h1>
          <Button
            type="submit"
            form="new-post-form"
            disabled={loading || !formData.imageUrl.trim() || !formData.caption.trim()}
            className="min-w-[80px]"
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <form id="new-post-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              {previewImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-lg shadow-sm"
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage('');
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ApperIcon name="X" size={16} className="text-white" />
                  </button>
                </motion.div>
              ) : (
                <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <ApperIcon name="Image" size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Add an image URL to see preview</p>
                    <p className="text-sm text-gray-400">Supported: JPG, PNG, WebP</p>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Image URL"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              icon="Link"
              required
            />

            {/* Sample Images */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Or choose from samples:</p>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((url, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageUrl: url }));
                      setPreviewImage(url);
                    }}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={url}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Caption */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Write a caption..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </motion.div>

          {/* Hashtags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              label="Hashtags"
              name="hashtags"
              value={formData.hashtags}
              onChange={handleInputChange}
              placeholder="nature sunset photography"
              icon="Hash"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with spaces or commas. Don't include # symbols.
            </p>
            
            {/* Hashtag Preview */}
            {formData.hashtags.trim() && (
              <div className="mt-2 flex flex-wrap gap-1">
                {parseHashtags(formData.hashtags).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Submit Button (Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 md:hidden"
          >
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !formData.imageUrl.trim() || !formData.caption.trim()}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon name="Loader2" size={16} />
                  </motion.div>
                  <span>Creating Post...</span>
                </div>
              ) : (
                'Create Post'
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;