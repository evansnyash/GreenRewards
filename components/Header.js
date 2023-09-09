import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-green-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">EcoReward</h1>
          <p className="text-sm">Make Earth greener, earn rewards.</p>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              {isMenuOpen ? (
                // X icon for close
                <path fillRule="evenodd" clipRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z"/>
              ) : (
                // Hamburger icon for menu
                <path fillRule="evenodd" clipRule="evenodd" d="M4 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM4 11a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM4 17a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z"/>
              )}
            </svg>
          </button>
        </div>

        <nav className={`md:block ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="md:flex md:space-x-4 space-y-2 md:space-y-0">
            <li>
              <Link href="/">
                <p className="hover:text-gray-200">Home</p>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <p className="hover:text-gray-200">Account</p>
              </Link>
            </li>
            <li>
              <Link href="/submit">
                <p className="hover:text-gray-200">Submit Action</p>
              </Link>
            </li>
            <li>
              <Link href="/verify">
                <p className="hover:text-gray-200">Verify Actions</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
