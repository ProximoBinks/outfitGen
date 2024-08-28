import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Head from 'next/head';

export async function getStaticProps() {
  const fetchImagesFromCloudinary = async (folder) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`;
    const params = {
      prefix: folder,
      type: 'upload',
      max_results: 100,
    };

    const response = await axios.get(url, {
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET,
      },
      params,
    });

    return response.data.resources.map((resource) => resource.secure_url);
  };

  const tops = await fetchImagesFromCloudinary('tops');
  const bottoms = await fetchImagesFromCloudinary('bottoms');
  const socks = await fetchImagesFromCloudinary('socks');
  const shoes = await fetchImagesFromCloudinary('shoes');

  return {
    props: {
      tops,
      bottoms,
      socks,
      shoes,
    },
    revalidate: 60, // Revalidate every 60 seconds
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
        let response = await fetch(`/tops/${tops[topIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setTopTransform(data || { scale: 1, x: 0, y: 0 });
        } else {
          setTopTransform({ scale: 1, x: 0, y: 0 });
        }

        response = await fetch(`/bottoms/${bottoms[bottomIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setBottomTransform(data || { scale: 1, x: 0, y: 0 });
        } else {
          setBottomTransform({ scale: 1, x: 0, y: 0 });
        }

        response = await fetch(`/socks/${socks[sockIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setSockTransform(data || { scale: 1, x: 0, y: 0 });
        } else {
          setSockTransform({ scale: 1, x: 0, y: 0 });
        }

        response = await fetch(`/shoes/${shoes[shoeIndex].replace(/\.[^/.]+$/, "")}.json`);
        if (response.ok) {
          const data = await response.json();
          setShoeTransform(data || { scale: 1, x: 0, y: 0 });
        } else {
          setShoeTransform({ scale: 1, x: 0, y: 0 });
        }
      } catch (error) {
        console.error('Error loading customizations:', error);
      }
    };
    loadCustomizations();
  }, [topIndex, bottomIndex, sockIndex, shoeIndex]);

  const saveCustomization = async () => {
    try {
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
          return { ...transform, x: transform.x - 5 };
        case 'moveRight':
          return { ...transform, x: transform.x + 5 };
        case 'moveUp':
          return { ...transform, y: transform.y - 5 };
        case 'moveDown':
          return { ...transform, y: transform.y + 5 };
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

  const randomizeOutfit = () => {
    setTopIndex(Math.floor(Math.random() * tops.length));
    setBottomIndex(Math.floor(Math.random() * bottoms.length));
    setSockIndex(Math.floor(Math.random() * socks.length));
    setShoeIndex(Math.floor(Math.random() * shoes.length));
  };

  return (
    
    <div className="mt-2 mb-4 text-center">
      <Head>
        <title>Home — Outfit Gen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Elliot Koh" />
        <meta name="description" content="Outfit Gen made by Elliot" />
      </Head>
      <h1 className="font-bold">Outfit Gen</h1>
      
      <div className="mt-4">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold mb-4"
          onClick={randomizeOutfit}
        >
          Randomize Outfit
        </button>
      </div>

      <div className="relative w-[300px] h-[500px] mx-auto z-10">
        <Image 
          src={tops[topIndex]} 
          alt="Top" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-contain"
          style={{
            transform: `translate(${topTransform.x}px, ${topTransform.y}px) scale(${topTransform.scale})`,
            zIndex: 4,
          }} 
        />
        <Image 
          src={bottoms[bottomIndex]} 
          alt="Bottom" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-contain"
          style={{
            transform: `translate(${bottomTransform.x}px, ${bottomTransform.y}px) scale(${bottomTransform.scale})`,
            zIndex: 3,
          }} 
        />
        <Image 
          src={socks[sockIndex]} 
          alt="Sock" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-contain"
          style={{
            transform: `translate(${sockTransform.x}px, ${sockTransform.y}px) scale(${sockTransform.scale})`,
            zIndex: 2,
          }} 
        />
        <Image 
          src={shoes[shoeIndex]} 
          alt="Shoe" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-contain"
          style={{
            transform: `translate(${shoeTransform.x}px, ${shoeTransform.y}px) scale(${shoeTransform.scale})`,
            zIndex: 1,
          }} 
        />
      </div>

      <div className="mt-[-150px]">
        <div className="relative mt-5 z-20">
          <h2 className="font-bold">Tops</h2>
          <button className="px-1" onClick={() => handlePrevious('top')}>Previous</button>
          <button className="px-1" onClick={() => handleNext('top')}>Next</button>
          <div className="flex gap-2 items-center justify-center w-full">
            <button onClick={() => handleTransform('top', 'increase')}>Larger</button>
            <button onClick={() => handleTransform('top', 'decrease')}>Smaller</button>
            <button onClick={() => handleTransform('top', 'moveLeft')}>Left</button>
            <button onClick={() => handleTransform('top', 'moveRight')}>Right</button>
            <button onClick={() => handleTransform('top', 'moveUp')}>Up</button>
            <button onClick={() => handleTransform('top', 'moveDown')}>Down</button>
          </div>
        </div>

        <div className="mt-5 relative z-20">
          <h2 className="font-bold">Bottoms</h2>
          <button className="px-1" onClick={() => handlePrevious('bottom')}>Previous</button>
          <button className="px-1" onClick={() => handleNext('bottom')}>Next</button>
          <div className="flex gap-2 items-center justify-center w-full">
            <button onClick={() => handleTransform('bottom', 'increase')}>Larger</button>
            <button onClick={() => handleTransform('bottom', 'decrease')}>Smaller</button>
            <button onClick={() => handleTransform('bottom', 'moveLeft')}>Left</button>
            <button onClick={() => handleTransform('bottom', 'moveRight')}>Right</button>
            <button onClick={() => handleTransform('bottom', 'moveUp')}>Up</button>
            <button onClick={() => handleTransform('bottom', 'moveDown')}>Down</button>
          </div>
        </div>

        <div className="mt-5 relative z-20">
          <h2 className="font-bold">Socks</h2>
          <button className="px-1" onClick={() => handlePrevious('sock')}>Previous</button>
          <button className="px-1" onClick={() => handleNext('sock')}>Next</button>
          <div className="flex gap-2 items-center justify-center w-full">
            <button onClick={() => handleTransform('sock', 'increase')}>Larger</button>
            <button onClick={() => handleTransform('sock', 'decrease')}>Smaller</button>
            <button onClick={() => handleTransform('sock', 'moveLeft')}>Left</button>
            <button onClick={() => handleTransform('sock', 'moveRight')}>Right</button>
            <button onClick={() => handleTransform('sock', 'moveUp')}>Up</button>
            <button onClick={() => handleTransform('sock', 'moveDown')}>Down</button>
          </div>
        </div>

        <div className="mt-5 relative z-20">
          <h2 className="font-bold">Shoes</h2>
          <button className="px-1" onClick={() => handlePrevious('shoe')}>Previous</button>
          <button className="px-1" onClick={() => handleNext('shoe')}>Next</button>
          <div className="flex gap-2 items-center justify-center w-full">
            <button onClick={() => handleTransform('shoe', 'increase')}>Larger</button>
            <button onClick={() => handleTransform('shoe', 'decrease')}>Smaller</button>
            <button onClick={() => handleTransform('shoe', 'moveLeft')}>Left</button>
            <button onClick={() => handleTransform('shoe', 'moveRight')}>Right</button>
            <button onClick={() => handleTransform('shoe', 'moveUp')}>Up</button>
            <button onClick={() => handleTransform('shoe', 'moveDown')}>Down</button>
          </div>
        </div>

        <div className="mt-10 relative z-20">
          <button className="bg-blue-500 px-2 py-1 rounded-xl text-white font-bold" onClick={saveCustomization}>
            Save Customisation
          </button>
        </div>
      </div>
      <footer className="mt-6 w-full flex items-center justify-center">&copy; Elliot Koh 2024</footer>
    </div>
  );
}
