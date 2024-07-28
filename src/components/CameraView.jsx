import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';

function CameraView() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { setCapturedImage } = useContext(CaptureContext);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  }, []);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');

    // 좌우 반전 !!
    context.save();
    context.scale(-1, 1);
    context.translate(-canvas.width, 0);
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    context.restore();

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    navigate('/check');
  };

  return (
    <div className="camera-view">
      <video ref={videoRef} autoPlay style={{ transform: 'scaleX(-1)' }} />
      <div className="camera-button">
        <button className="capture-button" onClick={captureImage}>Capture</button>
      </div>
    </div>
  );
}

export default CameraView;
