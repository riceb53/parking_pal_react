import axios from "axios"
import { useEffect } from "react"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "./Content.css";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

export function Content() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  
  const getCitations = () => {
    axios.get("http://localhost:8000/").then(response => {
      console.log(response.data)
    })
  }

  useEffect(getCitations, [])
  return (
    <div>
      <h1>Welcome to React!</h1>
      <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
        />
      )}
    </div>

    </div>
  )
}


