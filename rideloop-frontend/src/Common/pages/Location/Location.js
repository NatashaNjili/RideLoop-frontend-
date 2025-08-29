import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchAllCars } from '../../../Admin/pages/Cars/CarSandR';
import '../../pagescss/Location.css';

// Fix default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Location = ({ coords }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState([-30.5595, 22.9375]); // Default: South Africa
  const [cars, setCars] = useState([]);
  const ZOOM_LEVEL = 6;

  // Center on user location if available
  useEffect(() => {
    if (coords && coords.lat !== undefined && coords.lng !== undefined) {
      const newCenter = [coords.lat, coords.lng];
      setCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.setView(newCenter, 13);
      }
    }
  }, [coords]);

  // Fetch cars and fit bounds to all car markers
  useEffect(() => {
    async function getCars() {
      try {
        const data = await fetchAllCars();
        setCars(data);
        // Fit map to all car markers if any
        if (data && data.length > 0 && mapRef.current) {
          const bounds = data
            .filter(car => car.location && car.location.latitude !== undefined && car.location.longitude !== undefined)
            .map(car => [car.location.latitude, car.location.longitude]);
          if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    getCars();
  }, []);

  return (
    <div className="location-map-outer">
      <div className="location-map-inner">
        <MapContainer
          center={center}
          zoom={ZOOM_LEVEL}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coords && coords.lat !== undefined && coords.lng !== undefined && (
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Your location</Popup>
            </Marker>
          )}
          {cars.map((car, idx) => (
            car.location && car.location.latitude !== undefined && car.location.longitude !== undefined ? (
              <Marker key={idx} position={[car.location.latitude, car.location.longitude]}>
                <Popup>
                  <b>{car.brand} {car.model}</b><br/>
                  Year: {car.year}<br/>
                  Plate: {car.licensePlate}<br/>
                  Status: {car.status}<br/>
                  Category: {car.category}
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Location;