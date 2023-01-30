import { useRef, useState } from 'react';
import Icons from './icons';
export default function DesktopJobSearch({ jobs }) {
  const icons = Icons();
  const [searchList, setSearchList] = useState([]);
  const searchInput = useRef();

  return (
    <div className="w-full flex dark:bg-neutral-700  bg-green-500 border-b-2 border-b-neutral-900 dark:border-b-green-500 z-50">
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
        className="w-full bg-transparent px-2 py-1 dark:placeholder-green-300/60 text-black dark:text-green-300"
        placeholder="Search.."
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
