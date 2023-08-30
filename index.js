require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json({limit: '50mb'}));





mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Db connected"))
  .catch(() => console.log("error in db"));

  
app.use(cors());
const adminRoute = require("./routers/adminRoutes");
const userRoute = require("./routers/userRoutes");


app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);



app.listen(5000, () => console.log("listening on 5000"));
