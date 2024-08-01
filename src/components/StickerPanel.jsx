import React from 'react';

// function StickerPanel({ onSelect }) {
function StickerPanel({ selectedCategory, onSelect }) {
  const stickerCategories = [
    ["/images/sticker1.png",
      "/images/sticker2.png",
      "/images/redHeart2.png",
      "/images/pinkHeart2.png"],
    ["/images/purpleHeart.png",
      "/images/fireHeart.png"],
    ["/images/redHeart.png",
      "/images/sparkleHeart.png"],
    ["/images/redHeart2.png",
      "/images/pinkHeart2.png"],
    ["/images/greenHeart.png",
      "/images/yellowHeart.png"],
    ["/images/whiteHeart.png",
      "/images/greyHeart.png"],
    ["/images/blackHeart.png",
      "/images/orangeHeart.png",]

    // 다른 스티커들 추가하면 됨(위의 형태로 집어넣어야됨-폴더 구조상)
  ];
  const stickers = stickerCategories[selectedCategory] || [];

  const handleDragStart = (e, src) => {
    e.dataTransfer.setData("text", src);
  };

  return (
    <div className="sticker-panel">
      {stickers.map((src, index) => (
        <img
          key={index}
          src={src}
          className='sticker-one'
          alt="sticker"
          draggable
          onDragStart={(e) => handleDragStart(e, src)}
        />
      ))}
    </div>
  );
}

export default StickerPanel;
//이 페이지에 부족한 점 젼이의 피그마 참고하면 위로 스크롤되는 형식으로 기능 추가해야됨