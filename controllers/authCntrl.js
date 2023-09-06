const UserModal = require("../models/UserModal");
const jwt = require('jsonwebtoken');






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
