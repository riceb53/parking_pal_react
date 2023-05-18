import axios from "axios"
import { useEffect, useState } from "react"
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "./Content.css";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY



export function Content() {
  const [citations, setCitations] = useState([])
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  const center = useMemo(() => ({ lat: 48.8566, lng: 2.3522 }), []);

  
  const getCitations = () => {
    axios.get("http://localhost:8000/").then(response => {
      setCitations(response.data)
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
        >
          {citations.map(citation => (
            <MarkerF
              position={{ lat: citation.latitude, lng: citation.longitude
              }}
              icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
            />

          ))}
        </GoogleMap>
      )}
    </div>

    </div>
  )
}






