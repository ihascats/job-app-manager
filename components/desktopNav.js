import { signOut, useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import DesktopJobSearch from './desktopJobSearch';
import { FileUploadFail, FileUploadSuccess } from './fileUpload';
import Icons from './icons';

export default function DesktopNav({
  setCreateNewEntry,
  getResumeList,
  setDarkTheme,
  desktopJobsFilter,
  setDesktopJobsFilter,
  statusList,
  sortedJobs,
}) {
  const { data: session } = useSession();
  const [uploadStatus, setUploadStatus] = useState([]);
  const [latestTimeout, setLatestTimeout] = useState([]);

  async function addResume() {
    const formData = new FormData(form.current);
    const link = `/api/${session.user.email}/uploadResume`;
    const response = await fetch(link, {
      method: 'POST',
      body: formData,
    });
    const json = await response.json();

    if (response.status) {
      form.current.resume.value = '';

      // clear timeout if it exists
      if (latestTimeout) {
        clearTimeout(latestTimeout);
      }
      // set new timeout thats going to clear out uploadStatus array
      setLatestTimeout(
        setTimeout(() => {
          setUploadStatus([]);
        }, 2000),
      );

      const array = structuredClone(uploadStatus);

      if (response.status === 401)
        array.push(<FileUploadFail key={array.length} message={json.error} />);
      if (response.status === 200)
        array.push(
          <FileUploadSuccess key={array.length} message={json.success} />,
        );

      setUploadStatus(array);
    }

    getResumeList();
  }
  const form = useRef();

  const icons = Icons();

  function changeTheme() {
    setDarkTheme((prev) => {
      localStorage.dark = !prev;
      return !prev;
    });
  }

  return (
    <nav className="bg-green-400 dark:bg-neutral-800 dark:text-green-400 dark:fill-green-400 h-10 flex w-full whitespace-nowrap">
      <button
        onClick={() => {
          setCreateNewEntry(true);
        }}
        className="p-2 hover:bg-neutral-500 tracking-widest"
      >
        add new entry
      </button>
      <form
        ref={form}
        onChange={addResume}
        className="p-2 hover:bg-neutral-500 tracking-widest cursor-pointer"
      >
        <label className="cursor-pointer">
          add resume
          <input hidden name="resume" type="file"></input>
        </label>
      </form>
      <DesktopJobSearch
        desktopJobsFilter={desktopJobsFilter}
        setDesktopJobsFilter={setDesktopJobsFilter}
        statusList={statusList}
        sortedJobs={sortedJobs}
      />
      <button
        onClick={changeTheme}
        className="p-2 hover:bg-neutral-500 tracking-widest flex gap-2"
      >
        theme{icons.theme}
      </button>
      <button
        onClick={signOut}
        className="p-2 hover:bg-neutral-500 tracking-widest flex gap-2"
      >
        sign out{icons.signOut}
      </button>
    </nav>
  );
}
