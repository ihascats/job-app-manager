import { useRef } from 'react';
import Icons from './icons';
export default function DesktopJobSearch({
  desktopJobsFilter,
  setDesktopJobsFilter,
  statusList,
  sortedJobs,
}) {
  const icons = Icons();
  const searchInput = useRef();

  return (
    <div className="w-full flex dark:bg-neutral-700  bg-indigo-100 border-b-2 border-b-neutral-900 dark:border-b-green-500 z-50">
      <input
        ref={searchInput}
        onChange={(event) => {
          const text = event.target.value.toLowerCase().trim();
          const newSort = {};
          if (text.length < 3) {
            setDesktopJobsFilter(sortedJobs);
          }
          if (text.length > 2) {
            statusList.forEach((status) => {
              newSort[status.toLowerCase()] = desktopJobsFilter[
                status.toLowerCase()
              ].filter((value) =>
                value.company.toLowerCase().trim().includes(text),
              );
            });

            setDesktopJobsFilter(newSort);
          }
        }}
        className="w-full bg-transparent px-2 py-1 placeholder-black/60 dark:placeholder-green-300/60 text-black dark:text-green-300 outline-none"
        placeholder="Search by Company.."
      ></input>
      <button
        onClick={() => {
          setDesktopJobsFilter(sortedJobs);
          searchInput.current.value = '';
        }}
        className="px-1 dark:fill-green-500 fill-black"
      >
        {icons.cancelSearch}
      </button>
    </div>
  );
}
