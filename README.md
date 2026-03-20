#  Batch Alumni 
A  backend project to manage and connect alumni with their batch members. This project allows users to register, login, and manage alumni profiles with secure authentication.

## Features
- User registration and login (JWT authentication)
- Add,get,get(single) alumni data
- View alumni profiles
- Secure API with authorization
- Backend built with Node.js & Express
- Database using MongoDB & Mongoose
##  Tech Stack
**Backend:**
- Node.js
- Express.js
**Database:**
- MongoDB
**Authentication:**
- JSON Web Token (JWT)
- bcrypt for password hashing
- ----
##  Project Structure
batch_alumni/
│── config/
│   └── db.js
│
│── controllers/
│   ├── userController.js
│   └── alumniController.js
│
│── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
│
│── models/
│   ├── userModel.js
│   └── alumniModel.js
│
│── routes/
│   ├── userRoutes.js
│   └── alumniRoutes.js
│
│── server.js
