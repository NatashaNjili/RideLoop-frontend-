// RideProcess.js
import React, { useState } from "react";
import LocationPermission from '../../../components/LocationPermission';
import Location from '../../../Common/pages/Location/Location';
import RideInfo from './RideInfo';
import { updateCarLocation } from '../../../Admin/pages/Cars/CarSandR';

// Helper: Delay for animation
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Haversine Formula: Calculate distance between two points in km
function calculateDistance(start, end) {
  const R = 6371; // Earth radius in km
  const toRad = (angle) => (angle * Math.PI) / 180;

  const lat1 = toRad(start.lat);
  const lat2 = toRad(end.lat);
  const deltaLat = toRad(end.lat - start.lat);
  const deltaLng = toRad(end.lng - start.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function RideProcess() {
  const [coords, setCoords] = useState(null);
  const [isChoosingCar, setIsChoosingCar] = useState(false);
  const [walkingToCar, setWalkingToCar] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [acceptedCar, setAcceptedCar] = useState(null);
  const [isInDrivingMode, setIsInDrivingMode] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isAnimatingDrive, setIsAnimatingDrive] = useState(false);
  const [rideDistance, setRideDistance] = useState(null);

  // Toggle to trigger refresh in Location
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Enter choose mode or select car
  const handleChooseCar = (data) => {
    if (data === true) {
      setIsChoosingCar(true);
    } else if (isChoosingCar && data && data.location) {
      setIsChoosingCar(false);
      setWalkingToCar(data);
      setIsWalking(true);

      const start = { ...coords };
      const end = {
        lat: data.location.latitude,
        lng: data.location.longitude,
      };

      const steps = 60;
      const intervalTime = 2000 / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(interval);
          setCoords(end);
          setIsWalking(false);
          setWalkingToCar(null);
          setSelectedCar(data);
        } else {
          const progress = currentStep / steps;
          const currentLat = start.lat + (end.lat - start.lat) * progress;
          const currentLng = start.lng + (end.lng - start.lng) * progress;
          setCoords({ lat: currentLat, lng: currentLng });
        }
      }, intervalTime);
    }
  };

  // Accept selected car → enter driving mode
  const handleAccept = () => {
    setAcceptedCar(selectedCar);
    setSelectedCar(null);
    setIsInDrivingMode(true);
  };

  // Decline car selection
  const handleDecline = () => {
    setSelectedCar(null);
    setIsChoosingCar(true);
  };

  // Handle destination from drag → animate realistic drive
  const handleMapClick = async (lat, lng) => {
    if (isInDrivingMode && !isAnimatingDrive && acceptedCar && coords) {
      setIsAnimatingDrive(true);
      setIsInDrivingMode(false);

      const start = { lat: coords.lat, lng: coords.lng };
      const destination = { lat, lng };

      // Generate and animate route
      const route = generateRealisticRoute(start, destination);
      for (let point of route) {
        setCoords(point);
        setAcceptedCar(prev => ({
          ...prev,
          location: { latitude: point.lat, longitude: point.lng }
        }));
        await sleep(80);
      }

      // Final position
      setCoords(destination);

      // Calculate distance
      const distanceInKm = calculateDistance(start, destination);
      const distanceInMeters = Math.round(distanceInKm * 1000);
      setRideDistance(distanceInKm);

      // Update car on backend
      try {
        await updateCarLocation(acceptedCar.carId, { latitude: lat, longitude: lng }, distanceInMeters);
        console.log('✅ Car updated on server!');
      } catch (error) {
        console.error('❌ Update failed:', error.message);
      }

      // Trigger refetch in Location
      setRefreshTrigger(prev => !prev);

      // Show thank you
      setShowThankYou(true);
      setIsAnimatingDrive(false);
    }
  };

  // Close thank you message
  const handleThankYouClose = () => {
    setShowThankYou(false);
    setAcceptedCar(null);
    setRideDistance(null);
  };

  return (
    <div>
      {!coords ? (
        <LocationPermission setCoords={setCoords} />
      ) : (
        <>
          <Location
            coords={coords}
            onChooseCarMode={handleChooseCar}
            isChoosingCar={isChoosingCar}
            isWalking={isWalking}
            walkingToCar={walkingToCar}
            acceptedCar={acceptedCar}
            isInDrivingMode={isInDrivingMode}
            showThankYou={showThankYou}
            onMapClick={handleMapClick}
            refreshCars={refreshTrigger} 
          />

          {/* Popup after arriving at car */}
          {selectedCar && !isWalking && !isChoosingCar && !isInDrivingMode && !showThankYou && (
            <>
              <div
                className="ride-overlay"
                onClick={() => setSelectedCar(null)}
              />
              <RideInfo
                car={selectedCar}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            </>
          )}

          {/* Thank You Popup */}
          {showThankYou && (
            <div
              className="thank-you-overlay"
              style={thankYouOverlayStyle}
              onClick={handleThankYouClose}
            >
              <div style={thankYouBoxStyle}>
                <h2>🎉 Ride Complete!</h2>
                <p>
                  You traveled <strong>{rideDistance !== null ? `${rideDistance} km` : '...'}</strong>
                </p>
                <small>Click anywhere to continue...</small>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Generate realistic route
function generateRealisticRoute(start, end) {
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
}

// Styles for thank you popup
const thankYouOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
  cursor: 'pointer',
};

const thankYouBoxStyle = {
  backgroundColor: 'white',
  padding: '30px 40px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  maxWidth: '300px',
};

export default RideProcess;