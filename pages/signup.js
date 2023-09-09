// pages/signup.js

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import React from 'react';
import { Web3AuthModalPack, web3AuthConfig } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { useState } from 'react';
import { ethers } from 'ethers';
import CommunityVettedActionsABI from '/CommunityVettedActionsABI.json';

const CONTRACT_ADDRESS = "0x89aC91829c9FCe66198D685172b98EBBEb3F467c";

export default function Signup() {


    const [signerr, setSigner] = useState();
    const [userRewards, setUserRewards] = useState(0);

    const signInWithWeb3 = async () => {

        const options = {
            clientId: 'BGTobsQ4UkXJ1pjtdOQHiwUDy0vzYWyD2w5eKmhNkdMaGAvFPUrf5QG651extTJdxWYh9d2D0SMLP59c4UUkBMo',
            web3AuthNetwork: 'mainnet',
            chainConfig: {
                chainNamespace: "eip155",
                chainId: '0x64',
                rpcTarget: 'https://rpc.gnosis.gateway.fm/'
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
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const rewards = await contract.checkRewards(authKitSignData.eoa);
        setUserRewards(ethers.utils.formatUnits(rewards, 'wei')); // Assuming the rewards are in wei. Adjust if not.

    }

    const claimUserRewards = async () => {
        try {
            const tx = await contract.claimRewards();
            await tx.wait();
            const updatedRewards = await contract.checkRewards(authKitSignData.eoa);
            setUserRewards(ethers.utils.formatUnits(updatedRewards, 'wei'));
            alert('Rewards claimed successfully!');
        } catch (error) {
            console.error('Error claiming rewards:', error);
        }
    };
    

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />

            <main className="container mx-auto p-4 max-w-md">
                <section className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Join EcoReward</h2>
                    <p className="text-gray-600 mb-6">Sign Up to start offsetting carbon footprints and earn rewards.</p>

                    <button
                        onClick={signInWithWeb3}
                        className="bg-green-500 text-white py-2 px-4 w-full rounded-lg hover:bg-green-600 transition duration-300 mb-4"
                    >
                        Sign Up
                    </button>

                    <div className="text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" required />
                            I agree to the <Link href="/terms"><span className="text-green-500 hover:underline">Terms and Conditions</span></Link>.
                        </label>
                    </div>
                </section>

                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Already have an account?
                        <Link href="/login">
                            <span className="text-green-500 hover:underline ml-2">Login</span>
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
