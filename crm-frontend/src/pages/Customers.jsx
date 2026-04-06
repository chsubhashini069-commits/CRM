import { useState, useEffect, useContext } from 'react';
import customerService from '../services/customerService';
import Modal from '../components/Modal';
import { LuPlus, LuSearch, LuTrash2, LuUser } from "react-icons/lu";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', address: '', notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setFormData(customer);
    } else {
      setCurrentCustomer(null);
      setFormData({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCustomer) {
        await customerService.updateCustomer(currentCustomer._id, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      fetchCustomers();
      handleCloseModal();
    } catch (err) {
      alert('Error saving customer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert('Error deleting customer');
      }
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customers-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Customers</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your active client base and details.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <LuPlus /> Add Customer
        </button>
      </div>

      <div className="table-controls glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div className="search-bar" style={{ width: '100%', maxWidth: '400px' }}>
          <LuSearch />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px' }}>Name</th>
              <th style={{ padding: '16px 24px' }}>Company</th>
              <th style={{ padding: '16px 24px' }}>Contact</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading customers...</td></tr>
            ) : filteredCustomers.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No customers found.</td></tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>{customer.name.charAt(0)}</div>
                      {customer.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{customer.company || 'N/A'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{customer.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customer.phone}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(customer)} className="icon-btn" style={{ marginRight: '12px', color: 'var(--primary)' }}><LuUser /></button>
                    <button onClick={() => handleDelete(customer._id)} className="icon-btn" style={{ color: 'var(--danger)' }}><LuTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Company</label>
            <input name="company" value={formData.company} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            {currentCustomer ? 'Update Customer' : 'Create Customer'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
