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
        const frameAspectRatio = frameWidth / frameHeight;

        // 캡처된 이미지의 비율
        const capturedAspectRatio = capturedImg.width / capturedImg.height;

        let imageWidth, imageHeight, imageX, imageY;
        if (capturedAspectRatio > frameAspectRatio) {
          // 이미지가 프레임보다 넓을 때
          imageWidth = frameWidth;
          imageHeight = frameWidth / capturedAspectRatio;
          imageX = 0;
          imageY = (frameHeight - imageHeight) / 2;
        } else {
          // 이미지가 프레임보다 좁을 때
          imageHeight = frameHeight;
          imageWidth = frameHeight * capturedAspectRatio;
          imageX = (frameWidth - imageWidth) / 2;
          imageY = 0;
        }

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // 클리핑 영역 설정
        context.save();
        context.beginPath();
        context.rect(0, 0, frameWidth, frameHeight);
        context.clip();

        // 좌우반전 복원 및 이미지 그리기
        context.drawImage(capturedImg, imageX, imageY, imageWidth, imageHeight);
        context.restore();

        // 프레임 그리기
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
