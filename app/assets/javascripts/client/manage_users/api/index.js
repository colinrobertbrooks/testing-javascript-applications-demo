import axios from 'axios';

export const adapter = axios.create({
  baseURL: '/api'
});

export default {
  access: {
    list() {
      return adapter.get('/access');
    }
  },
  users: {
    list() {
      return adapter.get('/users');
    },
    create(user) {
      return adapter.post('/users', user);
    },
    update({ id, ...restValues }) {
      return adapter.put(`/users/${id}`, restValues);
    },
    destroy({ id }) {
      return adapter.delete(`/users/${id}`);
    }
  }
};
