<script>
  import { onMount } from "svelte";
  import http from "./request-helper";
  import OperationDocsStore from "./operationDocsStore";
  import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { getMainDefinition } from "@apollo/client/utilities";

  function createApolloClient() {
    const httpLink = new HttpLink({
      uri: "https://web-labs35.herokuapp.com/v1/graphql",
    });
    const cache = new InMemoryCache();
    const wsLink = new WebSocketLink({
      uri: "wss://web-labs35.herokuapp.com/v1/graphql",
      options: {
        reconnect: true,
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
      httpLink
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

  const deleteTodo = async () => {
    const name = prompt("which todo to delete?") || "";
    if (name) {
      await http.startExecuteMyMutation(OperationDocsStore.deleteByName(name));
    }
  };
</script>

<main>
  {#if $todos.loading}
    <h1>Loading...</h1>
  {:else if $todos.error}
    <h1>{$todos.error}</h1>
  {:else}
    <button on:click={addTodo}>Add new todo</button>
    <button on:click={deleteTodo}>Delete todo</button>

    {#each $todos.data.todo as todo}
      <div>
        <p>todo name: {todo.title}</p>
        <p>user id: {todo.user_id}</p>
        <hr />
      </div>
    {/each}
  {/if}
</main>

<style>
  main {
    margin: 0;
    padding: 0;
  }
</style>
