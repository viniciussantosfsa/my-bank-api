import { GraphQLList } from "graphql";
import Account from "../types/Account.js";
import accountService from "../../services/account.service.js";

const accountQueries = {
  getAccounts: {
    type: new GraphQLList(Account),
    resolve: () => accountService.getAccounts(),
  },
};

export default accountQueries;
