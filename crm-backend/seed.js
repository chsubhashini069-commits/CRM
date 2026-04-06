const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./src/models/Customer');
const Lead = require('./src/models/Lead');
const Task = require('./src/models/Task');
const Sale = require('./src/models/Sale');
const User = require('./src/models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (excluding Users)
    await Customer.deleteMany();
    await Lead.deleteMany();
    await Task.deleteMany();
    await Sale.deleteMany();

    // Find the current admin user to associate data with
    const user = await User.findOne({ email: 'admin@gmail.com' }) || await User.findOne();
    if (!user) {
      console.log('No user found. Please register an account in the app first.');
      process.exit(1);
    }
    console.log(`Seeding data for user: ${user.name} (${user.email})`);

    // 1. Seed Customers
    const customersData = [
      { name: 'TechGlobal Inc', email: 'admin@techglobal.com', phone: '+1-555-0199', company: 'TechGlobal', address: 'San Francisco, CA', assignedRep: user._id },
      { name: 'Solaris Systems', email: 'info@solaris.io', phone: '+1-555-0288', company: 'Solaris', address: 'Austin, TX', assignedRep: user._id },
      { name: 'Nexus Corp', email: 'billing@nexus.com', phone: '+1-555-0377', company: 'Nexus', address: 'New York, NY', assignedRep: user._id },
    ];
    const customers = await Customer.insertMany(customersData);
    console.log('Seed: 3 Customers created');

    // 2. Seed Leads
    const leadsData = [
      { name: 'Alice Johnson', contactInfo: 'alice.j@startup.co', source: 'Web', status: 'New', assignedRep: user._id },
      { name: 'Bob Smith', contactInfo: 'bob@enterprise.com', source: 'Referral', status: 'Qualified', assignedRep: user._id },
      { name: 'Charlie Davis', contactInfo: 'charlie@smb.net', source: 'Ads', status: 'Contacted', assignedRep: user._id },
    ];
    await Lead.insertMany(leadsData);
    console.log('Seed: 3 Leads created');

    // 3. Seed Tasks
    const tasksData = [
      { title: 'Follow up with TechGlobal', description: 'Schedule a demo for next week', dueDate: new Date(), priority: 'High', status: 'To Do', assignedTo: user._id },
      { title: 'Prepare Sales Deck', description: 'Update slides for Solaris presentation', dueDate: new Date(), priority: 'Medium', status: 'To Do', assignedTo: user._id },
      { title: 'Email Bob Smith', description: 'Send proposal document', dueDate: new Date(), priority: 'Low', status: 'Done', assignedTo: user._id },
    ];
    await Task.insertMany(tasksData);
    console.log('Seed: 3 Tasks created');

    // 4. Seed Sales
    const salesData = [
      { customer: customers[0]._id, amount: 25000, status: 'Negotiation', date: new Date(), assignedRep: user._id },
      { customer: customers[1]._id, amount: 45000, status: 'Closed Won', date: new Date(), assignedRep: user._id },
      { customer: customers[2]._id, amount: 15000, status: 'Closed Lost', date: new Date(), assignedRep: user._id },
    ];
    await Sale.insertMany(salesData);
    console.log('Seed: 3 Sales deals created');

    console.log('Database seeded successfully! 🚀');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
