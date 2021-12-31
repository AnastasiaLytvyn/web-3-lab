import { gql } from "@apollo/client";

export default class OperationDocsStore {
  static getAll() {
    return `query MyQuery {
      todo {
        user_id
        title
        id
      }
    }
    `;
  }

  static addOne(title) {
    return `mutation MyMutation {
      insert_todo_one(object: {title: "${title}"}) {
        user_id
        title
        id
      }
    }`;
  }

  static deleteByName(id) {
    return `mutation MyMutation {
      delete_todo_by_pk(id: "${id}") {
        id
        title
        user_id
      }
    }
    `;
  }

  static subscribeToAll() {
    return gql`
      subscription MySubscription {
        todo {
          user_id
          title
          id
        }
      }
    `;
  }
}
