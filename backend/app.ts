import router from "./routes/Router";

import dotenv from "dotenv";

dotenv.config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


require("./config/db");

app.use(router);
app.listen(port, () => {
  console.log(`app rodando na porta ${port}`);
});
