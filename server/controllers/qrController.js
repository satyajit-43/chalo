// const User = require('../models/User');

// exports.validateQR = async (req, res) => {
//   try {
//     const { qrData } = req.body;

//     // Extract the unique identifier from QR data
//     const qrCode = qrData.split(':').pop(); // Assuming format "chalopass:email:UUID"

//     // Find user by QR code
//     const user = await User.findOne({ qrCode })
//       .select('-password -__v');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         walletBalance: user.walletBalance
//       }
//     });

//   } catch (error) {
//     console.error('QR validation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error validating QR code'
//     });
//   }
// };





// const User = require('../models/User');

// exports.validateQR = async (req, res) => {
//   try {
//     const { qrData } = req.body;

//     // Validate input
//     if (!qrData) {
//       return res.status(400).json({
//         success: false,
//         message: 'QR code data is required'
//       });
//     }

//     // Extract the QR code value (handles both full format and raw UUID)
//     let qrCode;
//     if (qrData.includes(':')) {
//       // If QR data is in format "chalopass:email:UUID"
//       qrCode = qrData.split(':').pop();
//     } else {
//       // If QR data is just the UUID
//       qrCode = qrData;
//     }

//     // Validate QR code format (basic UUID check)
//     if (!qrCode.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid QR code format'
//       });
//     }

//     // Find user by QR code
//     const user = await User.findOne({ qrCode })
//       .select('-password -__v -transactions -createdAt');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'No account associated with this QR code'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         walletBalance: user.walletBalance,
//         qrCode: user.qrCode
//       }
//     });

//   } catch (error) {
//     console.error('QR validation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during QR validation',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };









// controllers/qrController.js
const User = require('../models/User');

exports.validateQR = async (req, res) => {
  try {
    const { qrData } = req.body;

    // Validate input exists
    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR code data is required'
      });
    }

    // Find user by the exact QR code (no parsing needed)
    const user = await User.findOne({ qrCode: qrData })
      .select('-password -__v -transactions -createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account associated with this QR code'
      });
    }

    res.status(200).json({
      success: true,
      user: {  // Changed from 'data' to 'user' to match frontend
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        qrCode: user.qrCode
      }
    });

  } catch (error) {
    console.error('QR validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during QR validation'
    });
  }
};