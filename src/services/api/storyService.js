const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StoryService {
  constructor() {
    this.storageKey = 'snapgrid_stories';
    this.initializeData();
  }
async initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      try {
        const storiesModule = await import('@/services/mockData/stories.json');
        const initialStories = storiesModule.default;
        localStorage.setItem(this.storageKey, JSON.stringify(initialStories));
      } catch (error) {
        console.error('Failed to load initial stories data:', error);
        // Fallback to empty array if import fails
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    }
  }
  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  isStoryActive(timestamp) {
    const storyTime = new Date(timestamp);
    const now = new Date();
    const diffHours = (now - storyTime) / (1000 * 60 * 60);
    return diffHours < 24;
  }

  async getAll() {
    await delay(300);
    const stories = this.getData();
    return stories.filter(story => this.isStoryActive(story.timestamp));
  }

  async getActiveStories() {
    const stories = await this.getAll();
    const userStories = {};
    
    stories.forEach(story => {
      if (!userStories[story.userId]) {
        userStories[story.userId] = [];
      }
      userStories[story.userId].push(story);
    });

    return userStories;
  }

  async getById(id) {
    await delay(200);
    const stories = this.getData();
    const story = stories.find(s => s.Id === parseInt(id, 10));
    return story ? { ...story } : null;
  }

  async create(storyData) {
    await delay(400);
    const stories = this.getData();
    const maxId = stories.length > 0 ? Math.max(...stories.map(s => s.Id)) : 0;
    
    const newStory = {
      Id: maxId + 1,
      userId: "1",
      content: storyData.content,
      type: storyData.type || "image",
      timestamp: new Date().toISOString(),
      viewed: false,
      ...storyData
    };

    stories.push(newStory);
    this.saveData(stories);
    return { ...newStory };
  }

  async markAsViewed(id) {
    await delay(200);
    const stories = this.getData();
    const index = stories.findIndex(s => s.Id === parseInt(id, 10));
    
    if (index !== -1) {
      stories[index].viewed = true;
      this.saveData(stories);
      return { ...stories[index] };
    }
    
    throw new Error('Story not found');
  }

  async getUserStories(userId) {
    await delay(300);
    const stories = this.getData();
    return stories.filter(s => 
      s.userId === userId.toString() && this.isStoryActive(s.timestamp)
    );
  }
}

export default new StoryService();