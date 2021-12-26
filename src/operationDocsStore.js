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

  static deleteByName(name) {
    return `mutation MyMutation {
      delete_todo(where: {title: {_eq: "${name}"}}) {
        affected_rows
      }
    }`;
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
