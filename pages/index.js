import JobCard from '@/components/jobCard';
import NewEntry from '@/components/newEntry';
import ToggleNewButtons from '@/components/toggleNewButtons';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  async function getData() {
    const link = `/api/getEntries`;
    const response = await fetch(link);
    const json = await response.json();
    return json;
  }

  function updateJobs() {
    getData().then((result) => {
      setJobs(result.rows);
      console.log(result.rows);
    });
  }

  useEffect(() => {
    getData().then((result) => {
      setJobs(result.rows);
    });
  }, []);

  const [createNewEntry, setCreateNewEntry] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [cardVisible, setCardVisible] = useState();
  const [jobs, setJobs] = useState([]);

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
              <li className="px-4 py-2 hover:bg-white/30">Resumes</li>
              <li className="px-4 py-2 hover:bg-white/30">Wishlist</li>
              <li className="px-4 py-2 hover:bg-white/30">Applied</li>
              <li className="px-4 py-2 hover:bg-white/30">Rejected</li>
              <li className="px-4 py-2 hover:bg-white/30">Interview</li>
              <li className="px-4 py-2 hover:bg-white/30">Pending</li>
              <li className="px-4 py-2 hover:bg-white/30">Offer</li>
            </ul>
          </nav>
          <div className="flex flex-col h-full bg-purple-300 p-4 gap-y-4 overflow-x-auto max-w-screen">
            {jobs.length > 0
              ? jobs
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(({ id, company, position, createdAt }) => (
                    <JobCard
                      key={id}
                      company={company}
                      position={position}
                      createdAt={createdAt}
                      id={id}
                      setCreateNewEntry={setCreateNewEntry}
                      setButtonsVisible={setButtonsVisible}
                      setCardVisible={setCardVisible}
                    />
                  ))
              : null}
          </div>
        </div>
        {createNewEntry ? (
          <NewEntry
            setCreateNewEntry={setCreateNewEntry}
            setButtonsVisible={setButtonsVisible}
            cardVisible={cardVisible}
            setCardVisible={setCardVisible}
            updateJobs={updateJobs}
          />
        ) : null}
        {buttonsVisible ? (
          <ToggleNewButtons
            setCreateNewEntry={setCreateNewEntry}
            setButtonsVisible={setButtonsVisible}
          />
        ) : null}
      </main>
    </>
  );
}
