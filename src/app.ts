import cors from "cors";
import express, { json, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import "express-async-errors";

const app = express();

app.use(helmet());
app.use(json());
app.use(cors());
app.use();
app.use(
  (
    error: { response: { status: number } },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(error);
    if (error.response) {
      return res.sendStatus(error.response.status);
    }

    res.sendStatus(500);
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
