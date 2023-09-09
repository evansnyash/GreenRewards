// pages/submit.jsimport Header from '../components/Header';
import Footer from '../components/Footer';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import { ethers } from 'ethers';
import CommunityVettedActionsABI from '/CommunityVettedActionsABI.json';
import Header from '@/components/Header';
import { Web3Storage } from 'web3.storage'; // Import Web3Storage



const CONTRACT_ADDRESS = "0x89aC91829c9FCe66198D685172b98EBBEb3F467c"; // Replace with your contract address

export default function Submit() {
    const { signerr, isAuthenticated, signInWithWeb3 } = useContext(AuthContext);

    // Function to upload to IPFS via Web3Storage
    const uploadToIPFS = async (files) => {
        const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3OTQwMzdiMjk3RTM2YURCMmM4YzI1NWUyM0I1NTNDY0RBM0M4ZDYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTM1NDU2Njk4ODIsIm5hbWUiOiJlY29yZXdhcmQifQ.EfXmloNC90BikBn-MhAeu37lvEVBM8TKi8Wyz4zOb0M" }); // Replace with your actual API token
        const rootCid = await client.put(files, {
            name: 'evidence',
            maxRetries: 3,
        });
        return rootCid;
    };

    const submitAction = async () => {
        console.log("starting...")
        if (!isAuthenticated) {
            alert("Please sign in first!");
            signInWithWeb3();
            return;
        }

        console.log("auth check 100%")
        // Create contract instance
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CommunityVettedActionsABI, signerr);
        const fileInput = document.getElementById("evidence");

        // Upload to IPFS and get the root CID
        const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3OTQwMzdiMjk3RTM2YURCMmM4YzI1NWUyM0I1NTNDY0RBM0M4ZDYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTM1NDU2Njk4ODIsIm5hbWUiOiJlY29yZXdhcmQifQ.EfXmloNC90BikBn-MhAeu37lvEVBM8TKi8Wyz4zOb0M" }); // Replace with your actual API token
        const rootCid = await client.put(fileInput.files, {
            name: 'evidence',
            maxRetries: 3,
        });

        // Retrieve the filename from IPFS
        const res = await client.get(rootCid);
        const files = await res.files();
        const fileName = files[0].name;

        // Get the file from the input and upload to IPFS
        // const fileInput = document.getElementById("evidence");
        //  const rootCid = await uploadToIPFS(fileInput.files);
        console.log(rootCid)
        const evidenceUrl = `https://ipfs.io/ipfs/${rootCid}/${fileName}`;

        //  const evidenceUrl = `https://ipfs.io/ipfs/${rootCid}`; // This is the IPFS URL to the uploaded evidence
        const actionDescription = document.getElementById("action-type").value;
        // const evidenceUrl = "https://media.istockphoto.com/id/1283852667/photo/touch-of-fresh-moss-in-the-forest.jpg?s=1024x1024&w=is&k=20&c=WLVkjVoG8r68qfe2OOBqrbNqTXzjnWH9g2mrtF4-V08="; // This needs to be the actual URL to the uploaded evidence.

        try {
            console.log("start talking to contract")
            const tx = await contract.createAction(actionDescription, signerr.getAddress(), evidenceUrl);
            await tx.wait(); // Wait for transaction to be confirmed
            console.log("talked successfully")
            alert("Action submitted successfully!");
        } catch (error) {
            console.error("Error submitting action:", error);
            alert("Failed to submit action. Please try again.");
        }
    }

    return (
        <div>
            <Header />
            <main className="container mx-auto p-4">
                <h2 className="text-xl font-semibold mb-4">Submit an Action</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    submitAction();
                }}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="action-type">
                            Action Type
                        </label>
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" id="action-type">
                            <option>Plant a Tree</option>
                            <option>Recycle</option>
                            {/* Other action types */}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="evidence">
                            Upload Evidence
                        </label>
                        <input type="file" id="evidence" />
                    </div>

                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}
