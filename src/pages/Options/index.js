import ReactDOM from 'react-dom';
import {
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import Container from './components/Container';
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // 开发环境从根目录 .env.development.local 读取
  // const token = process.env.REACT_APP_TOKEN || '';
  // const token = localStorage.getItem('AUTH_TOKEN');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // 'x-hasura-admin-secret': 'y0JhNpKpRXdzSMc47jYUElHxn6jzVflV7tF7SqkexFGwGPH4qooyuB04MZyDFU3Q'
      'x-hasura-admin-secret': 'tristan@privoce'
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: 'https://g.nicegoodthings.com/v1/graphql' })),
  // link: authLink.concat(new HttpLink({ uri: 'https://vera.hasura.app/v1/graphql' })),
  cache: new InMemoryCache()
});
ReactDOM.render(<ApolloProvider client={client}>
  <Container />
</ApolloProvider>, document.getElementById('main'));
