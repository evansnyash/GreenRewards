// components/Footer.js

export default function Footer() {
    return (
      <footer className="bg-green-500 text-white p-4 mt-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} EcoReward</p>
        </div>
      </footer>
    );
  }
  