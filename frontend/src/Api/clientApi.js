import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clients';

export const clientApi = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  create: async (clientData) => {
    const response = await axios.post(API_URL, clientData);
    return response.data;
  },
  update: async (id, clientData) => {
    const response = await axios.put(`${API_URL}/${id}`, clientData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};