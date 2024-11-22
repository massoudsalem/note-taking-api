import app from './app.js';
import sequelize from './config/database.js';

const PORT = process.env.PORT || 3000;

// Database connection and server startup
sequelize.sync().then(() => {
  console.log('Database connected successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});