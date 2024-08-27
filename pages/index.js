import Head from 'next/head';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Silhouette from '@components/home/Silhouette';
import Carousel from '@components/home/Carousel';

export default function Home() {
  // Dummy data; replace with dynamic content from API or file system
  const tops = [{ src: '/tops/top1.jpg', x: 0, y: 0, scale: 1 }];
  const bottoms = [{ src: '/bottoms/bottom1.jpg', x: 0, y: 0, scale: 1 }];
  const socks = [{ src: '/socks/sock1.jpg', x: 0, y: 0, scale: 1 }];
  const shoes = [{ src: '/shoes/shoe1.jpg', x: 0, y: 0, scale: 1 }];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <Head>
        <title>Outfit Customizer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="Customize Your Outfit!" />

      <main className="flex flex-col justify-center items-center py-20">
        <Silhouette>
          <Carousel items={tops} clothingType="Tops" />
          <Carousel items={bottoms} clothingType="Bottoms" />
          <Carousel items={socks} clothingType="Socks" />
          <Carousel items={shoes} clothingType="Shoes" />
        </Silhouette>
      </main>

      <Footer />
    </div>
  );
}
