import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.routes.js";
import cors from "cors";

import { promises as fs } from "fs";
const { readFile, writeFile } = fs;
const port = 1002;

const { combine, timestamp, label, printf } = winston.format;
const myFormt = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.fileName = "accounts.json";

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormt),
});

const app = express();
app.use(express.json());
app.use(cors());
//app.use(express.static("public"));
app.use("/account", accountsRouter);

app.listen(port, async () => {
  try {
    await readFile(global.fileName);
    global.logger.info(`API Started! PORT:${port}`);
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.fileName, JSON.stringify(initialJson))
      .then(() => {
        global.logger.info(`API Started and File Create! PORT:${port}`);
      })
      .catch((err) => {
        global.logger.error(err);
      });
  }
});
