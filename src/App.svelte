<script>
  import http from "./request-helper";
  import OperationDocsStore from "./operationDocsStore";
  import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { getMainDefinition } from "@apollo/client/utilities";
  import { writable } from "svelte/store";

  export const userMsg = writable("");
  let isOnline = true;
  window.onoffline = () => {
    isOnline=false;
  };
  window.ononline = () => {
    isOnline=true;
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
    await http.startExecuteMyMutation(OperationDocsStore.addOne(name));
  };

  const deleteTodo = async (id) => {
    try{
      await http.startExecuteMyMutation(OperationDocsStore.deleteByName(id));
      $userMsg="Delete done";
    }
    catch(e){
      $userMsg= `Error: ${e.message}`;;
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
  main {
    margin: 0;
    padding: 0;
  }
</style>
