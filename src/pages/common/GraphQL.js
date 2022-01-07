import React from 'react'
import {
    HttpLink,
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // 开发环境从根目录 .env.development.local 读取
    // const token = process.env.REACT_APP_TOKEN || '';
    // const token = localStorage.getItem('AUTH_TOKEN');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            // 'x-hasura-admin-secret': 'xxxxxxxxxxxx'
            'x-hasura-admin-secret': 'xxxxxxx'
        }
    };
});
const client = new ApolloClient({
    // 线上地址
    link: authLink.concat(new HttpLink({ uri: 'https://g.nicegoodthings.com/v1/graphql' })),
    // 测试地址，走的是hasura自家的一个托管空间，最近没怎么用了，有需要的时候再手动切换过来
    // link: authLink.concat(new HttpLink({ uri: 'https://vera.hasura.app/v1/graphql' })),
    cache: new InMemoryCache()
});
export default function GraphQL({ children }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}
// note: 这里有些不规范，一些关键信息，没有走环境变量，待优化。
