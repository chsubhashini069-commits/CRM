import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import Modal from '../components/Modal';
import { LuPlus, LuCheck, LuCircle, LuCalendar, LuTrash2, LuUser } from "react-icons/lu";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setCurrentTask(null);
      setFormData({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do' });
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
      if (currentTask) {
        await taskService.updateTask(currentTask._id, formData);
      } else {
        await taskService.createTask(formData);
      }
      fetchTasks();
      handleCloseModal();
    } catch (err) {
      alert('Error saving task');
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        fetchTasks();
      } catch (err) {
        alert('Error deleting task');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'var(--danger)';
      case 'Medium': return 'var(--warning)';
      case 'Low': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="tasks-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay organized and track your daily activities.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <LuPlus /> Add Task
        </button>
      </div>

      <div className="tasks-container glass-card" style={{ padding: '0' }}>
        {loading ? (
          <p style={{ padding: '24px' }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center' }}>No tasks found. Create one to get started!</p>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div key={task._id} className="task-item" style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px',
                borderBottom: '1px solid var(--border-color)',
                background: task.status === 'Done' ? 'rgba(255,255,255,0.01)' : 'transparent',
                opacity: task.status === 'Done' ? 0.7 : 1
              }}>
                <button onClick={() => toggleStatus(task)} className="icon-btn" style={{ fontSize: '1.5rem', color: task.status === 'Done' ? 'var(--success)' : 'var(--text-muted)' }}>
                  {task.status === 'Done' ? <LuCheck /> : <LuCircle />}
                </button>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: '1rem', marginBottom: '4px',
                    textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                    color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text-main)'
                  }}>
                    {task.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <LuCalendar /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(task.priority) }}>
                      <LuCheck /> {task.priority} Priority
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenModal(task)} className="icon-btn"><LuUser /></button>
                  <button onClick={() => handleDelete(task._id)} className="icon-btn" style={{ color: 'var(--danger)' }}><LuTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentTask ? 'Edit Task' : 'Add Task'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
            </div>
            <div>
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            {currentTask ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
