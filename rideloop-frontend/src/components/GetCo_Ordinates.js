
import React, { useState } from 'react';
import LocationPermission from './LocationPermission';
import Location from '../Common/pages/Location/Location';

const GetCo_Ordinates = () => {
  const [coords, setCoords] = useState(null); // { latitude, longitude }

  return (
    <div>
      <LocationPermission setCoords={setCoords} />
      <Location coords={coords} />
    </div>
  );
};

export default GetCo_Ordinates;