import "dotenv";
import { DolarPriceController } from "../controllers/DolarPriceController";

const controller = new DolarPriceController();

controller.getDolarPrice();
