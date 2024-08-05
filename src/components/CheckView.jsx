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
        const imageWidth = frameWidth * 0.8; 
        const imageHeight = frameHeight * 0.77; 
        const imageX = (frameWidth - imageWidth) / 2.3;
        const imageY = (frameHeight - imageHeight) / 2.5;
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        context.clearRect(0, 0, frameWidth, frameHeight); //초기화를 해보아요

        context.save(); 
        context.translate(canvas.width, 0);
        context.scale(-1,1); //좌우반전 ㄴㄴ

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadImages();
  }, []);  //빈 배열로 의존성 설정

  const handleRetake = () => { //재촬영 버튼용 초기화 핸들러임ㅇ밍미
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
