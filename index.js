import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.routes.js";
import cors from "cors";
import expressBasicAuth from "express-basic-auth";

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
// Auth
function getRole(username) {
  if (username == "admin") {
    return "admin";
  } else if (username == "kellvy") {
    return "role1";
  }
}

function authorize(...allowed) {
  const isAllowed = (role) => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    if (req.auth.user) {
      const role = getRole(req.auth.user);

      if (isAllowed(role)) {
        next();
      } else {
        res.status(401).send("Role not allowed");
      }
    } else {
      res.status(403).send("User not found");
    }
  };
}

app.use(
  expressBasicAuth({
    authorizer: (username, password) => {
      
      const userMatches = expressBasicAuth.safeCompare(username, "admin");
      const pwdMatches = expressBasicAuth.safeCompare(password, "admin");

      const userMatches2 = expressBasicAuth.safeCompare(username, "kellvy");
      const pwdMatches2 = expressBasicAuth.safeCompare(password, "1234");

      return userMatches && pwdMatches || userMatches2 && pwdMatches2;
    },
  })
);
//
app.use("/account", authorize("admin", "role1"), accountsRouter);

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
