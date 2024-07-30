import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CameraView.scss';

function CameraView() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { setCapturedImage } = useContext(CaptureContext);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ 
      video: {
        facingMode: 'user',
        width: {ideal: 480 },
        height: {ideal:640}
      } })

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
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    navigate('/check');
  };

  return (
    <div className="container camera-view">
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline />
      </div>
      <div className="camera-button">
        <button className="capture-button" onClick={captureImage}>
          <img src='images/CameraButton.png' alt='Capture' />
        </button>
      </div>
    </div>
  );
}

export default CameraView; //카메라 컴포넌트를 추출한다는 뜻 (맹)
