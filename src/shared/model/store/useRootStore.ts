import {defineStore} from 'pinia';

export const useRootStore = defineStore('root', {
  state: () => ({
    theme: 'dark' as 'dark' | 'light',
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    users: [] as { username: string; password: string }[]
  }),
  actions: {
    initTheme() {
      this.setTheme(
        (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light'
      );
    },
    setTheme(theme: 'dark' | 'light') {
      this.theme = theme;
      document.documentElement.setAttribute('theme', theme);
      localStorage.setItem('app-theme', theme);
    },
    login() {
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
    },
    initUsers() {
      const users = localStorage.getItem('users');
      this.users = users ? JSON.parse(users) : [];
    },
    checkUser(username: string, password: string) {
      return this.users.some(
        (user) => user.username === username && user.password === password
      );
    }
  }
});
