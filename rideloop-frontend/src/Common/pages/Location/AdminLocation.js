import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchAllCars } from '../../../Admin/pages/Cars/CarSandR';

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34],
});

const AdminLocation = ({ coords }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState([-30.5595, 22.9375]); // South Africa
  const [cars, setCars] = useState([]);
  const ZOOM_LEVEL = 6;

  // Update map center when user location changes
  useEffect(() => {
    if (coords && coords.lat !== undefined && coords.lng !== undefined) {
      const newCenter = [coords.lat, coords.lng];
      setCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.setView(newCenter, 13);
      }
    }
  }, [coords]);


  // Fetch cars and refresh every 20 seconds
  useEffect(() => {
    // Function to fetch and update cars
    const fetchAndSetCars = async () => {
      try {
        const data = await fetchAllCars();
        setCars(data);

        // Fit map bounds to all cars
        if (data && data.length > 0 && mapRef.current) {
          const bounds = data
            .filter(car => car.location && car.location.latitude !== undefined && car.location.longitude !== undefined)
            .map(car => [car.location.latitude, car.location.longitude]);

          if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      }
    };

    // Initial fetch
    fetchAndSetCars();

    // Set up interval: every 10 seconds
    const intervalId = setInterval(() => {
      console.log("🔁 [AdminLocation] Refreshing cars...");
      fetchAndSetCars();
    }, 20000); // 20,000 ms = 20 seconds

    // Cleanup: clear interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); 

  return (
    <div className="location-map-outer">
      <div className="location-map-inner">
        <MapContainer
          center={center}
          zoom={ZOOM_LEVEL}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

    

          {/* All Car Markers */}
          {cars.map((car, idx) => (
            car.location &&
            car.location.latitude !== undefined &&
            car.location.longitude !== undefined ? (
              <Marker
                key={idx}
                position={[car.location.latitude, car.location.longitude]}
                icon={carIcon}
              >
                <Popup>
                  <b>{car.brand} {car.model}</b><br />
                  Year: {car.year}<br />
                  Plate: {car.licensePlate}<br />
                  Status: {car.status}<br />
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

export default AdminLocation;