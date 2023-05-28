import { useRef, useState } from 'react';
import Icons from './icons';
import JobCard from './jobCard';

export default function JobSearch({
  jobs,
  setCreateNewEntry,
  setButtonsVisible,
  setCardVisible,
}) {
  const icons = Icons();
  const [searchList, setSearchList] = useState([]);
  const searchInput = useRef();

  return (
    <div className="sticky left-0 flex bg-neutral-700  dark:bg-indigo-500 border-b-2 border-b-neutral-900 dark:border-b-indigo-50 z-50">
      {searchList.length > 0 ? (
        <div className="fixed bottom-[74px] left-0 bg dark:bg-indigo-900/80 bg-neutral-500/80 h-full p-4 pt-[90px] flex flex-col-reverse gap-y-4 overflow-x-auto max-w-screen">
          {searchList
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
            ))}
        </div>
      ) : null}
      <input
        ref={searchInput}
        onChange={(event) => {
          const text = event.target.value.toLowerCase().trim();
          if (text.length > 2) {
            const search = jobs.filter((value) =>
              value.company.toLowerCase().trim().includes(text),
            );
            setSearchList(
              search.sort((a, b) => a.company.length - b.company.length),
            );
          }
        }}
        className="text-right w-full bg-transparent px-2 py-1 dark:placeholder-black dark:text-black text-white"
        placeholder="Search by Company.."
      ></input>
      <button
        onClick={() => {
          setSearchList([]);
          searchInput.current.value = '';
        }}
        className="px-1 fill-white dark:fill-black"
      >
        {icons.cancelSearch}
      </button>
    </div>
  );
}
