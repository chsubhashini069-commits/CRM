import api from './api';

const getSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

const createSale = async (saleData) => {
  const response = await api.post('/sales', saleData);
  return response.data;
};

const updateSale = async (id, saleData) => {
  const response = await api.put(`/sales/${id}`, saleData);
  return response.data;
};

const salesService = {
  getSales,
  createSale,
  updateSale,
};

export default salesService;
