import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt = "", 
  size = 'md', 
  className = '',
  hasStory = false,
  storyViewed = false,
  onClick,
  ...props
}) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const storyRingClasses = hasStory 
    ? storyViewed 
      ? 'ring-2 ring-gray-300' 
      : 'ring-2 ring-story-gradient p-0.5'
    : '';

  const avatarClasses = `
    ${sizes[size]} rounded-full object-cover bg-gray-200
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const content = (
    <img
      src={src || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
      alt={alt}
      className={avatarClasses}
      onError={(e) => {
        e.target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`;
      }}
      {...props}
    />
  );

  if (hasStory) {
    return (
      <motion.div
        whileHover={onClick ? { scale: 1.05 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        className={`${storyRingClasses} rounded-full ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Avatar;