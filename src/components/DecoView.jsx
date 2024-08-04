import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import StickerPanel from './StickerPanel';
import '../asset/DecoView.scss';

function DecoView() {
  const { capturedImage } = useContext(CaptureContext);
  const [stickers, setStickers] = useState([]);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [currentSticker, setCurrentSticker] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });

  const addSticker = (src) => {
    setStickers([...stickers, { id: Date.now(), src, x: 100, y: 100, width: 100, height: 100 }]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragging) return; // Prevent processing while dragging
    const stickerSrc = e.dataTransfer.getData('text/plain');
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStickers([...stickers, { id: Date.now(), src: stickerSrc, x, y, width: 100, height: 100 }]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter((sticker) => sticker.id !== id));
  };

  const handleMouseDown = (e, sticker, type = 'drag') => {
    const rect = imageRef.current.getBoundingClientRect();
    if (type === 'resize') {
      setCurrentSticker(sticker.id);
      setResizeStart({ x: e.clientX, y: e.clientY });
      setResizing(true);
    } else {
      setCurrentSticker(sticker.id);
      setDragOffset({
        x: e.clientX - (rect.left + sticker.x),
        y: e.clientY - (rect.top + sticker.y),
      });
      setDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const sticker = stickers.find((sticker) => sticker.id === currentSticker);
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newDimension = Math.max(sticker.width + deltaX, sticker.height + deltaY);

      setStickers((prevStickers) =>
        prevStickers.map((s) =>
          s.id === currentSticker
            ? { ...s, width: newDimension, height: newDimension }
            : s
        )
      );

      setResizeStart({ x: e.clientX, y: e.clientY });
    } else if (dragging) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      setStickers((prevStickers) =>
        prevStickers.map((sticker) =>
          sticker.id === currentSticker ? { ...sticker, x, y } : sticker
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setCurrentSticker(null);
  };

  const handleTouchStart = (e, sticker, type = 'drag') => {
    const touch = e.touches[0];
    const rect = imageRef.current.getBoundingClientRect();
    if (type === 'resize') {
      setCurrentSticker(sticker.id);
      setResizeStart({ x: touch.clientX, y: touch.clientY });
      setResizing(true);
    } else {
      setCurrentSticker(sticker.id);
      setDragOffset({
        x: touch.clientX - (rect.left + sticker.x),
        y: touch.clientY - (rect.top + sticker.y),
      });
      setDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (resizing) {
      const touch = e.touches[0];
      const sticker = stickers.find((sticker) => sticker.id === currentSticker);
      const deltaX = touch.clientX - resizeStart.x;
      const deltaY = touch.clientY - resizeStart.y;
      const newDimension = Math.max(sticker.width + deltaX, sticker.height + deltaY);

      setStickers((prevStickers) =>
        prevStickers.map((s) =>
          s.id === currentSticker
            ? { ...s, width: newDimension, height: newDimension }
            : s
        )
      );

      setResizeStart({ x: touch.clientX, y: touch.clientY });
    } else if (dragging) {
      const touch = e.touches[0];
      const rect = imageRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left - dragOffset.x;
      const y = touch.clientY - rect.top - dragOffset.y;
      setStickers((prevStickers) =>
        prevStickers.map((sticker) =>
          sticker.id === currentSticker ? { ...sticker, x, y } : sticker
        )
      );
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setResizing(false);
    setCurrentSticker(null);
  };

  const drawStickers = (context, scale) => {
    return Promise.all(
      stickers.map((sticker) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = sticker.src;
          img.onload = () => {
            context.drawImage(
              img,
              sticker.x * scale,
              sticker.y * scale,
              sticker.width * scale,
              sticker.height * scale
            );
            resolve();
          };
        })
      })
    );
  };

  const prepareImageForSaving = async () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const scale = Math.min(scaleX, scaleY);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    await drawStickers(context, scale);

    return canvas.toDataURL('image/png');
  };

  const handleFinish = async () => {
    const imageUrl = await prepareImageForSaving();
    navigate('/save', { state: { imageUrl } });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const stickerCategory = [
    '/images/sticker1.png',
    '/images/sticker2.png',
    '/images/sticker1.png',
    '/images/sticker2.png',
    '/images/sticker1.png',
  ];

  // 스티커 카테고리
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleStickerClick = (index) => {
    setSelectedCategory(index);
  };

  return (
    <div
      className="decorate-view"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="photo-area" style={{ position: 'relative' }}>
        {capturedImage && (
          <img ref={imageRef} src={capturedImage} alt="Captured" />
        )}
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            style={{
              position: 'absolute',
              left: sticker.x,
              top: sticker.y,
              cursor: 'grab',
              userSelect: 'none',
              width: sticker.width,
              height: sticker.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, sticker)}
            onTouchStart={(e) => handleTouchStart(e, sticker)}
          >
            <img
              src={sticker.src}
              alt="sticker"
              style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            />
            <button
              className="delete-button"
              onClick={() => removeSticker(sticker.id)}
            >
              ×
            </button>
            {/* 크기 조절 핸들 */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '15px',
                height: '15px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                cursor: 'nwse-resize',
              }}
              onMouseDown={(e) => handleMouseDown(e, sticker, 'resize')}
              onTouchStart={(e) => handleTouchStart(e, sticker, 'resize')}
            />
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={handleFinish}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
          }}
        >
          <img
            src={'/images/done.png'}
            alt="Finish"
            style={{ width: '50px', height: 'auto' }}
          />
        </button>
      </div>

      <div className={`modal-container ${isModalOpen ? 'open' : ''}`}>
        
      <div className="modal">
  <div className="sticker-list">
    {stickerCategory.map((src, index) => (
      <div
        className="sticker-choose"
        key={index}
        draggable="false"  // 드래그 금지 설정
        onDragStart={(e) => e.preventDefault()}  // 드래그 이벤트를 막습니다
        onClick={() => handleStickerClick(index)}  // 클릭시 스티커 선택 함수 호출
        style={{ backgroundColor: selectedCategory === index ? '#8F6CF0' : '#271F3D' }}
      >
        <img
          src={src}
          className="sticker-cat"
          alt={`sticker-${index}`}
          onClick={(e) => {
            e.stopPropagation();  // 상위 요소로의 이벤트 전파를 중지
            addSticker(src);  // 스티커 추가 함수 호출
          }}
        />
      </div>
    ))}
  </div>
  <StickerPanel selectedCategory={selectedCategory} onSelect={addSticker} />
</div>

        <button className="toggle-modal-button" onClick={toggleModal}>
          <img
            src={isModalOpen ? '/images/ChevronDown.png' : '/images/chevronUp.png'}
            alt="Toggle"
            className="updown-img"
          />
        </button>
      </div>
    </div>
  );
}

export default DecoView;
