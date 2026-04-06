# 🚀 Premium Cloud CRM - Full Stack Management System

A state-of-the-art Customer Relationship Management (CRM) system built with the MERN stack (MongoDB, Express, React, Node.js). This application features a premium dark-themed UI, real-time analytics, and comprehensive management of customers, leads, tasks, and sales.

![CRM Dashboard](https://images.unsplash.com/photo-1551288049-bbda4865cda1?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **📊 Dynamic Dashboard**: Visualized sales revenue trends and key performance indicators (KPIs).
- **👥 Customer Management**: Complete CRUD operations for client profiles.
- **🎯 Lead Tracking**: Visual grid for managing and converting potential opportunities.
- **✅ Task Excellence**: To-do lists with priority levels and due dates to keep your team on track.
- **💰 Sales Pipeline**: Colored status cards for tracking deals from negotiation to close.
- **🔐 Secure Authentication**: JWT-based auth with role-based access control (Admin/User).
- **🛠️ Profile Settings**: Update personal details and change passwords securely.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS Modules (Vanilla CSS for premium styling), React Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
- **Aesthetics**: Glassmorphism, Dark Mode, Smooth Animations.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas Account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chsubhashini069-commits/CRM.git
   cd CRM
   ```

2. **Backend Setup**:
   ```bash
   cd crm-backend
   npm install
   # Create a .env file based on .env.example and add your MongoDB URI and JWT Secret
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../crm-frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

## 🧪 Database Seeding

To populate the database with sample data for demonstration:
```bash
cd crm-backend
npm run seed
```

---

*Built with ❤️ by Antigravity AI*
