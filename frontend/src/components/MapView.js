import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const statusIcons = {
  "Preparing": "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
  "In-Transit": "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  "Delivered": "https://cdn-icons-png.flaticon.com/512/190/190411.png"
};

export default function MapView({ deliveries, onSelect }) {
  const center = [37.7749, -122.4194];

  return (
    <MapContainer center={center} zoom={13} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {deliveries.map((d) => {
        const icon = L.icon({ iconUrl: statusIcons[d.status], iconSize: [30, 30] });
        return (
          <Marker
            key={d.id}
            position={[d.latitude, d.longitude]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(d) }}
          >
            <Popup>
              <div className="font-bold">{d.customer_name}</div>
              <div>Status: {d.status}</div>
              <div>ETA: {d.eta}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}