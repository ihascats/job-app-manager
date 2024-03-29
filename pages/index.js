import DesktopNav from '@/components/desktopNav';
import Icons from '@/components/icons';
import JobCard from '@/components/jobCard';
import JobSearch from '@/components/jobSearch';
import NavItems from '@/components/navItems';
import NewEntry from '@/components/newEntry';
import ResumeCard from '@/components/resumeCard';
import Settings from '@/components/settings';
import SignInButtons from '@/components/signInButtons';
import ToggleNewButtons from '@/components/toggleNewButtons';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const statusList = [
    'Applied',
    'Wishlist',
    'Rejected',
    'Interview',
    'Pending',
    'Offer',
  ];
  const [jobs, setJobs] = useState();
  const [resumeList, setResumeList] = useState([]);
  const [createNewEntry, setCreateNewEntry] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [cardVisible, setCardVisible] = useState();
  const [filter, setFilter] = useState();
  const [sortedJobs, setSortedJobs] = useState();
  const [desktopJobsFilter, setDesktopJobsFilter] = useState();
  const [darkTheme, setDarkTheme] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

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
    const link = `/api/${session.user.email}/getEntries`;
    const response = await fetch(link);
    const json = await response.json();
    return json;
  }

  async function getResumes() {
    const link = `/api/${session.user.email}/getResumes`;
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
    if (localStorage.dark)
      setDarkTheme(localStorage.dark === 'true' ? true : false);
  }, []);

  useEffect(() => {
    // fetch all the job entries from api/getEntries then set jobs to the result
    if (session) {
      getData().then((result) => {
        setJobs(result.rows);
      });

      getResumeList();
    }
  }, [session]);

  // mobile switch
  const [mobile, setMobile] = useState(false);

  function screenWidth(event) {
    setMobile(event.target.innerWidth <= 768);
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', screenWidth);
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

    if (jobs) {
      const filterSortedJobs = sortJobs(statusList);
      setSortedJobs(filterSortedJobs);
      setDesktopJobsFilter(filterSortedJobs);
      setLoading(false);
    }
  }, [jobs]);

  const icons = Icons();

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
  if (loading) {
    return (
      <>
        <Head>
          <title>Job Application Manager</title>
          <meta name="description" content="Job Application Manager" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="bg-gradient-to-br from-neutral-800 to-indigo-600 flex flex-col items-center justify-center gap-4 z-50 w-screen h-screen fill-white text-white">
            {icons.loading}
            <p className="font-mono">Loading information..</p>
          </div>
        </main>
      </>
    );
  }
  if (mobile) {
    return (
      <>
        <Head>
          <title>Job Application Manager</title>
          <meta name="description" content="Job Application Manager" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={
            localStorage.dark === 'true' ? 'dark' : darkTheme ? 'dark' : null
          }
        >
          <div className="flex flex-col-reverse h-screen">
            <nav className="z-50 overflow-x-auto bg-indigo-300 dark:bg-neutral-800 dark:text-indigo-400 min-h-[74px] flex flex-col-reverse">
              <ul className="flex h-fit">
                <li
                  onClick={resumeList ? filterJobs : null}
                  data-filter="resumes"
                  className={`px-4 py-2 ${
                    resumeList.length > 0
                      ? 'hover:bg-white/30'
                      : 'bg-black/20 text-black/60 dark:text-green-400/60'
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
                      : 'bg-black/20 text-black/60 dark:text-green-400/60'
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
                <Settings
                  setButtonsVisible={setButtonsVisible}
                  setDarkTheme={setDarkTheme}
                  buttonsVisible={buttonsVisible}
                />
              </ul>
              <JobSearch
                jobs={jobs}
                setCreateNewEntry={setCreateNewEntry}
                setButtonsVisible={setButtonsVisible}
                setCardVisible={setCardVisible}
              />
            </nav>
            <div className="flex flex-col-reverse h-full bg-gradient-to-br from-neutral-600 to-indigo-500 dark:from-neutral-900 dark:to-indigo-700 p-4 gap-y-4 overflow-x-auto max-w-screen items-center">
              {jobs.length > 0 && !filter
                ? jobs
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
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
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
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
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
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
              statusList={statusList}
              resumeList={resumeList}
            />
          ) : null}
          {buttonsVisible ? (
            <ToggleNewButtons
              setCreateNewEntry={setCreateNewEntry}
              setButtonsVisible={setButtonsVisible}
              getResumeList={getResumeList}
              resumeList={resumeList}
            />
          ) : null}
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
      <main
        className={
          localStorage.dark === 'true' ? 'dark' : darkTheme ? 'dark' : null
        }
      >
        <div className="flex flex-col h-screen">
          <DesktopNav
            jobs={jobs}
            setCreateNewEntry={setCreateNewEntry}
            getResumeList={getResumeList}
            setDarkTheme={setDarkTheme}
            desktopJobsFilter={desktopJobsFilter}
            setDesktopJobsFilter={setDesktopJobsFilter}
            statusList={statusList}
            sortedJobs={sortedJobs}
            resumeList={resumeList}
          />
          <div className="flex h-full bg-gradient-to-br from-neutral-600 to-indigo-500 dark:from-neutral-900 dark:to-indigo-700 pb-0 gap-x-4 overflow-x-scroll max-w-screen pt-4 hide-scroll">
            <div className="h-full min-w-[300px] overflow-y-auto hide-scroll gap-3 flex flex-col px-4 pb-4">
              <h1 className="sticky top-0 bg-indigo-200 dark:bg-indigo-500 dark:text-neutral-50 text-center p-1 font-bold tracking-widest z-50 flex justify-center gap-1">
                resumes
                <p className="text-sm">
                  {resumeList ? resumeList.length : '0'}
                </p>
              </h1>
              {resumeList
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((resume) => (
                  <ResumeCard
                    key={resume.name}
                    resume={resume}
                    getResumeList={getResumeList}
                  />
                ))}
            </div>
            {statusList.map((status) => (
              <div
                key={status.toLowerCase()}
                className="h-full min-w-[300px] overflow-y-auto hide-scroll gap-3 flex flex-col px-4 pb-4"
              >
                <h1 className="sticky top-0 bg-indigo-200 dark:bg-indigo-500 dark:text-neutral-50 text-center p-1 font-bold tracking-widest z-50 flex justify-center gap-1">
                  {status.toLowerCase()}
                  <p className="text-sm">
                    {sortedJobs ? sortedJobs[status.toLowerCase()].length : '0'}
                  </p>
                </h1>
                {desktopJobsFilter
                  ? desktopJobsFilter[status.toLowerCase()]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                      )
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
            ))}
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
            statusList={statusList}
            resumeList={resumeList}
          />
        ) : null}
      </main>
    </>
  );
}
