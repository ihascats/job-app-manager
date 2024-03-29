import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FileUploadFail, FileUploading, FileUploadSuccess } from './fileUpload';

export default function ToggleNewButtons({
  setCreateNewEntry,
  setButtonsVisible,
  getResumeList,
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
    const file = event.target.files?.[0];
    const array = uploadStatus.map((status) => status);
    if (resumeList.some((resume) => resume.name === file.name)) {
      array.push(
        <FileUploadFail
          key={array.length}
          message={'file with this name already exists'}
        />,
      );
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

  return (
    <div className="flex flex-col absolute bottom-[84px] right-0 items-end gap-2 p-2">
      {fileUploading}
      {uploadStatus}
      <button
        onClick={() => {
          setCreateNewEntry(true);
          setButtonsVisible(false);
        }}
        className="w-9 text-3xl btn btn-neutral bg-indigo-300"
      >
        +
      </button>
      <div>
        <label className="p-2 text-sm font-bold font-mono btn btn-neutral bg-indigo-300">
          Add Resume
          <input onChange={addResume} hidden name="resume" type="file"></input>
        </label>
      </div>
    </div>
  );
}
