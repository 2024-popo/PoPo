import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CheckView.scss';
import Loading from './Loading';

function CheckView() {
  const { capturedImage, setCapturedImage } = useContext(CaptureContext);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!capturedImage) {
      navigate('/camera');
      return;
    }

    const loadImages = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const frameImage = new Image();
      const capturedImg = new Image();

      frameImage.src = '/images/polaroid.png';
      capturedImg.src = capturedImage;

      const loadImage = (img) => {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      };

      try {
        await Promise.all([loadImage(frameImage), loadImage(capturedImg)]);

        const frameWidth = frameImage.width;
        const frameHeight = frameImage.height;

        // 모바일 화면 크기 기준 조정
        let imageWidth, imageHeight, imageX, imageY;
        if (window.innerWidth <= 768) { // 모바일 기기 너비의 예: 768px 이하
          imageWidth = frameWidth * 0.8;
          imageHeight = frameHeight * 0.4;
          imageX = (frameWidth - imageWidth) / 1.98;
          imageY = (frameHeight - imageHeight) / 3.5;
        } else { // 데스크탑 또는 더 큰 화면의 기본 비율
          imageWidth = frameWidth * 0.8; 
          imageHeight = frameHeight * 0.77;
          imageX = (frameWidth - imageWidth) / 2.3;
          imageY = (frameHeight - imageHeight) / 2.5;

        }
        
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        context.clearRect(0, 0, frameWidth, frameHeight);

        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(capturedImg, imageX, imageY, imageWidth, imageHeight);
        context.restore();

        context.drawImage(frameImage, 0, 0, frameWidth, frameHeight);

        const finalImage = canvas.toDataURL('image/png');
        setCapturedImage((prevImage) => prevImage === capturedImage ? finalImage : prevImage);
        setImageLoaded(true);
      } catch (error) {
        console.error('Failed to load images', error);
      }
    };

    loadImages();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleRetake = () => {
    setCapturedImage(null);
    setImageLoaded(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="check-view">
      <div className="photo-frame">
        <canvas ref={canvasRef} className="result-canvas"></canvas>
        {!imageLoaded && <div><Loading /></div>}
      </div>
      <div className="button-container">
        <Link to="/camera" onClick={handleRetake}>
          <button className="retake-button">
            <img src='images/BackButton.png' alt='Back' />
            Again
          </button>
        </Link>
        <Link to="/decorate">
          <button className="next-button">
            <img src='images/NextButton.png' alt='Next' />
            Next</button>
        </Link>
      </div>
    </div>
  );
}

export default CheckView;
