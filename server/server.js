const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("<h1>Hello from the backend!</h1>");
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
