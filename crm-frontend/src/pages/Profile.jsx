import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import Modal from '../components/Modal';
import { LuUser, LuMail, LuShield, LuCalendar, LuLock } from "react-icons/lu";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { oldPassword, newPassword, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    setError('');
    try {
      await authService.updatePassword({ oldPassword, newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1>My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal account settings and roles.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px', padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
           <div className="avatar" style={{ 
             width: '80px', height: '80px', fontSize: '2rem', 
             background: user?.role === 'admin' ? 'var(--secondary)' : 'var(--primary)',
             marginBottom: '16px'
           }}>
             {user?.name?.charAt(0).toUpperCase()}
           </div>
           <h2>{user?.name}</h2>
           <p style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
        </div>

        <div className="profile-details" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}><LuMail /> Email Address</span>
              <span style={{ fontWeight: '600' }}>{user?.email}</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}><LuShield /> Account Role</span>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{user?.role}</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}><LuCalendar /> Member Since</span>
              <span style={{ fontWeight: '600' }}>{new Date().toLocaleDateString()}</span>
           </div>
        </div>

        <button onClick={handleOpenModal} className="btn btn-outline" style={{ width: '100%', marginTop: '32px' }}>
          Change Password
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change Password">
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ color: 'var(--success)', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}
          
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={onChange}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={onChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
