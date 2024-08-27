import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center py-20">
        <Header title="Welcome to my app!" />
        <p className="mt-4 text-lg text-gray-700">
          Get started by editing <code className="bg-gray-200 p-2 rounded">pages/index.js</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}
