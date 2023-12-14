import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Application } from "express";
import * as InstructionController from "./controllers/instructions";
import * as DevicesController from "./controllers/devices";
import * as CategoriesController from "./controllers/categories";
import * as AdminController from "./controllers/admin";
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

app.post("/admin/login", AdminController.adminLogin);

app.post(
  "/admin/instructions",
  AdminController.validateAdminToken,
  AdminController.createInstruction
);
app.put(
  "/admin/instructions/:id",
  AdminController.validateAdminToken,
  AdminController.updateInstruction
);
app.delete(
  "/admin/instructions/:id",
  AdminController.validateAdminToken,
  AdminController.deleteInstruction
);

app.post(
  "/admin/categories",
  AdminController.validateAdminToken,
  AdminController.createCategory
);
app.put(
  "/admin/categories/:id",
  AdminController.validateAdminToken,
  AdminController.updateCategory
);
app.delete(
  "/admin/categories/:id",
  AdminController.validateAdminToken,
  AdminController.deleteCategory
);

app.post(
  "/admin/devices",
  AdminController.validateAdminToken,
  AdminController.createDeviceType
);
app.put(
  "/admin/devices/:id",
  AdminController.validateAdminToken,
  AdminController.updateDeviceType
);
app.delete(
  "/admin/devices/:id",
  AdminController.validateAdminToken,
  AdminController.deleteDeviceType
);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
