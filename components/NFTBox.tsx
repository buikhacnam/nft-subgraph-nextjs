import type { NextPage } from 'next'
import {
	Card,
	Tooltip,
	Illustration,
	useNotification,
	Tag,
	Typography,
} from '@web3uikit/core'
import nftAbi from '../constants/BasicNft.json'
import nftMarketplaceAbi from '../constants/NftMarketplace.json'

import {
	// useMoralisWeb3Api,
	useMoralis,
	useWeb3Contract,
} from 'react-moralis'
import Image from 'next/image'
import { useState, useEffect } from 'react'
const { ethers } = require('ethers')
import { UpdateListingModal } from './UpdateListingModal'

interface NFTBoxProps {
	price?: number
	nftAddress: string
	tokenId: string
	marketplaceAddress: string
	seller?: string
}

const truncateStr = (fullStr: string, strLen: number) => {
	if (fullStr.length <= strLen) return fullStr

	const separator = '...'

	var sepLen = separator.length,
		charsToShow = strLen - sepLen,
		frontChars = Math.ceil(charsToShow / 2),
		backChars = Math.floor(charsToShow / 2)

	return (
		fullStr.substr(0, frontChars) +
		separator +
		fullStr.substr(fullStr.length - backChars)
	)
}

const NFTBox: NextPage<NFTBoxProps> = ({
	price,
	nftAddress,
	tokenId,
	marketplaceAddress,
	seller,
}: NFTBoxProps) => {
	const { isWeb3Enabled, account } = useMoralis()
	const [imageURI, setImageURI] = useState<string | undefined>()
	const [tokenName, setTokenName] = useState<string | undefined>()
	const [tokenDescription, setTokenDescription] = useState<
		string | undefined
	>()

	console.log({
		imageURI,
		account,
	})

	const dispatch = useNotification()

	const { runContractFunction: getTokenURI } = useWeb3Contract({
		abi: nftAbi,
		contractAddress: nftAddress,
		functionName: 'tokenURI',
		params: {
			tokenId: Number(tokenId),
		},
	})

	const { runContractFunction: buyItem } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: 'buyItem',
		msgValue: price,
		params: {
			nftAddress: nftAddress,
			tokenId: tokenId,
		},
	})

	async function updateUI() {
		let tokenURI = await getTokenURI()
		// let tokenURI = 'ipfs://bafyreidfkvzj77irx57xc4bmmhbbhak7totciyho2xl6cwiwupoqemv3yq/metadata.json'
		console.log(`TokenURI is: ${tokenURI}`)
		if (tokenURI) {
			const requestURL = (tokenURI as string).replace(
				'ipfs://',
				'https://ipfs.io/ipfs/'
			)
			const tokenURIResponse = await (await fetch(requestURL)).json()
			const imageURI = tokenURIResponse.image
			const imageURIURL = (imageURI as string).replace(
				'ipfs://',
				''
			).replace('/', '.ipfs.nftstorage.link/')
			setImageURI('https://' + imageURIURL)
			setTokenName(tokenURIResponse.name)
			setTokenDescription(tokenURIResponse.description)
		}
	}

	useEffect(() => {
		updateUI()
	}, [isWeb3Enabled])

	const isOwnedByUser = seller === account || seller === undefined
	const formattedSellerAddress = isOwnedByUser
		? 'you'
		: truncateStr(seller || '', 15)

	const handleCardClick = () =>
		isOwnedByUser
			? setShowModal(true)
			: // setShowModal(true)
			  buyItem({
					onSuccess: () => handleBuyItemSuccess(),
					onError: e => console.log(e),
			  })

	const handleBuyItemSuccess = () => {
		dispatch({
			type: 'success',
			message: 'Item bought successfully',
			title: 'Item Bought',
			position: 'topR',
		})
	}

	// State to handle display of 'create listing' or 'update listing' modal
	const [showModal, setShowModal] = useState(false)
	const hideModal = () => setShowModal(false)
	const isListed = seller !== undefined

	const tooltipContent = isListed
		? isOwnedByUser
			? 'Update listing'
			: 'Buy me'
		: 'Create listing'

	return (
		<div>
			<UpdateListingModal
				isVisible={showModal && isListed}
				imageURI={imageURI}
				nftMarketplaceAbi={nftMarketplaceAbi}
				nftAddress={nftAddress}
				tokenId={tokenId}
				onClose={hideModal}
				marketplaceAddress={marketplaceAddress}
				currentPrice={price}
			/>
			<Card
				title={tokenName}
				description={tokenDescription}
				onClick={handleCardClick}
			>
				<Tooltip
					content={tooltipContent}
					// content=''
					position='top'
				>
					<div>
						{imageURI ? (
							<div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									{price && (
										<Tag
											color='green'
											text={
												ethers.utils.formatUnits(
													price,
													'ether'
												) + ' ETH'
											}
										/>
									)}
									<Tag
										color='blue'
										onCancelClick={function noRefCheck() {}}
										text={'# ' + tokenId}
									/>
								</div>
								<Typography style={{ marginTop: 5 }}>
									Owned by {formattedSellerAddress}
								</Typography>
								<div style={{display: 'flex', justifyContent: 'center', padding: '5px 0'}}>
									<Image
										loader={() => imageURI}
										src={imageURI}
										height='200'
										width='200'
									/>
								</div>
							</div>
						) : (
							<div>
								<Illustration
									height='200px'
									logo='marketplace'
									width='100%'
								/>
								Loading...
							</div>
						)}
					</div>
				</Tooltip>
			</Card>
		</div>
	)
}

export default NFTBox
