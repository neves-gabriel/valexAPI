import cors from "cors";
import express, { json, Request, Response } from "express";
import helmet from "helmet";
import "express-async-errors";
import RateLimit from "express-rate-limit";

const app = express();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
});

app.use(helmet());
app.use(limiter);
app.use(json());
app.use(cors());
app.use();
app.use(
  (error: { response: { status: number } }, req: Request, res: Response) => {
    console.log(error);
    if (error.response) {
      return res.sendStatus(error.response.status);
    }

    res.sendStatus(500);
  },
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
