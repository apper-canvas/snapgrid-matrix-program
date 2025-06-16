import initialCommentsData from '@/services/mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.storageKey = 'snapgrid_comments';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(initialCommentsData));
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
    const comments = this.getData();
    return [...comments];
  }

  async getByPostId(postId) {
    await delay(300);
    const comments = this.getData();
    return comments.filter(c => c.postId === parseInt(postId, 10));
  }

  async create(commentData) {
    await delay(400);
    const comments = this.getData();
    const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.Id)) : 0;
    
    const newComment = {
      Id: maxId + 1,
      postId: parseInt(commentData.postId, 10),
      userId: "1",
      text: commentData.text,
      timestamp: new Date().toISOString(),
      ...commentData
    };

    comments.push(newComment);
    this.saveData(comments);
    return { ...newComment };
  }

  async delete(id) {
    await delay(300);
    const comments = this.getData();
    const filteredComments = comments.filter(c => c.Id !== parseInt(id, 10));
    this.saveData(filteredComments);
    return true;
  }
}

export default new CommentService();