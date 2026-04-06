import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('crm_user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('crm_user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('crm_user');
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const updatePassword = async (passwords) => {
  const response = await api.put('/auth/updatepassword', passwords);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  updatePassword,
};

export default authService;
