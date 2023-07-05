import axios from "axios"
import { useEffect, useState, useMemo } from "react"
import { GoogleMap, MarkerF, useLoadScript, InfoWindowF } from "@react-google-maps/api";
import "./Content.css";
import ReactLoading from 'react-loading';




export function Content() {
  let apiKey = null;
  let domain = null;
  apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  if (import.meta.env.VITE_GOOGLE_API_KEY_2) {
    // Handle the case when not deployed on Netlify        
    domain = 'http://localhost:8000'; 
  } else {    
    // Access the API key when deployed on Netlify       
    domain = 'https://sfparkingpalapi.com';     
  }
  const [citations, setCitations] = useState([])
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  // const center = useMemo(() => ({ lat: 37.7827488, lng: -122.4144937 }), []);
  const [center, setCenter] = useState({lat: 37.776497, lng: -122.441658})
  const [address, setAddress] = useState("1500 Fulton St San Francisco, CA")  
  const [selectedCitation, setSelectedCitation] = useState(null)
  const [mostFrequentHour, setMostFrequentHour] = useState(0)
  const [q1q3, setq1q3] = useState([0,1])
  const [q1q3StrClean, setq1q3StrClean] = useState([0,1])
  const [citationTypes, setCitationTypes] = useState({})
  const [citationsLoading, setCitationsLoading] = useState(true)  

  
  const getCitations = () => {
    setCitationsLoading(true)
    axios.get(`${domain}/?q=${address}`).then(response => {
      setCitations(response.data.citations)
      setCenter({lat: response.data.closest_coordinates.latitude, lng: response.data.closest_coordinates.longitude})
      console.log(response.data)
      const hours = response.data.analysis.data.hours
      setMostFrequentHour(Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b))
      console.log(response.data.analysis.q1_q3.q1_q3_str_clean)
      setq1q3(response.data.analysis.q1_q3.q1_q3)
      setq1q3StrClean(response.data.analysis.q1_q3.q1_q3_str_clean)
      setCitationTypes(response.data.analysis.data.types)
      setCitationsLoading(false)
    })
  }
  useEffect(getCitations, [])
  
  // add search bar
  // onClick make web request to API
  // reset data



  return (
      <div className="App">  
        <div className="content">                
          
          <div className="search-bar">
          <input type="text" value={address} onChange={(event) => {setAddress(event.target.value)}} />
          <button onClick={getCitations}>Should I park here?</button>          
        </div>
          <div>
            {citationsLoading && <div>              
              <ReactLoading type={'spin'} color={'#2e61b4'} height={667} width={375} />
            </div> }
            <h3>
              Your parking tips:
            </h3>
            <p>The most frequent hour of tickets is {mostFrequentHour}</p>
            <p>50% of tickets in this area are between the hours of {q1q3[0]} and {q1q3[1]}</p>
            <p>50% of street sweeping tickets in this area are between the hours of {q1q3StrClean[0]} and {q1q3StrClean[1]}</p>

          </div>        
        
        
          {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          
          <GoogleMap
            mapContainerClassName="map"
            center={center}
            zoom={17}
          >
            {citations.map(citation => (            
                <MarkerF key={citation.id}
                  position={{ lat: citation.latitude, lng: citation.longitude
                  }}
                  icon={citation.violation_desc === 'STR CLEAN' ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
                  onClick={() => setSelectedCitation(citation)}                                  
                />                            
                
            ))}
            
            {selectedCitation && (
              <InfoWindowF
                position={{ lat: selectedCitation.latitude, lng: selectedCitation.longitude
                }}
                onCloseClick={() => setSelectedCitation(null)}
              >
                <div>
                  <div>{selectedCitation.citation_issued_datetime}</div>
                  <div>{selectedCitation.violation_desc}</div>
                  <div>{selectedCitation.citation_location}</div>
                </div>
              </InfoWindowF>
            )}

          </GoogleMap>
        )}
          

          <div>
            <h3>
              These are the most popular citations given in this area:
            </h3>
          {Object.keys(citationTypes).map(desc => (
              <div key="desc">                
                <p>{desc}: {Number(((citationTypes[desc] / citations.length) * 100).toFixed(0))}%</p>
              </div>              
            ))}
            
          </div>        
        
      </div>           
    </div>
  )
}






