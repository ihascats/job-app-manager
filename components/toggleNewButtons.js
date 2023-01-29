import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { FileUploadFail, FileUploadSuccess } from './fileUpload';

export default function ToggleNewButtons({
  setCreateNewEntry,
  setButtonsVisible,
  getResumeList,
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

  return (
    <div className="flex flex-col absolute bottom-[78px] right-0 items-end gap-2 p-2">
      {uploadStatus}
      <button
        onClick={() => {
          setCreateNewEntry(true);
          setButtonsVisible(false);
        }}
        className="w-9 bg-emerald-400 dark:bg-neutral-900 text-3xl rounded-md border-2 border-b-8 border-x-4 border-cyan-900 dark:border-emerald-500 text-cyan-900 dark:text-emerald-500"
      >
        +
      </button>
      <form ref={form} onChange={addResume} className="h-[35px] pt-1">
        <label className="p-2 bg-emerald-400 dark:bg-neutral-900 text-sm rounded-md border-2 border-b-8 border-x-4 border-cyan-900 dark:border-emerald-500 text-cyan-900 dark:text-emerald-500 font-bold font-mono">
          Add Resume
          <input hidden name="resume" type="file"></input>
        </label>
      </form>
    </div>
  );
}
