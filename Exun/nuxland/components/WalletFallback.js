import React from 'react'
import ConnectWalletButton from './ConnectWalletButton'

export default function WalletFallback() {
    return (
        <div className='walletFallback'>
            <p>Please connect your wallet to continue!</p>
            <ConnectWalletButton />
        </div>
    )
}
