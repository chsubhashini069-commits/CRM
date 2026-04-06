import { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import Modal from '../components/Modal';
import { LuPlus, LuSearch, LuUser, LuTrash2, LuFilter } from "react-icons/lu";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '', contactInfo: '', source: 'Web', status: 'New'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setCurrentLead(lead);
      setFormData(lead);
    } else {
      setCurrentLead(null);
      setFormData({ name: '', contactInfo: '', source: 'Web', status: 'New' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLead(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentLead) {
        await leadService.updateLead(currentLead._id, formData);
      } else {
        await leadService.createLead(formData);
      }
      fetchLeads();
      handleCloseModal();
    } catch (err) {
      alert('Error saving lead');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await leadService.deleteLead(id);
        fetchLeads();
      } catch (err) {
        alert('Error deleting lead');
      }
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="leads-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Leads</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track and convert potential customers into deals.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <LuPlus /> Add Lead
        </button>
      </div>

      <div className="table-controls glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="search-bar" style={{ width: '100%', maxWidth: '300px' }}>
          <LuSearch />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <LuFilter style={{ color: 'var(--text-muted)' }} />
           <select 
             value={statusFilter} 
             onChange={(e) => setStatusFilter(e.target.value)}
             style={{ width: '150px' }}
           >
             <option value="All">All Statuses</option>
             <option value="New">New</option>
             <option value="Contacted">Contacted</option>
             <option value="Qualified">Qualified</option>
             <option value="Lost">Lost</option>
           </select>
        </div>
      </div>

      <div className="leads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {loading ? (
          <p>Loading leads...</p>
        ) : filteredLeads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          filteredLeads.map(lead => (
            <div key={lead._id} className="glass-card animate-fade-in" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className={`badge-status ${lead.status.toLowerCase()}`} style={{ 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
                  background: lead.status === 'Qualified' ? 'var(--success)20' : lead.status === 'Lost' ? 'var(--danger)20' : 'var(--primary)20',
                  color: lead.status === 'Qualified' ? 'var(--success)' : lead.status === 'Lost' ? 'var(--danger)' : 'var(--primary)'
                }}>
                  {lead.status}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenModal(lead)} className="icon-btn" style={{ fontSize: '1rem' }}><LuUser /></button>
                  <button onClick={() => handleDelete(lead._id)} className="icon-btn" style={{ fontSize: '1rem', color: 'var(--danger)' }}><LuTrash2 /></button>
                </div>
              </div>
              <h3 style={{ margin: '8px 0', fontSize: '1.2rem' }}>{lead.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{lead.contactInfo}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span>Source: <strong>{lead.source}</strong></span>
                <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentLead ? 'Edit Lead' : 'Add New Lead'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Info (Email/Phone)</label>
            <input name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Source</label>
              <select name="source" value={formData.source} onChange={handleChange}>
                <option value="Web">Web</option>
                <option value="Ads">Ads</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            {currentLead ? 'Update Lead' : 'Create Lead'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
