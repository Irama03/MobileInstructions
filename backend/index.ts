import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, Application } from "express";
import * as InstructionController from "./controllers/instructions";
import * as DevicesController from "./controllers/devices";
import * as CategoriesController from "./controllers/categories";
import cors from "cors";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.post("/instructions/:id/rate", InstructionController.rateInstruction);
app.get("/instructions/:id", InstructionController.getInstructionById);
app.get("/instructions", InstructionController.getInstructions);

app.get("/devices", DevicesController.getDevices);

app.get("/categories", CategoriesController.getCategories);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
