import { useState, useEffect } from 'react';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const getImages = (dir) => {
    return fs.readdirSync(path.join(process.cwd(), 'public', dir))
      .filter((file) => /\.(jpeg|jpg|png|gif|webp)$/i.test(file))
      .map((file) => path.join(dir, file));
  };

  const tops = getImages('tops');
  const bottoms = getImages('bottoms');
  const socks = getImages('socks');
  const shoes = getImages('shoes');

  return {
    props: {
      tops,
      bottoms,
      socks,
      shoes,
    },
  };
}

export default function Home({ tops, bottoms, socks, shoes }) {
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [sockIndex, setSockIndex] = useState(0);
  const [shoeIndex, setShoeIndex] = useState(0);

  const [topTransform, setTopTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [bottomTransform, setBottomTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [sockTransform, setSockTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [shoeTransform, setShoeTransform] = useState({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        // Load customizations for the current top image
        let response = await fetch(`/tops/${tops[topIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setTopTransform(data || { scale: 1, x: 0, y: 0 });
        }

        // Load customizations for the current bottom image
        response = await fetch(`/bottoms/${bottoms[bottomIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setBottomTransform(data || { scale: 1, x: 0, y: 0 });
        }

        // Load customizations for the current sock image
        response = await fetch(`/socks/${socks[sockIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setSockTransform(data || { scale: 1, x: 0, y: 0 });
        }

        // Load customizations for the current shoe image
        response = await fetch(`/shoes/${shoes[shoeIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setShoeTransform(data || { scale: 1, x: 0, y: 0 });
        }
      } catch (error) {
        console.error('Failed to load customizations:', error);
      }
    };
    loadCustomizations();
  }, [topIndex, bottomIndex, sockIndex, shoeIndex]);

  const saveCustomization = async () => {
    try {
      // Save customization for the top image
      let filename = `tops/${tops[topIndex].replace(/\.[^/.]+$/, "")}.json`;
      let response = await fetch('/api/saveCustomization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          customizations: topTransform,
        }),
      });

      // Save customization for the bottom image
      filename = `bottoms/${bottoms[bottomIndex].replace(/\.[^/.]+$/, "")}.json`;
      response = await fetch('/api/saveCustomization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          customizations: bottomTransform,
        }),
      });

      // Save customization for the sock image
      filename = `socks/${socks[sockIndex].replace(/\.[^/.]+$/, "")}.json`;
      response = await fetch('/api/saveCustomization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          customizations: sockTransform,
        }),
      });

      // Save customization for the shoe image
      filename = `shoes/${shoes[shoeIndex].replace(/\.[^/.]+$/, "")}.json`;
      response = await fetch('/api/saveCustomization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          customizations: shoeTransform,
        }),
      });

      if (response.ok) {
        alert('Customizations saved!');
      } else {
        alert('Failed to save customizations.');
      }
    } catch (error) {
      console.error('Failed to save customizations:', error);
    }
  };

  const handleNext = (type) => {
    switch (type) {
      case 'top':
        setTopIndex((prev) => (prev + 1) % tops.length);
        break;
      case 'bottom':
        setBottomIndex((prev) => (prev + 1) % bottoms.length);
        break;
      case 'sock':
        setSockIndex((prev) => (prev + 1) % socks.length);
        break;
      case 'shoe':
        setShoeIndex((prev) => (prev + 1) % shoes.length);
        break;
    }
  };

  const handlePrevious = (type) => {
    switch (type) {
      case 'top':
        setTopIndex((prev) => (prev - 1 + tops.length) % tops.length);
        break;
      case 'bottom':
        setBottomIndex((prev) => (prev - 1 + bottoms.length) % bottoms.length);
        break;
      case 'sock':
        setSockIndex((prev) => (prev - 1 + socks.length) % socks.length);
        break;
      case 'shoe':
        setShoeIndex((prev) => (prev - 1 + shoes.length) % shoes.length);
        break;
    }
  };

  const handleTransform = (type, action) => {
    const updateTransform = (transform, action) => {
      switch (action) {
        case 'increase':
          return { ...transform, scale: transform.scale + 0.1 };
        case 'decrease':
          return { ...transform, scale: Math.max(0.1, transform.scale - 0.1) };
        case 'moveLeft':
          return { ...transform, x: transform.x - 10 };
        case 'moveRight':
          return { ...transform, x: transform.x + 10 };
        case 'moveUp':
          return { ...transform, y: transform.y - 10 };
        case 'moveDown':
          return { ...transform, y: transform.y + 10 };
        default:
          return transform;
      }
    };

    switch (type) {
      case 'top':
        setTopTransform((prev) => updateTransform(prev, action));
        break;
      case 'bottom':
        setBottomTransform((prev) => updateTransform(prev, action));
        break;
      case 'sock':
        setSockTransform((prev) => updateTransform(prev, action));
        break;
      case 'shoe':
        setShoeTransform((prev) => updateTransform(prev, action));
        break;
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Character Creation</h1>
      <div style={{ position: 'relative', width: '300px', height: '500px', margin: '0 auto' }}>
        <Image 
          src={`/${tops[topIndex]}`} 
          alt="Top" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{
            objectFit: 'contain',
            transform: `translate(${topTransform.x}px, ${topTransform.y}px) scale(${topTransform.scale})`,
            zIndex: 4,
          }} 
        />
        <Image 
          src={`/${bottoms[bottomIndex]}`} 
          alt="Bottom" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{
            objectFit: 'contain',
            transform: `translate(${bottomTransform.x}px, ${bottomTransform.y}px) scale(${bottomTransform.scale})`,
            zIndex: 3,
          }} 
        />
        <Image 
          src={`/${socks[sockIndex]}`} 
          alt="Sock" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{
            objectFit: 'contain',
            transform: `translate(${sockTransform.x}px, ${sockTransform.y}px) scale(${sockTransform.scale})`,
            zIndex: 2,
          }} 
        />
        <Image 
          src={`/${shoes[shoeIndex]}`} 
          alt="Shoe" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{
            objectFit: 'contain',
            transform: `translate(${shoeTransform.x}px, ${shoeTransform.y}px) scale(${shoeTransform.scale})`,
            zIndex: 1,
          }} 
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Tops</h2>
        <button onClick={() => handlePrevious('top')}>Previous</button>
        <button onClick={() => handleNext('top')}>Next</button>
        <div>
          <button onClick={() => handleTransform('top', 'increase')}>Larger</button>
          <button onClick={() => handleTransform('top', 'decrease')}>Smaller</button>
          <button onClick={() => handleTransform('top', 'moveLeft')}>Move Left</button>
          <button onClick={() => handleTransform('top', 'moveRight')}>Move Right</button>
          <button onClick={() => handleTransform('top', 'moveUp')}>Move Up</button>
          <button onClick={() => handleTransform('top', 'moveDown')}>Move Down</button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Bottoms</h2>
        <button onClick={() => handlePrevious('bottom')}>Previous</button>
        <button onClick={() => handleNext('bottom')}>Next</button>
        <div>
          <button onClick={() => handleTransform('bottom', 'increase')}>Larger</button>
          <button onClick={() => handleTransform('bottom', 'decrease')}>Smaller</button>
          <button onClick={() => handleTransform('bottom', 'moveLeft')}>Move Left</button>
          <button onClick={() => handleTransform('bottom', 'moveRight')}>Move Right</button>
          <button onClick={() => handleTransform('bottom', 'moveUp')}>Move Up</button>
          <button onClick={() => handleTransform('bottom', 'moveDown')}>Move Down</button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Socks</h2>
        <button onClick={() => handlePrevious('sock')}>Previous</button>
        <button onClick={() => handleNext('sock')}>Next</button>
        <div>
          <button onClick={() => handleTransform('sock', 'increase')}>Larger</button>
          <button onClick={() => handleTransform('sock', 'decrease')}>Smaller</button>
          <button onClick={() => handleTransform('sock', 'moveLeft')}>Move Left</button>
          <button onClick={() => handleTransform('sock', 'moveRight')}>Move Right</button>
          <button onClick={() => handleTransform('sock', 'moveUp')}>Move Up</button>
          <button onClick={() => handleTransform('sock', 'moveDown')}>Move Down</button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Shoes</h2>
        <button onClick={() => handlePrevious('shoe')}>Previous</button>
        <button onClick={() => handleNext('shoe')}>Next</button>
        <div>
          <button onClick={() => handleTransform('shoe', 'increase')}>Larger</button>
          <button onClick={() => handleTransform('shoe', 'decrease')}>Smaller</button>
          <button onClick={() => handleTransform('shoe', 'moveLeft')}>Move Left</button>
          <button onClick={() => handleTransform('shoe', 'moveRight')}>Move Right</button>
          <button onClick={() => handleTransform('shoe', 'moveUp')}>Move Up</button>
          <button onClick={() => handleTransform('shoe', 'moveDown')}>Move Down</button>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <button onClick={saveCustomization}>Save Customization</button>
      </div>
    </div>
  );
}
