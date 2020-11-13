require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// MY routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productsRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

// DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

// middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// my routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productsRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
