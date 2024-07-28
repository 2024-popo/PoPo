import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';

function CheckView() {
  const { capturedImage } = useContext(CaptureContext);
  const navigate = useNavigate();

  if (!capturedImage) {
    navigate('/camera');
    return null;
  }

  return (
    <div className="check-view">
      <div className="photo-container">
        <img src={capturedImage} alt="Captured" style={{ transform: 'scaleX(-1)' }} />
      </div>
      <div className="button-container">
        <Link to="/camera">
          <button className="retake-button">Again</button>
        </Link>
        <Link to="/decorate">
          <button className="next-button">Next</button>
        </Link>
      </div>
    </div>
  );
}

export default CheckView;
