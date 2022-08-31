import { Form, useNotification, Button } from '@web3uikit/core'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers, BigNumber } from 'ethers'
import nftAbi from '../constants/BasicNft.json'
import nftMarketplaceAbi from '../constants/NftMarketplace.json'
import networkMapping from '../constants/networkMapping.json'
import { useEffect, useState } from 'react'
type NetworkConfigItem = {
	NftMarketplace: string[]
}

type NetworkConfigMap = {
	[chainId: string]: NetworkConfigItem
}

export default function Home() {
	const { chainId, account, isWeb3Enabled } = useMoralis()
	const chainString = chainId ? parseInt(chainId).toString() : '31337'
	const marketplaceAddress = (networkMapping as NetworkConfigMap)[chainString]
		.NftMarketplace[0]
	const dispatch = useNotification()
	const [proceeds, setProceeds] = useState('0')

	// @ts-ignore
	const { runContractFunction } = useWeb3Contract()

	async function approveAndList(data: any) {
		console.log('Approving...')
		const nftAddress = data.data[0].inputResult
		const tokenId = data.data[1].inputResult
		const price = ethers.utils
			.parseUnits(data.data[2].inputResult, 'ether')
			.toString()

		const approveOptions = {
			abi: nftAbi,
			contractAddress: nftAddress,
			functionName: 'approve',
			params: {
				to: marketplaceAddress,
				tokenId: tokenId,
			},
		}

		await runContractFunction({
			params: approveOptions,
			onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
			onError: error => {
				console.log(error)
			},
		})
	}

	async function handleApproveSuccess(
		nftAddress: string,
		tokenId: string,
		price: string
	) {
		const listOptions = {
			abi: nftMarketplaceAbi,
			contractAddress: marketplaceAddress,
			functionName: 'listItem',
			params: {
				nftAddress: nftAddress,
				tokenId: tokenId,
				price: price,
			},
		}

		await runContractFunction({
			params: listOptions,
			onSuccess: handleListSuccess,
			onError: error => console.log(error),
		})
	}

	async function handleListSuccess(tx: any) {
		await tx.wait(1)
		dispatch({
			type: 'success',
			message: 'NFT listing',
			title: 'NFT listed',
			position: 'topR',
		})
	}

	const handleWithdrawSuccess = async (tx: any) => {
		await tx.wait(1)
		dispatch({
			type: 'success',
			message: 'Withdrawing proceeds',
			position: 'topR',
		})
	}

	async function setupUI() {
		const returnedProceeds = (await runContractFunction({
			params: {
				abi: nftMarketplaceAbi,
				contractAddress: marketplaceAddress,
				functionName: 'getProceeds',
				params: {
					seller: account,
				},
			},
			onError: error => console.log(error),
		})) as BigNumber
		if (returnedProceeds) {
			setProceeds(returnedProceeds.toString())
		}
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			setupUI()
		}
	}, [proceeds, account, isWeb3Enabled, chainId])

	return (
		<div>
			<Form
				onSubmit={approveAndList}
				data={[
					{
						name: 'NFT Address',
						type: 'text',
						inputWidth: '50%',
						value: '',
						key: 'nftAddress',
					},
					{
						name: 'Token ID',
						type: 'number',
						value: '',
						key: 'tokenId',
					},
					{
						name: 'Price (in ETH)',
						type: 'number',
						value: '',
						key: 'price',
					},
				]}
				title='Sell your NFT!'
				id='Main Form'
			/>
			<div>Withdraw {
				ethers.utils.formatUnits(proceeds, 'ether')
			} Eth</div>
			{proceeds != '0' ? (
				<Button
					onClick={() => {
						runContractFunction({
							params: {
								abi: nftMarketplaceAbi,
								contractAddress: marketplaceAddress,
								functionName: 'withdrawProceeds',
								params: {},
							},
							onError: error => console.log(error),
							onSuccess: handleWithdrawSuccess,
						})
					}}
					text='Withdraw'
					type='button'
				/>
			) : (
				<div>No proceeds detected</div>
			)}
		</div>
	)
}
