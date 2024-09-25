import axios from "axios"
// import { DotPlot } from "./DotPlot"
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
  const [relativeNumberOfTickets, setrelativeNumberOfTickets] = useState(['places'])
  const [convertToFriendlyDesc, setconvertToFriendlyDesc] = useState({
    'STR CLEAN': 'Street Cleaning',
    'RES/OT': 'Residential Parking',
    'MTR OUT DT': 'Parking Meter-Outside Downtown Core',
    'METER DTN': 'Parking Meter- Downtown Core',
    'REG TABS': 'Tabs',
    'NO PLATES': 'No Plates',
    'YEL ZONE': 'Yellow Zone',
    'PK PHB OTD': 'Parking Prohibited On This day',
    'PRK PROHIB': 'Parking Prohibited',
    'DRIVEWAY': 'Driveway',
    'PRK GRADE': 'Parking on Grades',
    'DBL PARK': 'Double Parking',
    // questionable
    'FAIL DISPL': 'Display License Plates',
    'ON SIDEWLK': 'On Sidewalk',
    'RED ZONE': 'Red Zone',
    'TRK ZONE': 'Truck Loading Zone',
    'WHITE ZONE': 'White Zone',
    'OT OUT DT': 'Parking Meter-Outside Downtown Core',
    'PK STANDS': 'Parking in Stand ',
    'OBSTRCT TF': 'Obstruction of Traffic-Vehicle ',
    'BLK BIKE L': 'Bicycle Path/Lanes',
    'BUS ZONE': 'Bus Zone',
    'OVR 18 " C': 'Over 18 inches From Curb',
    'FIRE HYD': 'Fire Hydrant',
    'TMP PK RES': 'Temporary Parking Restriction',
    'CNSTR TEMP': 'Temporary Construction Zone',
    'PK/CROSS': 'Parking in Crosswalk',
    'NO EV REG': 'Not EV',
    'PLT LEF/AT': 'PLT LEF/AT',
    'PUB PROP': 'Parking-Public Property',
    'FACIL CRG': 'FACIL CRG',
    'N/ W/I SPC': 'N/ W/I SPC',
    'RESTRICTED': 'RESTRICTED',
    'ANGLE PARK': 'ANGLE PARK',
    'WHLCHR ACC': 'WHLCHR ACC',
    'PK OVR 72H': 'PK OVR 72H',
    'FAILRPLPLA': 'FAILRPLPLA',
    'TRNST ONLY': 'TRNST ONLY',
    'PLATECOVER': 'PLATECOVER',
    'OT PK DT': 'OT PK DT',
    'MED DIVIDE': 'MED DIVIDE',
    'B ZN NO DP': 'B ZN NO DP',
    'NO VIOL': 'NO VIOL',
    'MC PRKING': 'MC PRKING',
    'GREEN ZONE': 'GREEN ZONE',
    'MAR GRN PK': 'MAR GRN PK',
    'NOPRK 10P6': 'NOPRK 10P6',
    'NOPL/PRDSP': 'NOPL/PRDSP',
    'PK INTER': 'PK INTER',
    'DISOB SIGN': 'DISOB SIGN',
    'ON ST LST': 'ON ST LST',
    'SCH/PUB GD': 'SCH/PUB GD',
    'BLK/INTER': 'BLK/INTER',
    'OT MTR PK': 'OT MTR PK',
    '3 FT WLCHR': '3 FT WLCHR',
    'ONSTCARSH': 'ONSTCARSH',
    'PK FR LN': 'PK FR LN',
    'CM VEH RES': 'CM VEH RES',
    'UNAUTHFARE': 'UNAUTHFARE',
    'PKG PROHIB': 'PKG PROHIB',
    'ON STREET': 'ON STREET',
    'RR TRACKS': 'RR TRACKS',
    'NO PRK ZN': 'NO PRK ZN',
    'NO PERMIT': 'NO PERMIT',
    'B ZN XHTCH': 'B ZN XHTCH',
    'ILL PKG': 'ILL PKG',
    'INVALD PMT': 'INVALD PMT',
    'OFF STREET': 'OFF STREET',
    'OFF ST LST': 'OFF ST LST',
    'PROHIB PRK': 'PROHIB PRK',
    'LARGE VEHI': 'LARGE VEHI',
    'BL ZNE BLK': 'BL ZNE BLK',
    'SGTSEE BUS': 'SGTSEE BUS',
    'ONEWAY RD': 'ONEWAY RD',
    'ENG IDLING': 'ENG IDLING',
    'PLT F/R': 'PLT F/R',
    'FCL BLK SP': 'FCL BLK SP',
    'SAFE/RED Z': 'SAFE/RED Z',
    'WRG WY PKG': 'WRG WY PKG',
    'RESTR PRK': 'RESTR PRK',
    'RMV CHLK': 'RMV CHLK',
    'NO PERM': 'NO PERM',
    'PRMT WR CR': 'PRMT WR CR',
    'MTA NONPAY': 'MTA NONPAY',
    'CNTRFTFARE': 'CNTRFTFARE',
    'SMOKNG ETC': 'SMOKNG ETC',
    'FCL OT PK': 'FCL OT PK',
    'FARE EVASI': 'FARE EVASI',
    '100FT OVER': '100FT OVER',
    'OBSTRCT TR': 'OBSTRCT TR',
    'COMM VEH': 'COMM VEH',
    'SOUNDEQUIP': 'SOUNDEQUIP',
    'PRK ON RGT': 'PRK ON RGT',
    'FR/EVA/YTH': 'FR/EVA/YTH',
    '15FT FR ST': '15FT FR ST',
    'SIGNS': 'SIGNS',
    'FOR HIRE': 'FOR HIRE',
    'ACC ROADS': 'ACC ROADS',
    'STR CAR': 'STR CAR',
    'CAR ALM/EM': 'CAR ALM/EM',
    'BIC PATHS': 'BIC PATHS',
    'ABAND. VEH': 'ABAND. VEH',
    'STAY ON RD': 'STAY ON RD',
    'SAFE ZONE': 'SAFE ZONE',
    'FOR SALE': 'FOR SALE',
    'EXPLS/FLAM': 'EXPLS/FLAM',
    'CTY HL PER': 'CTY HL PER',
    'BK CHG BAY': 'BK CHG BAY',
    'ALT PLATES': 'ALT PLATES',
    'AD SIGNS': 'AD SIGNS',
    'URIN/DFECT': 'URIN/DFECT',
    'UNATEND VH': 'UNATEND VH',
    'TRANSIT LN': 'TRANSIT LN',
    'SPITTING': 'SPITTING',
    'SKARBG/ROL': 'SKARBG/ROL',
    'SAFETY ZN': 'SAFETY ZN',
    'PRMT ONLY': 'PRMT ONLY',
    'PL NT PERS': 'PL NT PERS',
    'P U C PEMT': 'P U C PEMT',
    'NO STOP BP': 'NO STOP BP',
    'IMP DPL PL': 'IMP DPL PL',
    'DISTURBAN': 'DISTURBAN',
    'DBL PKG': 'Double Parking',
    'CAR ALM 15': 'CAR ALM 15',
    'BRIDGE': 'BRIDGE',
    'BLOCKING': 'BLOCKING',
    'BLK INTER': 'BLK INTER',
  })


  
  const getCitations = (event) => {
    // '// using this rather than state because setAddress was not ': '',updating before the web request was made
    var address = "1500 FULTON STREET, San Francisco, CA"
    if (event) {      
      address = event.target[0].value;
      event.preventDefault();      
    }
    
    setCitationsLoading(true)
    axios.get(`${domain}/address_search?q=${address}`).then(response => {
      console.log(response.data)
      setCitations(response.data.citations)
      setCenter({lat: parseFloat(response.data.closest_coordinates.latitude), lng: parseFloat(response.data.closest_coordinates.longitude)})
      // console.log(response.data)
      const hours = response.data.analysis.data.hours
      setMostFrequentHour(Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b))
      // console.log(response.data.analysis.q1_q3.q1_q3_str_clean)
      setq1q3(response.data.analysis.q1_q3.q1_q3)
      setq1q3StrClean(response.data.analysis.q1_q3.str_clean)
      setCitationTypes(response.data.analysis.data.types_and_frequencies)
      setCitationsLoading(false)
      setrelativeNumberOfTickets(response.data.analysis.expected_tickets_per_block)
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
                  componentRestrictions: { country: "us" },
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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {citationsLoading && <div>              
                <ReactLoading type={'spin'} color={'#2e61b4'} height={667} width={375} />
              </div> }
              <h3>
                Your parking tips:
              </h3>
              <p>The most tickets are given at the {mostFrequentHour} hour</p>
              {/* <p>The total number of tickets given in the last year is {citations.length}</p> */}
              <p>50% of tickets in this area are between the hours of {q1q3[0]} and {q1q3[1]}</p>
              {q1q3StrClean.length > 0 ? (
                // Render something if q1q3StrClean has a length greater than 0
                <p>50% of street sweeping tickets in this area are between the hours of {q1q3StrClean[0]} and {q1q3StrClean[1]}</p>        
              ) : (
                // Render something else if q1q3StrClean is empty
                <span></span>
              )}
              <p>{relativeNumberOfTickets}</p>

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
                    <div>{selectedCitation.citation_issued_day_of_week} {new Date(selectedCitation.citation_issued_datetime).toLocaleString()} </div>
                    <div>{convertToFriendlyDesc[selectedCitation.violation_desc]}</div>
                    <div>{selectedCitation.citation_location}</div>
                  </div>
                </InfoWindowF>
              )}

            </GoogleMap>
          </LoadScript>
        {/* )} */}
        {/* does not work */}
          {/* <DotPlot citations={citations} /> */}

          <div>
            <h3>
              These are the most popular citations given in this area:
            </h3>
            {Object.keys(citationTypes).map(desc => {
              // Define your CSS classes
              const actualPercentage = citationTypes[desc]['actual_percentage'];
              const estimatedPercentage = citationTypes[desc]['estimated_percentage'];
              const difference = actualPercentage - estimatedPercentage;
      
              
              let cssClass = '';
              if (difference > 10) {
                cssClass = 'red';
              } else if (difference < -10) {
                cssClass = 'green';
              }
              
              return (              
              <div key={desc}>
                {/* <div>Estimated likelihood of {desc}: {citationTypes[desc]['estimated_percentage']}%
                </div> */}
                <div>{convertToFriendlyDesc[desc]}: <span className={cssClass}>{citationTypes[desc]['actual_percentage']}%</span>
                </div>
              </div>
            )})}
            <p>Citations highlighted in red are more frequent than average on this block, citations highlighted in green are less frequent than average</p>
          {/* {Object.keys(citationTypes).map(desc => (
              <div key={desc}>                
                <p>{desc}: {Number(((citationTypes[desc] / citations.length) * 100).toFixed(0))}%</p>
              </div>              
            ))}             */}
          </div>        
        
      </div>           
    </div>
  )
}






