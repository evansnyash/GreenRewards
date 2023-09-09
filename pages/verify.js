

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import { ethers } from 'ethers';
import CommunityVettedActionsABI from '/CommunityVettedActionsABI.json';


export default function Verify() {
    const { signerr, isAuthenticated, signInWithWeb3 } = useContext(AuthContext);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        async function fetchActions() {
            console.log("start")
            //   if (!signerr) return;
            if (!isAuthenticated) {
                alert("Please sign in first!");
                signInWithWeb3();
                return;
            }

            const contractAddress = '0x89aC91829c9FCe66198D685172b98EBBEb3F467c';
            console.log("start talking to contract")
            const contract = new ethers.Contract(contractAddress, CommunityVettedActionsABI, signerr);

            const count = await contract.actionCount();

            console.log("fetched actions")
            let fetchedActions = [];

            for (let i = 1; i <= count; i++) {
                const action = await contract.actions(i);
                fetchedActions.push({
                    id: i,
                    ...action
                });
            }


            setActions(fetchedActions);
        }

        fetchActions();
    }, [signerr]);

    function truncateAddress(address, chars = 4) {
        if (!address) return '';
        const parsed = ethers.utils.getAddress(address);
        return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
    }

    async function handleVote(actionId, approve) {
        if (!signerr || !isAuthenticated) {
            alert("Please sign in first!");
            signInWithWeb3();
            return;
        }

        const contractAddress = '0x89aC91829c9FCe66198D685172b98EBBEb3F467c';
        const contract = new ethers.Contract(contractAddress, CommunityVettedActionsABI, signerr);

        try {
            const tx = await contract.vote(actionId, approve);
            await tx.wait();

            if (approve) {
                alert("Action approved successfully!");
            } else {
                alert("Action rejected successfully!");
            }

        } catch (error) {
            console.error("Error while voting:", error);
        }
    }



    return (
        <div>
            <Header />
            <main className="container mx-auto p-4">
                <h2 className="text-xl font-semibold mb-4">Community Verification</h2>
                {/* <ul>
                    {actions.map((action, index) => (
                        <li key={index} className="border p-4 rounded-lg mb-2">
                            <img src={action.fileUrl} alt="Evidence" className="w-full h-32 object-cover rounded-t-lg mb-2" />
                            <p className="text-gray-600 mb-2">Action: {action.actionDescription} by {truncateAddress(action.submitter)}</p>
                            <div className="flex justify-between">
                                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded">
                                    Approve
                                </button>
                                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul> */}

                <ul>
                    {actions.map((action, index) => (
                        <li key={index} className="border p-4 rounded-lg mb-2">
                            <img src={action.fileUrl} alt="Evidence" className="w-full h-32 object-cover rounded-t-lg mb-2" />
                            <p className="text-gray-600 mb-2">Action: {action.actionDescription} by {truncateAddress(action.submitter)}</p>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleVote(action.id, true)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded">
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleVote(action.id, false)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
}
