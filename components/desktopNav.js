import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import DesktopJobSearch from './desktopJobSearch';
import { FileUploadFail, FileUploading, FileUploadSuccess } from './fileUpload';
import Icons from './icons';

export default function DesktopNav({
  setCreateNewEntry,
  getResumeList,
  setDarkTheme,
  desktopJobsFilter,
  setDesktopJobsFilter,
  statusList,
  sortedJobs,
  resumeList,
}) {
  const { data: session } = useSession();
  const [uploadStatus, setUploadStatus] = useState([]);
  const [latestTimeout, setLatestTimeout] = useState([]);
  const [fileUploading, setFileUploading] = useState([]);

  function sortTimeout() {
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
  }

  async function addResume(event) {
    if (event.target.value === '') return;
    const file = event.target.files?.[0];
    const array = uploadStatus.map((status) => status);
    if (resumeList.some((resume) => resume.name === file.name)) {
      const errorMessage = 'file with this name already exists';
      array.push(<FileUploadFail key={array.length} message={errorMessage} />);
      sortTimeout();
      setUploadStatus(array);
      event.target.value = '';
      return;
    }
    const uploading = <FileUploading key={0} />;
    setFileUploading([uploading]);
    const url = `/api/${session.user.email}/resume/${file.name}`;
    const formData = new FormData();

    formData.append('file', file, file.name);

    await fetch(url, {
      method: 'POST',
      body: formData,
    });
    setFileUploading([]);

    array.push(
      <FileUploadSuccess
        key={array.length}
        message={'file successfully uploaded'}
      />,
    );

    sortTimeout();

    setUploadStatus(array);
    getResumeList();
    event.target.value = '';
  }

  const icons = Icons();

  function changeTheme() {
    setDarkTheme((prev) => {
      localStorage.dark = !prev;
      return !prev;
    });
  }

  return (
    <nav className="bg-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 dark:fill-neutral-400 h-fit flex w-full whitespace-nowrap">
      {fileUploading}
      {uploadStatus}
      <button
        onClick={() => {
          setCreateNewEntry(true);
        }}
        className="p-2 hover:bg-green-400 hover:dark:bg-green-900 tracking-widest btn btn-neutral dark:border-green-400 dark:text-green-400"
      >
        add new entry
      </button>
      <div className="pt-2 hover:bg-orange-400 hover:dark:bg-orange-900 tracking-widest cursor-pointer btn btn-neutral dark:border-orange-400 dark:text-orange-400 dark:fill-orange-400">
        <label className="cursor-pointer p-2">
          add resume
          <input onChange={addResume} hidden name="resume" type="file"></input>
        </label>
      </div>
      <DesktopJobSearch
        desktopJobsFilter={desktopJobsFilter}
        setDesktopJobsFilter={setDesktopJobsFilter}
        statusList={statusList}
        sortedJobs={sortedJobs}
      />
      <button
        onClick={changeTheme}
        className="p-2 hover:bg-yellow-400 hover:dark:bg-yellow-900 tracking-widest flex gap-2 btn btn-neutral dark:border-yellow-400 dark:text-yellow-400 dark:fill-yellow-400"
      >
        theme{icons.theme}
      </button>
      <button
        onClick={signOut}
        className="p-2 hover:bg-rose-400 hover:dark:bg-rose-900  tracking-widest flex gap-2 btn btn-neutral dark:border-rose-400 dark:text-rose-400 dark:fill-rose-400"
      >
        sign out{icons.signOut}
      </button>
    </nav>
  );
}
