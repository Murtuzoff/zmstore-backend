# ZMStore Backend

## About the Project

ZMStore backend is built with Node.js and Express, using Sequelize ORM to interact with a relational database.  
The architecture is modular, with a clear separation between models, controllers, and routes, ensuring scalability and maintainability.

## Key Features

- Built with Node.js, Express, and Sequelize ORM  
- Modular architecture with well-organized models, controllers, and routes  
- Centralized error handling with a custom `AppError` class and global error middleware  
- Secure authentication and authorization implemented via middleware  
- Integration with PayPal for payment processing  
- File upload and storage functionality (e.g., product images)  
- Static files served from a dedicated folder  

## Installation and Running

1. Clone the repository:
   ```
   git clone https://github.com/Murtuzoff/zmstore-backend
2. Navigate into the project directory:
   ```
   cd zmstore-backend
3. Configure database connection and other environment variables
4. Install dependencies:
   ```
   npm install
5. Start the server in development mode:
   ```
   npm run dev
6. For production:
   ```
   npm start
