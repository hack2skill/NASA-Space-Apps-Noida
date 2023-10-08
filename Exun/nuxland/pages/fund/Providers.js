'use client';

import * as React from 'react';

import { getDefaultWallets, RainbowKitProvider, } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';


export function Providers({ children, env }) {


    const { chains, publicClient } = configureChains(
        [polygonMumbai],
        [
            infuraProvider({ apiKey: env.INFURA_API_KEY }),
            publicProvider()
        ]
    );
    const { connectors } = getDefaultWallets({
        appName: 'NuxLand',
        projectId: '2766319f331ea275c49892f171146c73',
        chains
    });

    const wagmiConfig = createConfig({
        autoConnect: false,
        connectors,
        publicClient
    })



    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        return null;
    }



    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

