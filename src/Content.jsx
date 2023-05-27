import axios from "axios"
import { useEffect, useState, useMemo } from "react"
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import "./Content.css";


const apiKey = import.meta.env.VITE_GOOGLE_API_KEY



export function Content() {
  const [citations, setCitations] = useState([])
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  // const center = useMemo(() => ({ lat: 37.7827488, lng: -122.4144937 }), []);
  const [center, setCenter] = useState({})

  
  const getCitations = () => {
    axios.get("http://localhost:8000/").then(response => {
      setCitations(response.data.citations)
      setCenter({lat: response.data.closest_coordinates.latitude, lng: response.data.closest_coordinates.longitude})
      console.log(response.data)
    })
  }
  useEffect(getCitations, [])
  const iconOptions = {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Replace with your marker image URL or icon path
    // size: 0.5, // Adjust the size as per your requirement
  };



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
          zoom={17}
        >
          {citations.map(citation => (            
              <MarkerF key={citation.id}
                position={{ lat: citation.latitude, lng: citation.longitude
                }}
                icon={citation.violation_desc === 'STR CLEAN' ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
              />            

          ))}
        </GoogleMap>
      )}
    </div>

    </div>
  )
}






