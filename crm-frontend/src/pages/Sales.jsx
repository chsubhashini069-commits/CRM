import { useState, useEffect } from 'react';
import salesService from '../services/salesService';
import customerService from '../services/customerService';
import Modal from '../components/Modal';
import { LuPlus, LuDollarSign, LuCalendar, LuCheck, LuUser } from "react-icons/lu";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [formData, setFormData] = useState({
    customer: '', amount: '', status: 'Negotiation', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
  }, []);

  const fetchSales = async () => {
    try {
      const data = await salesService.getSales();
      setSales(data);
    } catch (err) {
      console.error('Failed to fetch sales', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    }
  };

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setCurrentSale(sale);
      setFormData({
        customer: sale.customer?._id || sale.customer,
        amount: sale.amount,
        status: sale.status,
        date: new Date(sale.date).toISOString().split('T')[0]
      });
    } else {
      setCurrentSale(null);
      setFormData({ customer: '', amount: '', status: 'Negotiation', date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSale) {
        await salesService.updateSale(currentSale._id, formData);
      } else {
        await salesService.createSale(formData);
      }
      fetchSales();
      handleCloseModal();
    } catch (err) {
      alert('Error saving deal');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed Won': return 'var(--success)';
      case 'Closed Lost': return 'var(--danger)';
      case 'Negotiation': return 'var(--warning)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="sales-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Sales Pipeline</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor deals and track your business growth.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <LuPlus /> New Deal
        </button>
      </div>

      <div className="sales-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {loading ? (
          <p>Loading deals...</p>
        ) : sales.length === 0 ? (
          <p>No deals found. Start your pipeline!</p>
        ) : (
          sales.map(sale => (
            <div key={sale._id} className="glass-card deal-card" style={{ padding: '24px', borderLeft: `4px solid ${getStatusColor(sale.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LuCalendar /> {new Date(sale.date).toLocaleDateString()}
                </span>
                <span style={{ color: getStatusColor(sale.status), fontWeight: '700', fontSize: '0.8rem' }}>{sale.status}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{sale.customer?.name || 'Unknown Customer'}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '20px' }}>
                <LuDollarSign style={{ fontSize: '1.2rem', color: 'var(--primary)' }} />
                {sale.amount.toLocaleString()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button onClick={() => handleOpenModal(sale)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><LuUser /> Update Status</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentSale ? 'Update Deal' : 'New Deal'}
      >
        <form onSubmit={handleSubmit}>
          {!currentSale && (
            <div className="form-group">
              <label>Select Customer</label>
              <select name="customer" value={formData.customer} onChange={handleChange} required>
                <option value="">-- Select Customer --</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.company})</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            {currentSale ? 'Update Deal' : 'Add Deal'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
