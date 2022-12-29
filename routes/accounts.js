import express from "express";
const router = express.Router();

import { promises as fs } from "fs";
const { readFile, writeFile } = fs;

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error("Name and Balance required!");
    }

    const data = JSON.parse(await readFile(global.fileName));

    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance,
    };

    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);

    global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;

    res.send(data);

    global.logger.info(`GET /account - ${JSON.stringify(data)}`);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );

    res.send(account);

    global.logger.info(`GET /account/:id - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.end();
    global.logger.info(`DELETE /account`);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((acc) => acc.id === account.id);

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("Id, Name and Balance required!");
    }

    if (index === -1) {
      throw new Error("Record not found :(");
    }

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);

    global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.patch("/updateBalance", async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((acc) => acc.id === account.id);

    if (!account.id || account.balance == null) {
      throw new Error("Id and Balance required!");
    }

    if (index === -1) {
      throw new Error("Record not found :(");
    }

    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(data.accounts[index]);

    global.logger.info(
      `PATCH /account/updateBalance - ${JSON.stringify(account)}`
    );
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
