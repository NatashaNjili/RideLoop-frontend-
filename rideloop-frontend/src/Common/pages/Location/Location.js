// Location.js
import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchAllCars } from '../../../Admin/pages/Cars/CarSandR';
import '../../pagescss/Location.css';

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom Icons (✅ trailing spaces removed)
const renterIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34],
});

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34],
});

const walkerIcon = new L.Icon({
  iconUrl: require('../../../assets/walking.png'),
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  shadowSize: [0, 0],
});

const acceptedCarIcon = new L.Icon({
  iconUrl: require('../../../assets/taxi.png'),
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34],
});

const drivingCarIcon = acceptedCarIcon;

// Simulated realistic route
const generateRealisticRoute = (start, end) => {
  const steps = 60;
  const route = [];

  const midLat = (start.lat + end.lat) / 2 + 0.0015 * (Math.random() - 0.5);
  const midLng = (start.lng + end.lng) / 2 + 0.0015 * (Math.random() - 0.5);

  for (let i = 0; i < steps; i++) {
    let lat, lng;
    const t = i / steps;

    if (t < 0.4) {
      lat = start.lat + (midLat - start.lat) * (t / 0.4);
      lng = start.lng + (midLng - start.lng) * (t / 0.4);
    } else if (t < 0.7) {
      const progress = (t - 0.4) / 0.3;
      const detourLat = midLat + 0.002 * Math.sin(progress * Math.PI);
      const detourLng = midLng + 0.002 * Math.cos(progress * Math.PI);
      lat = midLat + (detourLat - midLat) * progress;
      lng = midLng + (detourLng - midLng) * progress;
    } else {
      const progress = (t - 0.7) / 0.3;
      lat = midLat + (end.lat - midLat) * progress;
      lng = midLng + (end.lng - midLng) * progress;
    }
    route.push({ lat, lng });
  }

  return route;
};

const Location = ({
  coords,
  onChooseCarMode,
  isChoosingCar,
  isWalking,
  acceptedCar,
  isInDrivingMode,
  showThankYou,
  onMapClick,
  refreshCars, 
}) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState([-30.5595, 22.9375]);
  const [cars, setCars] = useState([]);
  const [routePath, setRoutePath] = useState([]); // For polyline
  const ZOOM_LEVEL = 6;

  // Update map center when coords change
  useEffect(() => {
    if (coords && coords.lat !== undefined && coords.lng !== undefined) {
      const newCenter = [coords.lat, coords.lng];
      setCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.setView(newCenter, 13);
      }
    }
  }, [coords]);

  // Clear route when mode changes
  useEffect(() => {
    setRoutePath([]);
  }, [acceptedCar, isInDrivingMode]);

  // Fetch cars on mount
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchAllCars();
        console.log('🚛 [Location] Fetched cars:', data);
        setCars(data);

        if (data.length > 0 && mapRef.current) {
          const bounds = data
            .filter(car => car.location?.latitude && car.location?.longitude)
            .map(car => [car.location.latitude, car.location.longitude]);

          if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      } catch (err) {
        console.error('❌ Failed to fetch cars:', err);
      }
    };
    loadCars();
  }, []);

  // Refetch cars when refreshCars changes (triggered by parent)
  useEffect(() => {
    const refetchCars = async () => {
      try {
        const data = await fetchAllCars();
        console.log('🔁 [Location] Cars refreshed after ride:', data);
        setCars(data);

        // Re-fit map bounds
        if (data.length > 0 && mapRef.current) {
          const bounds = data
            .filter(car => car.location?.latitude && car.location?.longitude)
            .map(car => [car.location.latitude, car.location.longitude]);

          if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      } catch (err) {
        console.error('❌ Failed to refresh cars:', err);
      }
    };

    if (refreshCars) {
      refetchCars();
    }
  }, [refreshCars]);

  return (
    <div className="location-map-outer">
      <div className="location-map-inner">
        <MapContainer
          center={coords ? [coords.lat, coords.lng] : [-30.5595, 22.9375]}
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

          {/* Renter Marker */}
          {coords && !acceptedCar && !isInDrivingMode && (
            isWalking ? (
              <Marker position={[coords.lat, coords.lng]} icon={walkerIcon}>
                <Popup>🚶‍♂️ On my way to the car...</Popup>
              </Marker>
            ) : (
              <Marker position={[coords.lat, coords.lng]} icon={renterIcon}>
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      style={chooseCarButtonStyle}
                      onClick={() => onChooseCarMode(true)}
                    >
                      Choose a Car
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          )}

          {/* Show all cars only if no car is accepted */}
          {/* Show all cars only if no car is accepted */}
{!acceptedCar && !isInDrivingMode && !showThankYou && cars.length > 0 && (
  cars.map((car) => {
    if (!car.location?.latitude || !car.location?.longitude) return null;
    return (
      <Marker
        key={car.id || car.licensePlate}
        position={[car.location.latitude, car.location.longitude]}
        icon={carIcon}
        eventHandlers={{
          click: () => onChooseCarMode(car),
        }}
      >
        <Popup>
          <b>{car.brand} {car.model}</b><br />
          Year: {car.year}<br />
          Plate: {car.licensePlate}<br />
          Status: {car.status}<br />
          Category: {car.category}
        </Popup>
      </Marker>
    );
  })
)}


       {/* Accepted Car - Draggable */}
{acceptedCar && (
  <Marker
    position={[
      acceptedCar.location.latitude,
      acceptedCar.location.longitude,
    ]}
    icon={drivingCarIcon}
    draggable={isInDrivingMode}
    eventHandlers={{
      dragend: async (e) => {
        const { lat, lng } = e.target.getLatLng();
        if (!coords) return;

        const route = generateRealisticRoute(
          { lat: coords.lat, lng: coords.lng },
          { lat, lng }
        );

        const latlngs = route.map(p => [p.lat, p.lng]);
        setRoutePath(latlngs);

        onMapClick(lat, lng);
      }
    }}
  >
    <Popup>Drag me to your destination!</Popup>
  </Marker>
)}{/* ✅ Renter Marker — Rendered LAST to stay on top */}
{coords && !acceptedCar && !isInDrivingMode && (
  isWalking ? (
    <Marker position={[coords.lat, coords.lng]} icon={walkerIcon} zIndexOffset={1000}>
      <Popup>🚶‍♂️ On my way to the car...</Popup>
    </Marker>
  ) : (
    <Marker position={[coords.lat, coords.lng]} icon={renterIcon} zIndexOffset={1000}>
      <Popup>
        <div style={{ textAlign: 'center' }}>
          <button
            style={chooseCarButtonStyle}
            onClick={() => onChooseCarMode(true)}
          >
            Choose a Car
          </button>
        </div>
      </Popup>
    </Marker>
  )
)}

          {/* Highlighted Route */}
          {routePath.length > 0 && (
            <Polyline
              positions={routePath}
              color="blue"
              weight={5}
              opacity={0.8}
              smoothFactor={1.0}
            />
          )}
        </MapContainer>

        {/* Driving Mode Message */}
        {isInDrivingMode && !showThankYou && (
          <div style={drivingModeStyle}>
            🚗 Drag the car to your destination.<br />
            <small>Release to start the ride.</small>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles
const chooseCarButtonStyle = {
  padding: '5px 10px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
};

const drivingModeStyle = {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'green',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '8px',
  zIndex: 1000,
  textAlign: 'center',
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
};

export default Location;