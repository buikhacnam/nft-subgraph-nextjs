import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
export default function ManualHeader() {
	const {
		enableWeb3, // the function asks for permissions and connects to Metamask
		account, // account address of connected wallet
		isWeb3Enabled, // boolean whether web3 is enabled or not
		Moralis, // have some nice methods (ex: onAccountChanged)
		deactivateWeb3, // the function deactive Web3
		isWeb3EnableLoading, // boolean when connect is in progress
	} = useMoralis()

	console.log("ACCOUNT STATUS",{
		enableWeb3,
		account,
		isWeb3Enabled, //boolean
		Moralis,
		deactivateWeb3,
		isWeb3EnableLoading,
	})

	// console.log('typeof window', typeof window)

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
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)

            // when switch to account nothing (disconnect)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

	return (
		<div>
			{account && window.localStorage.getItem('connected') ? (
				<div>
					Connected to {account.slice(0, 6)}...
					{account.slice(account.length - 4)}
				</div>
			) : (
				<button
					onClick={async () => {
						await enableWeb3()
						localStorage.setItem('connected', 'injected')
					}}
					disabled={isWeb3EnableLoading}
				>
					Connect
				</button>
			)}
            {isWeb3EnableLoading && <div>connecting...</div>}
			{/* {typeof window !== 'undefined' && window.localStorage.getItem('connected') && ( */}
            <button
                onClick={async () => {
                    await deactivateWeb3()
                    localStorage.removeItem('connected')
                }}
				disabled={(typeof window !== 'undefined' && window.localStorage.getItem('connected')) ? false : true}
            >
                Deactive Web3
            </button>
			{/* )} */}
		</div>
	)
}
