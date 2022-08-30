import type { NextPage } from 'next'
// import { useState } from "react"
import NFTBox from '../components/NFTBox'
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries'
import { useQuery } from '@apollo/client'
import networkConfig from '../constants/networkMapping.json'
import { useMoralis } from 'react-moralis'
import { Typography } from '@web3uikit/core'

// const PAGE_SIZE = 9

interface nftInterface {
	price: number
	nftAddress: string
	tokenId: string
	address: string
	seller: string
}

interface contractAddressesInterface {
	[key: string]: contractAddressesItemInterface
}

interface contractAddressesItemInterface {
	[key: string]: string[]
}

const Home: NextPage = () => {
	const { chainId } = useMoralis()
	const { isWeb3Enabled } = useMoralis()

	const addresses: contractAddressesInterface = networkConfig
	const marketplaceAddress = chainId
		? addresses[parseInt(chainId!).toString()]['NftMarketplace'][0]
		: null

	const { loading, error: subgraphQueryError, data: listedNfts } = useQuery(
		GET_ACTIVE_ITEMS
	)

	console.log('listedNfts', listedNfts)

	if (!isWeb3Enabled) {
		return <div>
			<Typography>Please enable web3</Typography>
		</div>
	}

	return (
		<div style={{padding: 24}}>
            <div style={{paddingBottom: 20}}>
			<Typography variant='h2'>
				Recent Listed NFT
			</Typography>
            </div>
			<div style={{display: 'flex', gap: 20}}>
				{loading || !listedNfts ? (
					<div>Loading...</div>
				) : (
					listedNfts.activeItems.map((
						nft: nftInterface /*, index*/
					) => {
						const { price, nftAddress, tokenId, seller } = nft
						// console.log(marketplaceAddress)
						return (
							<NFTBox
								price={price}
								nftAddress={nftAddress}
								tokenId={tokenId}
								marketplaceAddress={marketplaceAddress!}
								seller={seller}
								key={`${nftAddress}${tokenId}`}
							/>
						)
					})
				)}
			</div>
		</div>
	)
}
export default Home
