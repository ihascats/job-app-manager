import JobCard from '@/components/jobCard';
import NavItems from '@/components/navItems';
import NewEntry from '@/components/newEntry';
import ResumeCard from '@/components/resumeCard';
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

  async function updateJobs(id, jobData) {
    const arrayOfJobs = structuredClone(jobs);
    // When saving jobs
    if (jobData) {
      arrayOfJobs.push(jobData);
      setJobs(arrayOfJobs);
    }
    // When deleting jobs (no jobData included)
    else {
      const newJobList = arrayOfJobs.filter((job) => job.id !== id);
      setJobs(newJobList);
    }
  }

  function updateEntryInfo(id, jobData) {
    const arrayOfJobs = structuredClone(jobs);
    const newJobList = arrayOfJobs.map((job) => {
      if (job.id === id) {
        jobData.createdAt = job.createdAt;
        jobData.id = id;
        return jobData;
      }
      return job;
    });
    setJobs(newJobList);
  }

  function filterJobs(event) {
    const filter = event.target.dataset.filter;
    setFilter(filter);
  }

  useEffect(() => {
    getData().then((result) => {
      setJobs(result.rows);
    });
  }, []);

  const [jobs, setJobs] = useState([]);
  const statusList = [
    'Wishlist',
    'Applied',
    'Rejected',
    'Interview',
    'Pending',
    'Offer',
  ];

  async function getResumes() {
    const link = `/api/getResumes`;
    const response = await fetch(link, {
      method: 'GET',
    });
    const json = await response.json();
    return json.resumes;
  }

  useEffect(() => {
    function sortJobs(statusList) {
      const arrayOfJobs = structuredClone(jobs);
      const obj = {};
      statusList.forEach((filter) => {
        const filteredList = arrayOfJobs.filter((job) => {
          if (job.status === filter) {
            return job;
          }
        });
        obj[filter.toLowerCase()] = filteredList;
      });
      return obj;
    }
    if (jobs.length > 0) {
      const amounts = sortJobs(statusList);
      setSortedJobs(amounts);
    }
  }, [jobs]);

  const [resumeList, setResumeList] = useState([]);
  function getResumeList() {
    getResumes().then((res) => {
      setResumeList(res);
    });
  }

  useEffect(() => {
    getResumeList();
  }, []);

  const [createNewEntry, setCreateNewEntry] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [cardVisible, setCardVisible] = useState();
  const [filter, setFilter] = useState();
  const [sortedJobs, setSortedJobs] = useState();

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
              <li
                onClick={resumeList ? filterJobs : null}
                data-filter="resumes"
                className={`px-4 py-2 ${
                  resumeList.length > 0
                    ? 'hover:bg-white/30'
                    : 'bg-black/20 text-black/60'
                } flex gap-1`}
              >
                Resumes
                <p className="text-sm">{resumeList.length}</p>
              </li>
              {statusList.map((status) => {
                return (
                  <NavItems
                    key={status}
                    status={status}
                    sortedJobs={sortedJobs}
                    filterJobs={filterJobs}
                  />
                );
              })}
            </ul>
          </nav>
          <div className="flex flex-col h-full bg-purple-300 p-4 gap-y-4 overflow-x-auto max-w-screen">
            {jobs.length > 0 && !filter
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
            {filter && filter !== 'resumes'
              ? sortedJobs[filter.toLowerCase()]
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
            {filter && filter === 'resumes' && resumeList
              ? resumeList
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((resume) => (
                    <ResumeCard
                      key={resume.name}
                      resume={resume}
                      getResumeList={getResumeList}
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
            updateEntryInfo={updateEntryInfo}
          />
        ) : null}
        {buttonsVisible ? (
          <ToggleNewButtons
            setCreateNewEntry={setCreateNewEntry}
            setButtonsVisible={setButtonsVisible}
            getResumeList={getResumeList}
          />
        ) : null}
      </main>
    </>
  );
}
