import { useState } from 'react';

export default function ImageAdjuster({ imageSrc }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="image-adjuster">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          backgroundImage: `url(${imageSrc})`,
        }}
        className="adjustable-image"
        draggable
        onDrag={handleDrag}
      />
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.01"
        value={scale}
        onChange={(e) => setScale(e.target.value)}
      />
    </div>
  );
}
