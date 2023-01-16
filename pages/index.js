import Head from 'next/head';

export default function Home() {
  async function getData() {
    const sqlData = await fetch(`/api/hello`);
    const json = await sqlData.json();
    console.table(json);
  }

  return (
    <>
      <Head>
        <title>Job Application Manager</title>
        <meta name="description" content="Job Application Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col-reverse h-screen">
          <nav className="overflow-x-auto bg-green-400 h-[43px]">
            <ul className="flex h-fit">
              <li className="px-4 py-2 hover:bg-white/30">Wishlist</li>
              <li className="px-4 py-2 hover:bg-white/30">Applied</li>
              <li className="px-4 py-2 hover:bg-white/30">Rejected</li>
              <li className="px-4 py-2 hover:bg-white/30">Interview</li>
              <li className="px-4 py-2 hover:bg-white/30">Pending</li>
              <li className="px-4 py-2 hover:bg-white/30">Offer</li>
            </ul>
          </nav>
        </div>
      </main>
    </>
  );
}
