import JobCard from '@/components/jobCard';
import NavItems from '@/components/navItems';
import NewEntry from '@/components/newEntry';
import ResumeCard from '@/components/resumeCard';
import SignInButtons from '@/components/signInButtons';
import ToggleNewButtons from '@/components/toggleNewButtons';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const statusList = [
    'Wishlist',
    'Applied',
    'Rejected',
    'Interview',
    'Pending',
    'Offer',
  ];
  const [jobs, setJobs] = useState([]);
  const [resumeList, setResumeList] = useState([]);
  const [createNewEntry, setCreateNewEntry] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [cardVisible, setCardVisible] = useState();
  const [filter, setFilter] = useState();
  const [sortedJobs, setSortedJobs] = useState();

  function filterJobs(event) {
    const filter = event.target.dataset.filter;
    setFilter(filter);
  }

  function getResumeList() {
    getResumes().then((res) => {
      setResumeList(res);
    });
  }

  async function getData() {
    const link = `/api/getEntries`;
    const response = await fetch(link);
    const json = await response.json();
    return json;
  }

  async function getResumes() {
    const link = `/api/getResumes`;
    const response = await fetch(link, {
      method: 'GET',
    });
    const json = await response.json();
    return json.resumes;
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

  useEffect(() => {
    // fetch all the job entries from api/getEntries then set jobs to the result
    getData().then((result) => {
      setJobs(result.rows);
    });

    getResumeList();
  }, []);

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
      const filterSortedJobs = sortJobs(statusList);
      setSortedJobs(filterSortedJobs);
    }
  }, [jobs]);

  const { data: session } = useSession();
  console.log(session);

  if (!session) {
    return (
      <>
        <Head>
          <title>Job Application Manager</title>
          <meta name="description" content="Job Application Manager" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <SignInButtons />
        </main>
      </>
    );
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
                <p className="text-sm">{resumeList.length || '0'}</p>
              </li>
              <li
                onClick={() => {
                  setFilter();
                }}
                data-filter="resumes"
                className={`px-4 py-2 ${
                  jobs.length > 0
                    ? 'hover:bg-white/30'
                    : 'bg-black/20 text-black/60'
                } flex gap-1`}
              >
                All
                <p className="text-sm">{jobs.length}</p>
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
