import React, { useEffect, useState } from "react";
import axios from "axios";
import DeliveryList from "./components/DeliveryList";
import DeliveryDetail from "./components/DeliveryDetail";
import MapView from "./components/MapView";
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchDeliveries = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/deliveries?status=${filter}`);
    setDeliveries(res.data);
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const filteredDeliveries = deliveries.filter(d =>
    d.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">Deliveries</h1>
        <input
          type="text"
          placeholder="Search by Customer"
          className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="mb-4 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Preparing</option>
          <option>In-Transit</option>
          <option>Delivered</option>
        </select>
        <DeliveryList deliveries={filteredDeliveries} onSelect={setSelectedDelivery} />
      </div>
      <div className="w-3/4 relative">
        <MapView deliveries={filteredDeliveries} onSelect={setSelectedDelivery} />
        {selectedDelivery && (
          <div className="absolute top-4 right-4 w-80 bg-white p-4 rounded shadow-lg animate-fadeIn">
            <DeliveryDetail delivery={selectedDelivery} />
          </div>
        )}
      </div>
    </div>
  );
}