/* eslint-disable @next/next/no-img-element */
import { Typography } from '@web3uikit/core'
import Image from 'next/image'
import React from 'react'

export default function About() {
	return (
		<div className='about-container'>
			<div>
				<img
					src='https://i.pinimg.com/originals/68/7c/ea/687cea8aabd579611223b9f6332f1cbb.gif'
					width='100%'
					alt=''
				/>
			</div>
			<div>
				<Typography>This Nft Market place allows you to</Typography>
				<ul>
					<li>List your NFTs</li>
					<li>Browse NFTs</li>
					<li>Buy NFTs from the marketplace</li>
					<li>Update your NFTs price</li>
				</ul>

				<Typography>Technologies used</Typography>
				<ul>
					<li>Solidity</li>
					<li>Hardhat</li>
					<li>Ethers</li>
					<li>Openzeppelin</li>
					<li>Moralis</li>
					<li>Graphql</li>
					<li>@graphprotocol</li>
				</ul>

				<Typography>The contract</Typography>
				<ul>
					<li>
						<a
							target={'_blank'}
							rel='noreferrer'
							href='https://rinkeby.etherscan.io/address/0x99701f665b1CcE2F4b88ba7275606BFa71b28008#code'
						>
							View it on Etherscan
						</a>
					</li>
				</ul>
				<Typography>Source code on Github</Typography>
				<ul>
					<li>
						<a
							target={'_blank'}
							rel='noreferrer'
							href='https://github.com/buikhacnam/nft-marketplace-backend'
						>
							Backend Repository
						</a>
					</li>
					<li>
						<a
							target={'_blank'}
							rel='noreferrer'
							href='https://github.com/buikhacnam/Subgraph-bui-nft-marketplace'
						>
							Supgraph Studio Repository
						</a>
					</li>
					<li>
						<a
							target={'_blank'}
							rel='noreferrer'
							href='https://github.com/buikhacnam/nft-subgraph-nextjs'
						>
							Frontend Repository
						</a>
					</li>
				</ul>
			</div>
		</div>
	)
}
