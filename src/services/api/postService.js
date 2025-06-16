import initialPostsData from '../mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.storageKey = 'snapgrid_posts';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(initialPostsData));
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

  async getAll() {
    await delay(300);
    const posts = this.getData();
    return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const posts = this.getData();
    const post = posts.find(p => p.Id === parseInt(id, 10));
    return post ? { ...post } : null;
  }

  async create(postData) {
    await delay(400);
    const posts = this.getData();
    const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.Id)) : 0;
    
    const newPost = {
      Id: maxId + 1,
      userId: "user1",
      imageUrl: postData.imageUrl,
      caption: postData.caption || "",
      hashtags: postData.hashtags || [],
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      saved: false,
      ...postData
    };

    posts.push(newPost);
    this.saveData(posts);
    return { ...newPost };
  }

  async update(id, data) {
    await delay(300);
    const posts = this.getData();
    const index = posts.findIndex(p => p.Id === parseInt(id, 10));
    
    if (index === -1) {
      throw new Error('Post not found');
    }

    const updatedPost = { ...posts[index], ...data };
    delete updatedPost.Id; // Prevent Id modification
    updatedPost.Id = posts[index].Id;
    
    posts[index] = updatedPost;
    this.saveData(posts);
    return { ...updatedPost };
  }

  async delete(id) {
    await delay(300);
    const posts = this.getData();
    const filteredPosts = posts.filter(p => p.Id !== parseInt(id, 10));
    this.saveData(filteredPosts);
    return true;
  }

  async toggleLike(id) {
    await delay(200);
    const posts = this.getData();
    const index = posts.findIndex(p => p.Id === parseInt(id, 10));
    
    if (index === -1) {
      throw new Error('Post not found');
    }

    posts[index].likes = posts[index].likes > 0 ? posts[index].likes - 1 : posts[index].likes + 1;
    this.saveData(posts);
    return { ...posts[index] };
  }

  async toggleSave(id) {
    await delay(200);
    const posts = this.getData();
    const index = posts.findIndex(p => p.Id === parseInt(id, 10));
    
    if (index === -1) {
      throw new Error('Post not found');
    }

    posts[index].saved = !posts[index].saved;
    this.saveData(posts);
    return { ...posts[index] };
  }

  async getSaved() {
    await delay(300);
    const posts = this.getData();
    return posts.filter(p => p.saved);
  }

  async searchByHashtag(hashtag) {
    await delay(300);
    const posts = this.getData();
    return posts.filter(p => 
      p.hashtags.some(tag => 
        tag.toLowerCase().includes(hashtag.toLowerCase())
      )
    );
  }

  async searchByCaption(query) {
    await delay(300);
    const posts = this.getData();
    return posts.filter(p => 
      p.caption.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new PostService();