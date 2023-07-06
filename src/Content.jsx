import axios from "axios"
import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { GoogleMap, MarkerF, LoadScript, InfoWindowF } from "@react-google-maps/api";
import "./Content.css";
import ReactLoading from 'react-loading';
import Autocomplete from 'react-google-autocomplete';




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
  
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: apiKey,
  // });

  // const center = useMemo(() => ({ lat: 37.7827488, lng: -122.4144937 }), []);
  const [center, setCenter] = useState({lat: 37.776497, lng: -122.441658})
  // const [address, setAddress] = useState("1500 Fulton St San Francisco, CA")  
  const [selectedCitation, setSelectedCitation] = useState(null)
  const [mostFrequentHour, setMostFrequentHour] = useState(0)
  const [q1q3, setq1q3] = useState([0,1])
  const [q1q3StrClean, setq1q3StrClean] = useState([0,1])
  const [citationTypes, setCitationTypes] = useState({})
  const [citationsLoading, setCitationsLoading] = useState(false)  
  const [googleLibraries, setGoogleLibraries] = useState(['places'])


  
  const getCitations = (event) => {
    // using this rather than state because setAddress was not updating before the web request was made
    var address = "1500 Fulton St San Francisco, CA"
    if (event) {      
      address = event.target[0].value;
      event.preventDefault();      
    }
    
    setCitationsLoading(true)
    axios.get(`${domain}/?q=${address}`).then(response => {
      console.log(address)
      setCitations(response.data.citations)
      setCenter({lat: response.data.closest_coordinates.latitude, lng: response.data.closest_coordinates.longitude})
      // console.log(response.data)
      const hours = response.data.analysis.data.hours
      setMostFrequentHour(Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b))
      // console.log(response.data.analysis.q1_q3.q1_q3_str_clean)
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
          <LoadScript googleMapsApiKey={apiKey} libraries={googleLibraries}>
            {/* <form onSubmit={getCitations}>
              <div >
                <input type="text" value={address} onChange={(event) => {setAddress(event.target.value)}}  />
                <button>Should I park here?</button>          
              </div>
            </form> */}   
            
            <form onSubmit={getCitations}>
              <Autocomplete              
                style={{ width: "90%" }}                              
                options={{
                  types: ["address"],
                  bounds: { 
                    north: 37.929823,
                    south: 37.639829,
                    east: -122.28178,
                    west: -123.173825
                  },
                  strictBounds: true
                }}
              />
              <button>Should I park here?</button>
            </form>

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
          </LoadScript>
        {/* )} */}
          

          <div>
            <h3>
              These are the most popular citations given in this area:
            </h3>
          {Object.keys(citationTypes).map(desc => (
              <div key={desc}>                
                <p>{desc}: {Number(((citationTypes[desc] / citations.length) * 100).toFixed(0))}%</p>
              </div>              
            ))}
            
          </div>        
        
      </div>           
    </div>
  )
}






