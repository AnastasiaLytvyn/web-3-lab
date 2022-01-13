<script>
  import http from "./request-helper";
  import OperationDocsStore from "./operationDocsStore";
  import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { getMainDefinition } from "@apollo/client/utilities";

  let userMsg = "";
  let isOnline = true;
  window.onoffline = () => {
    isOnline = false;
  };
  window.ononline = () => {
    isOnline = true;
  };
  function createApolloClient() {
    const headers = {
      "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET,
    };
    const httpLink = new HttpLink({
      uri: HTTP_URL,
      headers,
    });
    const cache = new InMemoryCache();
    const wsLink = new WebSocketLink({
      uri: WEBSOCKET_URL,
      options: {
        reconnect: true,
        connectionParams: {
          headers,
        },
      },
    });
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink,
    );
    return new ApolloClient({
      link,
      cache,
    });
  }

  const client = createApolloClient();
  setClient(client);
  const todos = subscribe(OperationDocsStore.subscribeToAll());

  const addTodo = async () => {
    const name = prompt("name") || "";
    try {
      userMsg = "Adding...";
      await http.startExecuteMyMutation(OperationDocsStore.addOne(name));
      userMsg = null;
    } catch (err) {
      userMsg = `Error: ${err.message}`;
    }
  };

  const deleteTodo = async (id) => {
    try {
      userMsg = "Deleting...";
      await http.startExecuteMyMutation(OperationDocsStore.deleteByName(id));
      userMsg = null;
    } catch (err) {
      userMsg = `Error: ${err.message}`;
    }
  };
</script>

<main>
  {#if isOnline}
    {#if $todos.loading}
      <h1>Loading...</h1>
    {:else if $todos.error}
      <h1>{$todos.error}</h1>
    {:else}
      <button on:click={addTodo}>Add new todo</button>
      {#if userMsg}
        <div>{userMsg}</div>
      {/if}
      {#each $todos.data.todo as todo}
        <div>
          <p>todo name: {todo.title}</p>
          <p>user id: {todo.user_id}</p>
          <button on:click={() => deleteTodo(todo.id)}>Delete todo</button>
          <hr />
        </div>
      {/each}
    {/if}
  {:else}
    <h1>You are offline, check your Internet Connection</h1>{/if}
</main>

<style>
  :root {
    --button-primary: #adb5bd;
    --button-hover: #939aa1;
  }

  main {
    margin: 0;
    padding: 0;
  }

  button {
    cursor: pointer;
    background-color: var(--button-primary);
    transition: 0.3s;
  }

  button:hover {
    background-color: var(--button-hover);
  }
</style>
