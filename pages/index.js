import Header from '../components/Header';
import ActionCard from '../components/ActionCard';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';


export default function Home() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setInstallPromptEvent(e);
    });

    // Cleanup listener on unmount
    return () => window.removeEventListener('beforeinstallprompt', setInstallPromptEvent);
  }, []);

  const installApp = async () => {
    console.log("1")
    // if there's no stored event, exit the function
    if (!installPromptEvent) return; 
    console.log("2")

    // Show the modal add to home screen dialog
    installPromptEvent.prompt();
    console.log("2")

    // Wait for the user's response
    const { outcome } = await installPromptEvent.userChoice;
    console.log("3")

    console.log(`User response was: ${outcome}`);
    console.log("4")

    // We no longer need the saved beforeinstallprompt event, clear it
    setInstallPromptEvent(null);
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-500 text-white text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Join the Green Revolution</h1>
        <p className="text-lg mb-8">Help offset carbon footprint and get rewarded for your efforts.</p>
        <Link href="/profile">
          <p className="inline-block bg-white text-green-500 py-1.5 px-6 rounded-full hover:bg-green-200 shadow-md transition duration-300 transform hover:scale-105">Join Now</p>
        </Link>
      </section>

      <main className="container mx-auto p-4">
        {/* Actions Section */}
        <h2 className="text-xl font-semibold mb-4">Actions to Offset Carbon Footprint</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard title="Plant a Tree" description="Help reforest the world by planting trees." imageUrl="/tree.jpeg" />
          <ActionCard title="Recycle" description="Reduce waste by recycling products." imageUrl="/tree.jpeg" />
          {/* More action cards */}
        </div>

        {/* Informational Section */}
        <section className="my-16">
          <h2 className="text-2xl font-semibold mb-4">Why EcoReward?</h2>
          <p className="text-lg mb-4">EcoReward is not just a platform, but a community-driven initiative to incentivize earth-saving actions. By participating, you are not just earning tokens, but also contributing to a sustainable future.</p>
          <Link href="/about">
            <p className="text-green-500 hover:underline">Learn More</p>
          </Link>
        </section>

        <div>
      <button onClick={installApp}>Install App</button>
    </div>
      </main>

      <Footer />
    </div>
  );
}
