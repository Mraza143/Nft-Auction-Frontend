import '../styles/globals.css'
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { MoralisProvider } from 'react-moralis'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Header from '../components/Header'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {

  return(
    <div>
      <Head>
                <title>NFT Auction Place</title>
                <meta name="description" content="NFT Auction" />
                <link rel="icon" href="/favicon.ico" />
       </Head>

            <MoralisProvider initializeOnMount={false}>
            <ApolloProvider client={client}>
            <NotificationProvider>
            <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>

   </div>
  )
}

export default MyApp

//To do Hopefully

//1)Create Auction Page
//2)Home Page (All active Auctions)
//3)Specific Auction Page(Where all the previous bids are being shown, and current winner ,and time remaining)
