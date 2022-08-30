import Head from 'next/head'
import type { AppProps } from 'next/app'
import { MoralisProvider } from 'react-moralis'
// import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
// import NetworkBanner from "../components/NetworkBanner"
import { NotificationProvider } from 'web3uikit'
import Header from '../components/Header'
import ManualHeader from '../components/ManualHeader'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

console.log({
	APP_ID,
	SERVER_URL,
})

function MyApp({ Component, pageProps }: AppProps) {
	console.log(`
	____   ___  _     _       _____ _   _ _____   ____ ___ ____ _____
	|  _ \ / _ \| |   | |     |_   _| | | | ____| |  _ \_ _/ ___| ____|
	| |_) | | | | |   | |       | | | |_| |  _|   | | | | | |   |  _|
	|  _ <| |_| | |___| |___    | | |  _  | |___  | |_| | | |___| |___
	|_| \_\\___/|_____|_____|   |_| |_| |_|_____| |____/___\____|_____|
	
	`)
	return (
		<>
			<Head>
				<title>NFT Marketplace</title>
				<link rel='shortcut icon' href='/favicon.ico' />
			</Head>
			<MoralisProvider
				appId={"QHiYK3fMQ0LoDYHbXdJjSguf9DSoMsf7g6TA0FcW"}
				serverUrl={"https://clnfhnfefhc5.usemoralis.com:2053/server"}
			>
				<NotificationProvider>
					{/* <NetworkBanner /> */}
					{/* <Header /> */}
					<ManualHeader />
					<Header />
					<Component {...pageProps} />
				</NotificationProvider>
			</MoralisProvider>
		</>
	)
}
export default MyApp
