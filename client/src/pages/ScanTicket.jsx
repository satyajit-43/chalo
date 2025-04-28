// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import QrScanner from 'qr-scanner';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function ScanTicket() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const [scanResult, setScanResult] = useState(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [scanner, setScanner] = useState(null);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     if (!state?.source || !state?.destination) {
//       navigate('/');
//       return;
//     }

//     startScanner();

//     return () => {
//       if (scanner) {
//         scanner.stop();
//         scanner.destroy();
//       }
//     };
//   }, []);

//   const startScanner = () => {
//     const videoElem = document.getElementById('qr-scanner');
//     if (!videoElem) return;

//     const qrScanner = new QrScanner(
//       videoElem,
//       async (result) => {
//         try {
//           qrScanner.stop();
//           setScanResult(result.data);
          
//           // Validate the scanned QR code with backend
//           const response = await axios.post('http://localhost:5000/api/qr', {
//             qrData: result.data
//           });

//           if (response.data.success) {
//             setUserData(response.data.user);
//             toast.success(`Valid QR for ${response.data.user.name}`);
//           } else {
//             toast.error('Invalid QR code');
//             setTimeout(() => setScanResult(null), 2000); // Reset after error
//           }
//         } catch (error) {
//           toast.error('Validation failed');
//           setTimeout(() => setScanResult(null), 2000);
//         }
//       },
//       { 
//         highlightScanRegion: true,
//         maxScansPerSecond: 5,
//         returnDetailedScanResult: true
//       }
//     );

//     qrScanner.start()
//       .then(() => setCameraActive(true))
//       .catch(err => {
//         console.error('Camera error:', err);
//         toast.error('Camera access denied or not available');
//       });
    
//     setScanner(qrScanner);
//   };

//   const proceedToPayment = () => {
//     if (!userData) return;
    
//     navigate('/payment', {
//       state: {
//         ...state,
//         userId: userData.id,
//         userWallet: userData.walletBalance
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-bold mb-4">Scan Your Chalo Pass QR</h2>
//         <p className="mb-2">From: <span className="font-semibold">{state?.source}</span></p>
//         <p className="mb-4">To: <span className="font-semibold">{state?.destination}</span></p>
        
//         <div className="relative w-full h-64 bg-black rounded overflow-hidden mb-4">
//           <video 
//             id="qr-scanner" 
//             className="w-full h-full object-cover"
//             playsInline
//           ></video>
          
//           {!cameraActive && (
//             <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">
//               <p>Initializing camera...</p>
//             </div>
//           )}
          
//           {scanResult && (
//             <div className={`absolute inset-0 flex items-center justify-center bg-opacity-80 text-white ${
//               userData ? 'bg-green-500' : 'bg-red-500'
//             }`}>
//               <p>{userData ? 'Valid QR Code' : 'Invalid QR Code'}</p>
//             </div>
//           )}
//         </div>

//         {userData && (
//           <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//             <p className="font-medium">User: {userData.name}</p>
//             <p>Wallet Balance: ₹{userData.walletBalance.toFixed(2)}</p>
//           </div>
//         )}

//         <div className="flex space-x-3">
//           <button
//             onClick={() => navigate('/')}
//             className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
//           >
//             Cancel
//           </button>
          
//           {userData && (
//             <button
//               onClick={proceedToPayment}
//               className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             >
//               Proceed to Payment
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

















// import { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import QrScanner from 'qr-scanner';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function ScanTicket() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const [scanResult, setScanResult] = useState(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const scannerRef = useRef(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // Validate route state
//     if (!state?.source || !state?.destination) {
//       navigate('/');
//       return;
//     }

//     startScanner();

//     return () => {
//       if (scannerRef.current) {
//         scannerRef.current.stop();
//         scannerRef.current.destroy();
//       }
//     };
//   }, [navigate, state]);

//   const startScanner = async () => {
//     try {
//       if (!videoRef.current) return;

//       // Initialize scanner
//       scannerRef.current = new QrScanner(
//         videoRef.current,
//         handleScanResult,
//         {
//           highlightScanRegion: true,
//           maxScansPerSecond: 5,
//           returnDetailedScanResult: true,
//           preferredCamera: 'environment'
//         }
//       );

//       await scannerRef.current.start();
//       setCameraActive(true);
//     } catch (err) {
//       console.error('Camera error:', err);
//       toast.error('Camera access denied or not available');
//       setCameraActive(false);
//     }
//   };

//   const handleScanResult = async (result) => {
//     try {
//       scannerRef.current?.stop();
//       setScanResult(result.data);
//       setLoading(true);

//       // Validate QR code with backend
//       const response = await axios.post('http://localhost:5000/api/qr/validate', {
//         qrData: result.data
//       });
      
//       if (response.data.success) {
//         setUserData(response.data.data);
//         toast.success(`Valid QR for ${response.data.data.name}`);
//       } else {
//         toast.error(response.data.message || 'Invalid QR code');
//         setTimeout(() => {
//           setScanResult(null);
//           scannerRef.current?.start();
//         }, 2000);
//       }
//     } catch (error) {
//       console.error('Validation error:', error);
//       toast.error(error.response?.data?.message || 'Validation failed');
//       setTimeout(() => {
//         setScanResult(null);
//         scannerRef.current?.start();
//       }, 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const proceedToPayment = () => {
//     if (!userData) return;
    
