

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Web3AuthModalPack, web3AuthConfig } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { ethers } from 'ethers';

import CommunityVettedActionsABI from '/CommunityVettedActionsABI.json';

// const CONTRACT_ADDRESS = "0xf5FC59c77d5470D18DC02208d18E29C923BA228a";
const CONTRACT_ADDRESS = "0x89aC91829c9FCe66198D685172b98EBBEb3F467c";


export default function Profile() {
    const [walletAddress, setWalletAddress] = useState('');
    const [copied, setCopied] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);  // New loading state


    const [signerr, setSigner] = useState();
    const [userRewards, setUserRewards] = useState(0);
    const [contractInstance, setContractInstance] = useState(null);



    const signInWithWeb3 = async () => {
        setIsSigningIn(true);  // Start the sign-in process

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
        console.log('Authenticated user address:', authKitSignData.eoa, authKitSignData.safes);
        setWalletAddress(authKitSignData.eoa)
        setIsAuthenticated(true)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CommunityVettedActionsABI, signer);
        setContractInstance(contract);


        const rewards = await contract.checkRewards(walletAddress);
        setUserRewards(ethers.utils.formatUnits(rewards, 'wei')); // Assuming the rewards are in wei. Adjust if not.

        setIsSigningIn(false);  // End the sign-in process once completed or if there's an error

    }

    const claimUserRewards = async () => {
        try {
            console.log("started climing")
            // const tx = await contract.claimRewards();
            const tx = await contractInstance.claimRewards();

            await tx.wait();
            const updatedRewards = await contract.checkRewards(walletAddress);
            setUserRewards(ethers.utils.formatUnits(updatedRewards, 'wei'));
            alert('Rewards claimed successfully!');
        } catch (error) {
            console.error('Error claiming rewards:', error);
        }
    };


    const copyWalletAddress = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Hide tooltip after 2 seconds
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const truncatedWalletAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

    return (
        <div>
            <Header />
            <main className="container mx-auto p-4">
                {isAuthenticated ? (
                    <>
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                            <div className="flex items-center space-x-4">
                                <img src="/tree.jpeg" alt="Profile" className="w-20 h-20 rounded-full border-2 border-green-500" />
                                <div>
                                    <p className="text-lg font-medium">Username</p>
                                    <p className="text-gray-600">{userRewards} EcoTokens</p>
                                    <div className="mt-2 flex items-center space-x-2 relative">
                                        <p className="text-sm text-gray-600 truncate">{truncatedWalletAddress}</p>
                                        <button onClick={copyWalletAddress} className="text-green-500 hover:text-green-600">
                                            Copy
                                        </button>


                                        {copied && (
                                            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-1 bg-green-500 text-white text-xs rounded">
                                                Copied!
                                            </span>
                                        )}

                                        <button
                                            onClick={claimUserRewards}
                                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                                            disabled={userRewards <= 0} // Disable the button if no rewards available
                                        >
                                            Claim Rewards
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">My Actions</h2>
                            <ul>
                                <li className="border p-4 rounded-lg mb-2">
                                    <h3 className="text-lg font-medium">Planted a Tree</h3>
                                    <p className="text-gray-600">Earned: 50 EcoTokens</p>
                                </li>
                                {/* Add more actions similarly */}
                            </ul>
                        </section>
                    </>
                ) : (
                    <div>
                        <p className="text-lg text-center mt-6">Please login to view your account.</p>

                        <button
                            onClick={signInWithWeb3}
                            className="bg-green-500 text-white py-2 px-4 w-full rounded-lg hover:bg-green-600 transition duration-300 mb-4"
                            disabled={isSigningIn}  // Disable the button while signing in
                        >
                            {isSigningIn ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
