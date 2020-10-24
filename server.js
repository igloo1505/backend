require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
connectDB();

app.use(express.json({ extended: false }));
app.use("/users", require("./routes/userRoute"));
app.use("/authenticate", require("./routes/authRoute"));
// app.use("/recipes", require("./routes/medicationRoute"));
//
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`running node & express server on port ${PORT}`)
);