//     navigate('/payment', {
//       state: {
//         ...state,
//         userId: userData.id,
//         userWallet: userData.walletBalance,
//         userName: userData.name
//       }
//     });
//   };

//   const retryScan = () => {
//     setScanResult(null);
//     setUserData(null);
//     scannerRef.current?.start();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-bold mb-4">Scan Your Chalo Pass QR</h2>
//         <p className="mb-2">From: <span className="font-semibold">{state?.source}</span></p>
//         <p className="mb-4">To: <span className="font-semibold">{state?.destination}</span></p>
        
//         <div className="relative w-full h-64 bg-black rounded overflow-hidden mb-4">
//           <video 
//             ref={videoRef}
//             id="qr-scanner" 
//             className="w-full h-full object-cover"
//             playsInline
//           ></video>
          
//           {!cameraActive && (
//             <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">
//               <p>Initializing camera...</p>
//             </div>
//           )}
          
//           {scanResult && (
//             <div className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-80 text-white ${
//               userData ? 'bg-green-500' : 'bg-red-500'
//             }`}>
//               <p className="text-lg font-semibold mb-2">
//                 {userData ? 'Valid QR Code' : 'Invalid QR Code'}
//               </p>
//               {!userData && (
//                 <button
//                   onClick={retryScan}
//                   className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-100"
//                 >
//                   Try Again
//                 </button>
//               )}
//             </div>
//           )}

//           {loading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           )}
//         </div>

//         {userData && (
//           <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//             <p className="font-medium">User: {userData.name}</p>
//             <p>Email: {userData.email}</p>
//             <p>Wallet Balance: ₹{userData.walletBalance.toFixed(2)}</p>
//           </div>
//         )}

//         <div className="flex space-x-3">
//           <button
//             onClick={() => navigate('/')}
//             className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
//           >
//             Cancel
//           </button>
          
//           {userData ? (
//             <button
//               onClick={proceedToPayment}
//               disabled={loading}
//               className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//             >
//               {loading ? 'Processing...' : 'Proceed to Payment'}
//             </button>
//           ) : (
//             <button
//               onClick={retryScan}
//               className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
//             >
//               Scan Again
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }














import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { toast } from 'react-toastify';

export default function ScanTicket() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const videoRef = useRef(null);

  // Hardcoded valid QR code
  const VALID_QR_CODE = 'e3441ad1284a05fa0fcf63d8d48c3669';
  // Hardcoded user data for valid QR
  const VALID_USER = {
    id: 'e3441ad1284a05fa0fcf63d8d48c3669',
    name: 'Satyajit',
    email: 'sagahan289@gmail.com',
    walletBalance: 1100,
    qrCode: VALID_QR_CODE
  };

  useEffect(() => {
    if (!state?.source || !state?.destination) {
      navigate('/');
      return;
    }

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, [navigate, state]);

  const startScanner = async () => {
    try {
      if (!videoRef.current) return;

      scannerRef.current = new QrScanner(
        videoRef.current,
        handleScanResult,
        {
          highlightScanRegion: true,
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
          preferredCamera: 'environment'
        }
      );

      await scannerRef.current.start();
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      toast.error('Camera access denied or not available');
      setCameraActive(false);
    }
  };

  const handleScanResult = async (result) => {
    try {
      scannerRef.current?.stop();
      setScanResult(result.data);
      setLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.data === VALID_QR_CODE) {
        setUserData(VALID_USER);
        toast.success(`Valid QR for ${VALID_USER.name}`);
      } else {
        toast.error('Invalid QR code');
        setUserData(null);
        setTimeout(() => {
          setScanResult(null);
          scannerRef.current?.start();
        }, 2000);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation failed');
      setTimeout(() => {
        setScanResult(null);
        scannerRef.current?.start();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = () => {
    if (!userData) return;
    
    navigate('/ticket', {
      state: {
        ...state,
        userId: userData.id,
        userWallet: userData.walletBalance,
        userName: userData.name
      }
    });
  };

  const retryScan = () => {
    setScanResult(null);
    setUserData(null);
    scannerRef.current?.start();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Scan Your Chalo Pass QR</h2>
        <p className="mb-2">From: <span className="font-semibold">{state?.source}</span></p>
        <p className="mb-4">To: <span className="font-semibold">{state?.destination}</span></p>
        
        <div className="relative w-full h-64 bg-black rounded overflow-hidden mb-4">
          <video 
            ref={videoRef}
            id="qr-scanner" 
            className="w-full h-full object-cover"
            playsInline
          ></video>
          
          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">
              <p>Initializing camera...</p>
            </div>
          )}
          
          {scanResult && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-80 text-white ${
              userData ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <p className="text-lg font-semibold mb-2">
                {userData ? 'Valid QR Code' : 'Invalid QR Code'}
              </p>
              {!userData && (
                <button
                  onClick={retryScan}
                  className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-100"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {userData && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">User: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Wallet Balance: ₹{userData.walletBalance.toFixed(2)}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          
          {userData ? (
            <button
              onClick={proceedToPayment}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          ) : (
            <button
              onClick={retryScan}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Scan Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}