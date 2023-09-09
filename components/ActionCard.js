// components/ActionCard.js

export default function ActionCard({ title, description, imageUrl }) {
    return (
      <div className="border p-4 m-2 rounded-lg">
        <img src={imageUrl} alt={title} className="w-full h-32 object-cover rounded-t-lg"/>
        <h3 className="text-lg font-medium mt-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }
  