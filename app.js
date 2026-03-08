const connectDB = require("./db/connect");
const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
require("express-async-errors");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const products = require("./routes/products");

//middleware //...//

app.use(express.static("./public"));
app.use(express.json());
app.use(morgan("tiny"));

//routes
app.get("/", (req, res) => {
  res
    .status(200)
    .send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use("/api/v1/products", products);

//products route 

app.use(notFound);
app.use(errorHandlerMiddleware);
//...// Start the server //...//

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    console.time("Connecting to DB Duration");
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to DB");
    console.timeEnd("Connecting to DB Duration");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();

// ......................... //
