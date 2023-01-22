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

  async function updateJobs(id, jobData, update) {
    const arrayOfJobs = structuredClone(jobs);
    if (update) {
      const newJobList = arrayOfJobs.map((job) => {
        if (job.id === id) {
          jobData.createdAt = job.createdAt;
          jobData.id = id;
          return jobData;
        }
        return job;
      });
      setJobs(newJobList);
    } else {
      if (jobData) {
        arrayOfJobs.push(jobData);
        setJobs(arrayOfJobs);
      } else {
        const newJobList = arrayOfJobs.filter((job) => job.id !== id);
        setJobs(newJobList);
      }
    }
  }

  function filterJobs(event) {
    const filter = event.target.textContent;
    const arrayOfJobs = structuredClone(jobs);
    const filteredList = arrayOfJobs.filter((job) => {
      if (job.status === filter) {
        return job;
      }
    });
    setFilteredJobs(filteredList);
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
  const [filteredJobs, setFilteredJobs] = useState([]);

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
              <li onClick={filterJobs} className="px-4 py-2 hover:bg-white/30">
                Wishlist
              </li>
              <li onClick={filterJobs} className="px-4 py-2 hover:bg-white/30">
                Applied
              </li>
              <li onClick={filterJobs} className="px-4 py-2 hover:bg-white/30">
                Rejected
              </li>
              <li onClick={filterJobs} className="px-4 py-2 hover:bg-white/30">
                Interview
              </li>
              <li onClick={filterJobs} className="px-4 py-2 hover:bg-white/30">
                Pending
              </li>
              <li onClick={filterJobs} className="px-4 py-2 hover:bg-white/30">
                Offer
              </li>
            </ul>
          </nav>
          <div className="flex flex-col h-full bg-purple-300 p-4 gap-y-4 overflow-x-auto max-w-screen">
            {jobs.length > 0 && filteredJobs.length === 0
              ? jobs
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((job) => (
                    <JobCard
                      key={job.id || job.createdAt}
                      company={job.company}
                      position={job.position}
                      createdAt={job.createdAt}
                      job={job}
                      setCreateNewEntry={setCreateNewEntry}
                      setButtonsVisible={setButtonsVisible}
                      setCardVisible={setCardVisible}
                    />
                  ))
              : null}
            {filteredJobs.length > 0
              ? filteredJobs
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((job) => (
                    <JobCard
                      key={job.id || job.createdAt}
                      company={job.company}
                      position={job.position}
                      createdAt={job.createdAt}
                      job={job}
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
