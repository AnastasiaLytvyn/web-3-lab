class RequestHelper {
  constructor() {
    this.API_URL = HTTP_URL;
  }

  async fetchGraphQL(operationsDoc, operationName, variables) {
    return fetch(this.API_URL, {
        method: 'POST',
        body: JSON.stringify({
            query: operationsDoc,
            variables: variables,
            operationName: operationName
        })
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
      // handle those errors like a pro
      console.error(errors);
    }

    // do something great with this precious data
    console.log(data);
    return data;
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }


  async startExecuteMyMutation(operationsDoc) {
    const { errors, data } = await this.executeMyMutation(
        operationsDoc
    );
    if (errors) {
        throw new Error(errors[0].message);
    }
    return data;
  }


}
export default new RequestHelper();
