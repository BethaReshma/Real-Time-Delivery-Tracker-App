export default function DeliveryDetail({ delivery }) {
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Delivery ID: {delivery.id}</h2>
      <p><strong>Customer:</strong> {delivery.customer_name}</p>
      <p><strong>Address:</strong> {delivery.address}</p>
      <p><strong>Status:</strong> {delivery.status}</p>
      <p><strong>ETA:</strong> {delivery.eta}</p>
    </div>
  );
}