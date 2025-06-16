import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const BottomNavigation = () => {
  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16 px-4">
        {routeArray.map((route) => (
          <NavLink
            key={route.id}
            to={route.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center space-y-1"
              >
                <div className="relative">
                  <ApperIcon 
                    name={route.icon} 
                    size={24}
                    className={isActive ? 'fill-current' : ''}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </div>
                <span className="text-xs font-medium">
                  {route.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;