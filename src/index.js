import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  HttpLink
} from "@apollo/client";
import store from "./redux/store";
import { Provider } from "react-redux";
require('dotenv').config()

const client = new ApolloClient({
  uri: process.env.REACT_APP_HASURA_URL,
  headers: {
    'Hasura-Client-Name': 'hasura-console',
    'x-hasura-admin-secret': process.env.REACT_APP_ADMIN_SECRET,
    'content-type': 'application/json'
  },
  cache: new InMemoryCache()
});

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  rootElement
);
