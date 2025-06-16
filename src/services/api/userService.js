const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.storageKey = 'snapgrid_users';
    this.currentUserKey = 'snapgrid_current_user';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialUsers = require('../mockData/users.json');
      localStorage.setItem(this.storageKey, JSON.stringify(initialUsers));
    }
    
    if (!localStorage.getItem(this.currentUserKey)) {
      localStorage.setItem(this.currentUserKey, '1');
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

  getCurrentUserId() {
    return parseInt(localStorage.getItem(this.currentUserKey), 10);
  }

  async getAll() {
    await delay(300);
    const users = this.getData();
    return [...users];
  }

  async getById(id) {
    await delay(200);
    const users = this.getData();
    const user = users.find(u => u.Id === parseInt(id, 10));
    return user ? { ...user } : null;
  }

  async getCurrentUser() {
    await delay(200);
    const currentUserId = this.getCurrentUserId();
    return this.getById(currentUserId);
  }

  async update(id, data) {
    await delay(300);
    const users = this.getData();
    const index = users.findIndex(u => u.Id === parseInt(id, 10));
    
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...users[index], ...data };
    delete updatedUser.Id;
    updatedUser.Id = users[index].Id;
    
    users[index] = updatedUser;
    this.saveData(users);
    return { ...updatedUser };
  }

  async updateProfile(data) {
    const currentUserId = this.getCurrentUserId();
    return this.update(currentUserId, data);
  }

  async searchUsers(query) {
    await delay(300);
    const users = this.getData();
    return users.filter(u => 
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.bio.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new UserService();