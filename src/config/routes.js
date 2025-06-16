import Feed from '@/components/pages/Feed';
import Search from '@/components/pages/Search';
import NewPost from '@/components/pages/NewPost';
import Saved from '@/components/pages/Saved';
import Profile from '@/components/pages/Profile';

export const routes = {
  feed: {
    id: 'feed',
    label: 'Feed',
    path: '/feed',
    icon: 'Home',
    component: Feed
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  newPost: {
    id: 'newPost',
    label: 'New Post',
    path: '/new-post',
    icon: 'Plus',
    component: NewPost
  },
  saved: {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: 'Bookmark',
    component: Saved
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);
export default routes;