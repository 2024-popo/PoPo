import React from 'react';
import '../asset/DecoView.scss';

function StickerPanel({ selectedCategory, onSelect }) {
  const stickerCategories = [
    [
      "/images/Shape/Shape1.png",
      "/images/Shape/Shape2.png",
      "/images/Shape/Shape3.png",
      "/images/Shape/Shape4.png",
      "/images/Shape/Shape5.png",
      "/images/Shape/Shape6.png",
      "/images/Shape/Shape7.png",
      "/images/Shape/Shape8.png",
      "/images/Shape/Shape9.png",
      "/images/Shape/Shape10.png",
      "/images/Shape/Shape11.png",
      "/images/Shape/Shape12.png",
      "/images/Shape/Shape13.png",
      "/images/Shape/Shape14.png",
      "/images/Shape/Shape15.png",
    ],
    [
      "/images/Face/Face1.png",
      "/images/Face/Face2.png",
      "/images/Face/Face3.png",
      "/images/Face/Face4.png",
      "/images/Face/Face5.png",
      "/images/Face/Face6.png",
      "/images/Face/Face7.png",
    ],
    [
      "/images/LikeLion/LikeLion1.png",
      "/images/LikeLion/LikeLion2.png",
      "/images/LikeLion/LikeLion3.png",
      "/images/LikeLion/LikeLion4.png",
      "/images/LikeLion/LikeLion5.png",
    ],
    [
      "/images/Dev/Dev1.png",
      "/images/Dev/Dev2.png",
      "/images/Dev/Dev3.png",
      "/images/Dev/Dev4.png",
      "/images/Dev/Dev5.png",
      "/images/Dev/Dev6.png",
    ],
    [
      "/images/Etc/etc1.png",
      "/images/Etc/etc2.png",
      "/images/Etc/etc3.png",
      "/images/Etc/etc4.png",
      "/images/Etc/etc5.png",
      "/images/Etc/etc6.png",
    ]

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