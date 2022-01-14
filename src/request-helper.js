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
    // throw new Error();
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  concatenateErrors(errors) {
    return errors.reduce(
      (message, error) =>
        `${message.length === 0 ? message : message + ", "}${error.message}`,
      "",
    );
  }

  async startExecuteMyMutation(operationsDoc) {
    try {
      userMsg.set("Waiting...");

      const { errors, data } = await this.executeMyMutation(operationsDoc);

      if (errors) {
        throw new Error(this.concatenateErrors(errors));
      }

      userMsg.set("Succesfully.");

      return data;
    } catch (error) {
      userMsg.set(`Error: ${error.message || "unknown error."}`);
    }
  }
}
export default new RequestHelper();
