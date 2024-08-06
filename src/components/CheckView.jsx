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

        // 프레임 크기에 맞추기 위한 계산
        const imageAspectRatio = capturedImg.width / capturedImg.height;
        const frameAspectRatio = frameWidth / frameHeight;

        let imageWidth, imageHeight, imageX, imageY;

        if (imageAspectRatio > frameAspectRatio) {
          // 이미지가 더 넓음, 프레임 높이에 맞추기
          imageHeight = frameHeight;
          imageWidth = imageHeight * imageAspectRatio;
          imageX = (frameWidth - imageWidth) / 2;
          imageY = 0;
        } else {
          // 이미지가 더 높음, 프레임 너비에 맞추기
          imageWidth = frameWidth;
          imageHeight = imageWidth / imageAspectRatio;
          imageX = 0;
          imageY = (frameHeight - imageHeight) / 2;
        }

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        context.clearRect(0, 0, frameWidth, frameHeight);

        // 블랙 배경으로 캔버스 초기화
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

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
