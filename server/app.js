// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chalopass', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // User Model
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   walletBalance: { type: Number, default: 1000 },
//   qrCode: { type: String, unique: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', UserSchema);

// // Registration Endpoint
// app.post('/api/users/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Email already registered' 
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Generate QR code data (simple UUID for demo)
//     const qrCode = require('crypto').randomBytes(16).toString('hex');

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       qrCode
//     });

//     await user.save();

//     res.status(201).json({ 
//       success: true,
//       message: 'Registration successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         qrCode: user.qrCode
//       }
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error during registration' 
//     });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// Connect to database
connectDB();
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true // If you're using cookies/sessions
  }));


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/wallet', require('./routes/walletRoutes'));

app.use('/api/users', require('./routes/authRoutes'));

// In server.js
app.use('/api/qr', require('./routes/qrRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);