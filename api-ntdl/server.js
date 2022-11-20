import express from "express";
const app = express();
const PORT = 8000;

import morgan from "morgan";
//middleware
app.use(morgan("dev"));
app.use(express.json());

//db connection
import mongoConnect from "./src/config/dbConfig.js";
mongoConnect();

// api endpoints
import taskRouter from "./src/routers/taskRouter.js";
app.use("/api/v1/task", taskRouter);

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server running at http://localhost:${PORT}`);
});
