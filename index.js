require("dotenv").config();
const express = require("express");
const helmet = require('helmet'); // helps securing Express apps by setting various HTTP headers
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(helmet())
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const application = require("./routes/application");
app.use(application);


app.listen(process.env.PORT, () => {
  console.log("Server listening");
});
