import reactLogo from './assets/images/react.png';
import googleMapsLogo from './assets/images/google_maps.jpeg';
import sqlAlchemyLogo from './assets/images/sqlalchemy.png';
import fastapiLogo from './assets/images/fastapi.jpeg';
import openDataSFLogo from './assets/images/opendatasf.jpeg';
import awsLogo from './assets/images/aws.png';


export function Footer() {
  return (
    <footer>
      <h2>Built with:</h2>
      <div className="technologies">
        <div className="technology">          
          <img src={reactLogo} alt="React" />;
          <p>React</p>
        </div>
        <div className="technology">
          <img src={fastapiLogo} alt="React" />;
          <p>FastAPI</p>
        </div>
        <div className="technology">
          <img src={openDataSFLogo} alt="React" />;
          <p>SF Open Data</p>
        </div>
        <div className="technology">
          <img src={googleMapsLogo} alt="React" />;
          <p>Google Maps</p>
        </div>
        <div className="technology">
          <img src={sqlAlchemyLogo} alt="React" />;
          <p>SQLAlchemy</p>
        </div>
        <div className="technology">
          <img src={awsLogo} alt="React" />;
          <p>AWS</p>
        </div>
      </div>
    </footer>
  )
}