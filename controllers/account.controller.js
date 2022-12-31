import accountService from "../services/account.service.js";

async function createAccount(req, res, next) {
  try {
    let account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error("Name and Balance required!");
    }

    account = await accountService.createAccount(account);

    res.send(account);

    global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

async function getAccount(req, res, next) {
  try {
    res.send(await accountService.getAccounts());

    // Logger com problemas
    //global.logger.info(`GET /account - ${JSON.stringify(accountService.getAccounts())}`);
  } catch (err) {
    next(err);
  }
}

async function getIdAccount(req, res, next) {
  try {
    res.send(await accountService.getIdAccount(req.params.id));

    // Logger com problemas
    //global.logger.info(`GET /account/:id - ${JSON.stringify(accountService.getIdAccount())}`);
  } catch (err) {
    next(err);
  }
}

async function accountDelete(req, res, next) {
  try {
    await accountService.deleteAccount(req.params.id);

    res.end();

    global.logger.info(`DELETE /account`);
  } catch (err) {
    next(err);
  }
}

async function accountPut(req, res, next) {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("Id, Name and Balance required!");
    }

    res.send(await accountService.updateAccount(account));

    global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

async function accountPatch(req, res, next) {
  try {
    const account = req.body;

    if (!account.id || account.balance == null) {
      throw new Error("Id and Balance required!");
    }

    res.send(await accountService.updateBalance(account));

    global.logger.info(
      `PATCH /account/updateBalance - ${JSON.stringify(account)}`
    );
  } catch (err) {
    next(err);
  }
}

export default {
  createAccount,
  getAccount,
  getIdAccount,
  accountDelete,
  accountPut,
  accountPatch,
};
