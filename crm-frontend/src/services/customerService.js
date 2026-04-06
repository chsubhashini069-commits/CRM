import api from './api';

const getCustomers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

const getCustomer = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

const createCustomer = async (customerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

const updateCustomer = async (id, customerData) => {
  const response = await api.put(`/customers/${id}`, customerData);
  return response.data;
};

const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

const customerService = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default customerService;
