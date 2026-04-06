const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');
const { swaggerUi, swaggerDocs } = require('./src/config/swagger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/customers', require('./src/routes/customerRoutes'));
app.use('/api/leads', require('./src/routes/leadRoutes'));
app.use('/api/tasks', require('./src/routes/taskRoutes'));
app.use('/api/sales', require('./src/routes/salesRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('CRM API is running... Visit /api-docs for documentation.');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
