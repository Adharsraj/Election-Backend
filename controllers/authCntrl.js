const UserModal = require("../models/UserModal");
const jwt = require('jsonwebtoken');


// const fast2smsApiKey = "LzDfy8EGHOTJwIxZB2WM9YbmFkcp0avodP3jg5CVitX4elqQh1zgl5y4rbwAYfDGJxcetus8T1aHWROS";

// const sendOtp = async (req, res) => {
//   const { email } = req.body;

//   // Generate a random OTP (6-digit)
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   try {
//     const user = await UserModal.findOne({ email });

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     user.otp = otp; // Assign OTP to the user
//     await user.save();

//     // Replace with your actual implementation to send OTP using Fast2SMS
//     const response = await axios.get(
//       `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsApiKey}&message=${otp}&language=english&route=dlt&numbers=${email}`
//     );

//     if (response.data.return === true) {
//       res.json({ success: true });
//     } else {
//       res.json({ success: false });
//     }
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ success: false });
//   }
// };

// const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.otp === otp) {
//       user.otp = undefined; // Clear the OTP
//       await user.save();

//       // Generate and send JWT token for authentication
//       const token = user.createJWT();
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ success: false });
//   }
// };




 const userLogin = async (req, res) => {
  const { email, password } = req.body;
  //validation
 
  //find user by email
  const User = await UserModal.findOne({ email });
  if (!User) {
       return res.status(401).send("Invalid email or password");
}
  //compare password
  const isMatch = await User.comparePassword(password);
  if (!isMatch) {
    return res.status(401).send("Invalid email or password");
}
  const token = User.createJWT();
  res.status(200).json({
    success: true,
    message: "Login SUccessfully",
    User,
    token,
  });
};



const verifyTokenget = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).send('Access denied. Token missing.');
      }
      jwt.verify(token,'secretkey', (err, decoded) => {
        if (err) {
          return res.status(401).send('Invalid token.');
        }
        req.user = decoded; 
        next();
      });
    } catch (error) {
      console.log(error)
    }
  };
  
  const verifyTokenpost = (req, res, next) => {
   try {
     const token = req.body.headers.Authorization?.split(' ')[1];
     if (!token) {
       return res.status(401).send('Access denied. Token missing.');
     }
     jwt.verify(token,'secretkey', (err, decoded) => {
       if (err) {
         return res.status(401).send('Invalid token.');
       }   

       req.user = decoded; 
       next();
     });
   
   } catch (error) {
     console.log(error)
   }

  }

const checkAdminRole =async (req, res, next) => {
   try {
     const user=await UserModal.findById(req.user.userId)
     if (user.role === 'admin') {
         next(); // User is authorized, proceed to the next middleware/route handler
       } else {
         res.status(403).send('Access denied. You need the "Admin" role.');
       }
   } catch (error) {
     console.log(error)
   }
  }

  const checkUserRole =async (req, res, next) => {
    try {
      const user=await UserModal.findById(req.user.userId)
      if (user.role === 'user') {
          next(); // User is authorized, proceed to the next middleware/route handler
        } else {
          res.status(403).send('Access denied. You need the "user" role.');
        }
    } catch (error) {
      console.log(error)
    }
   }
 


module.exports = { userLogin,verifyTokenget,checkAdminRole,checkUserRole,verifyTokenpost,
   };
