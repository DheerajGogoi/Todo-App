import { gql } from "@apollo/client";

export const FETCH_ALL_TODO = gql`
    query fetch_all_todo {
        todos {
            created_at
            id
            is_completed
            task
            user_email
        }
    }
`

export const FETCH_TODO_BY_EMAIL = gql`
    query fetch_todo_by_email($email: String!) {
        todos(where: {user_email: {_eq: $email}}, order_by: {created_at: desc}) {
            is_completed
            task
            user_email
            id
            created_at
        }
    }  
`

export const FIND_TASK_BY_ID = gql`
    query find_task_by_id($id: uuid!) {
        todos(where: {id: {_eq: $id}}) {
            created_at
            id
            is_completed
            task
            user_email
        }
    }
`

export const ADD_TODO = gql`
    mutation insert_todo($task: String!, $user_email: String!) {
        insert_todos(objects: {task: $task, user_email: $user_email}) {
            returning {
                created_at
                id
                is_completed
                task
                user_email
            }
        }
    }
`

export const DELTE_TODO_BY_ID = gql`
    mutation delete_todo_by_id($id: uuid!) {
        delete_todos(where: {id: {_eq: $id}}) {
            affected_rows
            returning {
                created_at
                id
                is_completed
                task
                user_email
            }
        }
    }
  
`

export const UPDATE_TODO_STATUS = gql`
    mutation update_todo_status($id: uuid!, $status: Boolean!) {
        update_todos(where: {id: {_eq: $id}}, _set: {is_completed: $status}) {
            returning {
                created_at
                id
                is_completed
                task
                user_email
            }
        }
    }
`

export const UPDATE_TASK_TITLE = gql`
    mutation update_task_title($id: uuid!, $task: String!) {
        update_todos(where: {id: {_eq: $id}}, _set: {task: $task}) {
            returning {
                created_at
                id
                is_completed
                task
                user_email
            }
        }
    }
`