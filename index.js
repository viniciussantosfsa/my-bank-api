import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.routes.js";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import Schema from "./schema/index.js";

//import { buildSchema } from "graphql";
//import accountService from "./services/account.service.js";

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

/*
const schema = buildSchema(`
  type Account {
    id: Int
    name: String
    balance: Float
  }
  input AccountInput {
    id: Int
    name: String
    balance: Float
  }
  type Query {
    getAccounts: [Account]
    getAccount(id: Int): Account
  }
  type Mutation {
    createAccount(account: AccountInput): Account
    deleteAccount(id: Int): Boolean
    updateAccount(account: AccountInput): Account
  }
`);

const root = {
  getAccounts: () => accountService.getAccounts(),
  getAccount(args) {
    return accountService.getIdAccount(args.id);
  },
  createAccount({ account }) {
    return accountService.createAccount(account);
  },
  deleteAccount(args) {
    accountService.deleteAccount(args.id);
  },
  updateAccount({ account }) {
    return accountService.updateAccount(account);
  },
};
*/

const app = express();
//app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use("/account", accountsRouter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    //rootValue: root,
    graphiql: true,
  })
);

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
