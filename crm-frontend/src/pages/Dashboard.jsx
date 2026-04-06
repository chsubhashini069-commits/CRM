import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import customerService from '../services/customerService';
import leadService from '../services/leadService';
import taskService from '../services/taskService';
import salesService from '../services/salesService';
import { LuTrendingUp, LuUsers, LuUserPlus, LuCheck } from "react-icons/lu";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    tasks: 0,
    sales: 0,
    totalRevenue: 0
  });
  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: []
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customers, leads, tasks, sales] = await Promise.all([
          customerService.getCustomers(),
          leadService.getLeads(),
          taskService.getTasks(),
          salesService.getSales()
        ]);

        const revenue = sales.reduce((acc, sale) => acc + (sale.status === 'Closed Won' ? sale.amount : 0), 0);
        
        setStats({
          customers: customers.length,
          leads: leads.length,
          tasks: tasks.filter(t => t.status !== 'Done').length,
          sales: sales.length,
          totalRevenue: revenue
        });

        setRecentLeads(leads.slice(0, 5));

        // Mock chart data based on real sales if available, or static for demo
        setSalesData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue ($)',
              data: [12000, 19000, 15000, revenue || 25000, 22000, 30000],
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              fill: true,
              tension: 0.4
            }
          ]
        });

      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <LuTrendingUp />, color: 'var(--primary)' },
    { title: 'Customers', value: stats.customers, icon: <LuUsers />, color: 'var(--success)' },
    { title: 'New Leads', value: stats.leads, icon: <LuUserPlus />, color: 'var(--secondary)' },
    { title: 'Pending Tasks', value: stats.tasks, icon: <LuCheck />, color: 'var(--warning)' },
  ];

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1>Welcome, {user?.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here is what's happening with your projects today.</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="stat-icon" style={{ padding: '12px', background: stat.color + '20', color: stat.color, borderRadius: '12px', fontSize: '1.5rem' }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '24px' }}>Sales Performance</h3>
          <div style={{ height: '350px' }}>
            <Line 
              data={salesData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
              }} 
            />
          </div>
        </div>
        <div className="glass-card">
          <h3 style={{ marginBottom: '24px' }}>Recent Leads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {recentLeads.length === 0 ? (
               <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No recent leads</p>
             ) : (
               recentLeads.map(lead => (
                 <div key={lead._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                   <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>{lead.name.charAt(0)}</div>
                   <div>
                     <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{lead.name}</p>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.source}</p>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
