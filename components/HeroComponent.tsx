import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { Button, Hero, Typography } from '@web3uikit/core'
import { Dapps, Off, Star, Cart, Home, Rocket, Image, Metamask } from '@web3uikit/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface HeroProps {}

const HeroComponent: React.FC<HeroProps> = ({}) => {
	const router = useRouter()
	const {
		enableWeb3, // the function asks for permissions and connects to Metamask
		account, // account address of connected wallet
		isWeb3Enabled, // boolean whether web3 is enabled or not
		Moralis, // have some nice methods (ex: onAccountChanged)
		deactivateWeb3, // the function deactive Web3
		isWeb3EnableLoading, // boolean when connect is in progress
	} = useMoralis()

	// keep Moralis connected to Web3 when MetaMask is connected to the site.
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			!isWeb3Enabled &&
			window.localStorage.getItem('connected')
		) {
			enableWeb3()
		}
	}, [isWeb3Enabled])

	// purpose of this is to deactiveWeb3 and remove localstorage
	// when disconnect all accounts from meta mask
	useEffect(() => {
		Moralis.onAccountChanged(account => {
			console.log(`Account changed to ${account}`)

			// when switch to account nothing (disconnect)
			if (account == null) {
				window.localStorage.removeItem('connected')
				deactivateWeb3()
				console.log('Null account found')
			}
		})
	}, [])
	return (
		<Hero
			align='right'
			backgroundColor='#57A5FF'
			customImage={{
				url:
					'https://hardhat.org/_next/static/media/FlexibilityImage.05d03cc2.svg',
			}}
			height='190px'
			padding='20px 40px'
			rounded='20px'
			textColor='#fff'
			title={''}
		>
			<React.Fragment key='.0'>
				<Typography variant='h1'>
					<Link href='/'> CaseyBui NFT Marketplace</Link>
				</Typography>
				<div style={{ marginTop: 10 }}>
					{account && window.localStorage.getItem('connected') ? (
						<div style={{ display: 'flex', gap: 10 }}>
							<Typography variant='h4'>
								Connected to {account.slice(0, 6)}...
								{account.slice(account.length - 4)}
							</Typography>{' '}
							<Button
								onClick={async () => {
									await deactivateWeb3()
									localStorage.removeItem('connected')
								}}
								icon={<Off fontSize={24} />}
								text='Deactivate Web3'
								theme='text'
								size='small'
							/>
						</div>
					) : (
						<Button
							onClick={async () => {
								await enableWeb3()
								localStorage.setItem('connected', 'injected')
							}}
							icon={<Metamask fontSize={24} />}
							text='Connect to Web3'
							theme='translucent'
						/>
					)}
				</div>

				<div className='nav-wrapper'>
					<Button
						icon={<Dapps fontSize={24} />}
						text='Home'
						theme='link'
						onClick={() => {
							router.push('/')
						}}
						iconColor={router.pathname === '/' ? 'rgb(236, 166, 9)' : 'rgb(46, 125, 175)'}
					/>
					<Button
						icon={<Cart fontSize={24} />}
						text='Sell NFT' 
						theme='link'
						onClick={() => {
							router.push('/sell-nft')
						}}
						iconColor={router.pathname === '/sell-nft' ? 'rgb(236, 166, 9)' : 'rgb(46, 125, 175)'}
					/>
					<Button
						icon={<Image fontSize={24} />}
						text='Your NFT'
						theme='link'
						onClick={() => {
							router.push('/sell-nft')
						}}
					/>
					<Button
						icon={<Rocket fontSize={24} />}
						text='About'
						theme='link'
						onClick={() => {
							router.push('/sell-nft')
						}}
					/>
				</div>
				{isWeb3EnableLoading && <div>connecting...</div>}
			</React.Fragment>
		</Hero>
	)
}
export default HeroComponent
