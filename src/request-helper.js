import { userMsg } from "./stores";

class RequestHelper {
  constructor() {
    this.API_URL = HTTP_URL;
  }

  async fetchGraphQL(operationsDoc, operationName, variables) {
    return fetch(this.API_URL, {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
      headers: {
        "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET,
      },
    }).then((result) => {
      return result.json();
    });
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    const { errors, data } = await this.fetchMyQuery(operationsDoc);

    if (errors) {
      console.error(errors);
    }

    console.log(data);
    return { errors, data };
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  async startExecuteMyMutation(operationsDoc) {
    userMsg.set("Waiting...");
    const { errors, data } = await this.executeMyMutation(operationsDoc);
    if (errors) {
      userMsg.set(`Error: ${err.message}`);
    }
    setTimeout(() => userMsg.set(null), 5000);
    return data;
  }
}
export default new RequestHelper();
