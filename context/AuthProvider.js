// context/AuthProvider.js
import React, { useState } from 'react';
import AuthContext from './authContext';
import { Web3AuthModalPack, web3AuthConfig } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { ethers } from 'ethers';

export const AuthProvider = ({ children }) => {
  const [signerr, setSigner] = useState();

  // ... your signInWithWeb3 function here ...
  const signInWithWeb3 = async () => {

    const options = {
        clientId: 'BFKQSriLkbNejcabUGdGsAyeREy9uMGdDqhMnz5iUPjVhHxpfyRdXfGc-h2icgqFDWf163ovYBQBPCOQrNhPKYs',
        web3AuthNetwork: 'testnet',
        chainConfig: {
            chainNamespace: "eip155",
            chainId: '0x5',
            rpcTarget: 'https://rpc.ankr.com/eth_goerli'
        },
        uiConfig: {
            theme: 'dark',
            loginMethodsOrder: ['google', 'facebook']
        }
    }

    const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
            label: 'torus',
            showOnModal: false
        },
        [WALLET_ADAPTERS.METAMASK]: {
            label: 'metamask',
            showOnDesktop: true,
            showOnMobile: false
        }
    }

    const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
            mfaLevel: 'mandatory'
        },
        adapterSettings: {
            uxMode: 'popup',
            whiteLabel: {
                name: 'Safe'
            }
        }
    })

    const web3AuthConfig = {
        txServiceUrl: 'https://safe-transaction-goerli.safe.global'
    }
    const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
    await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig });

    const authKitSignData = await web3AuthModalPack.signIn();

    const provider = await new ethers.providers.Web3Provider(web3AuthModalPack.getProvider())
    const signer = await provider.getSigner()
    await setSigner(signer)
    console.log(signerr)
    console.log('Authenticated user address:', authKitSignData);
}

  const isAuthenticated = !!signerr; 

  return (
    <AuthContext.Provider value={{ signerr, signInWithWeb3, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
