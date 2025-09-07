export default function DeliveryList({ deliveries, onSelect }) {
  const statusColors = {
    "Preparing": "bg-yellow-100 text-yellow-800",
    "In-Transit": "bg-blue-100 text-blue-800",
    "Delivered": "bg-green-100 text-green-800"
  };

  return (
    <ul>
      {deliveries.map((d) => (
        <li
          key={d.id}
          className={`p-2 mb-2 border rounded cursor-pointer hover:scale-105 transform transition-all ${statusColors[d.status] || "bg-gray-100"}`}
          onClick={() => onSelect(d)}
        >
          <div className="font-bold">{d.customer_name}</div>
          <div className="text-sm">{d.status}</div>
          <div className={`text-xs font-semibold ${d.status === "Delivered" ? "text-green-700" : d.status === "In-Transit" ? "text-blue-700" : "text-yellow-700"}`}>
            ETA: {d.eta}
          </div>
        </li>
      ))}
    </ul>
  );
}