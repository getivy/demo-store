import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";

dotenv.config();

const IVY_API_URL = process.env.IVY_API_URL;
const PORT = process.env.PORT;
const IVY_API_KEY = process.env.IVY_API_KEY ?? "secret";

const CONFIG = {
  headers: {
    "content-type": "application/json",
    "X-Ivy-Api-Key": IVY_API_KEY,
  },
};

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.static("public"));

app.post("/checkout/create", async (req: Request, res: Response) => {
  try {
    const price = req.body?.price;

    if (!price) {
      res.status(400).send("No price provided");
      return;
    }

    const response = await axios.post(
      `${IVY_API_URL}/service/checkout/session/create`,
      {
        referenceId: Date.now().toString(),
        price,
        guest: true,
        successCallbackUrl: "http://localhost:5173?success=true",
        errorCallbackUrl: "http://localhost:5173?error=true",
      },
      CONFIG
    );

    res.set("Content-Type", "application/json");
    res.send({
      ivyCheckoutUrl: response.data.redirectUrl,
    });
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || error.message,
      });
    } else {
      res
        .status(500)
        .json({ message: "Failed to create Ivy checkout session" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
