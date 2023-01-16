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
        <div>
          <button onClick={getData}>Get Data</button>
        </div>
      </main>
    </>
  );
}
