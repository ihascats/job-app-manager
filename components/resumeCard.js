import { useEffect, useState } from 'react';
import Icons from './icons';
import Timestamp from './timestamp';

export default function ResumeCard({ resume, getResumeList }) {
  const icons = Icons();

  async function deleteFile(name) {
    const link = `/api/resume/${name}`;
    await fetch(link, {
      method: 'DELETE',
    });
    getResumeList();
  }

  async function getFile(name) {
    const link = `/api/resume/${name}`;
    const response = await fetch(link);
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    return fileURL;
  }

  const [downloadLink, setDownloadLink] = useState();
  useEffect(() => {
    getFile(resume.name).then((result) => {
      setDownloadLink(result);
    });
  }, [resume.name]);

  return (
    <div className="rounded-xl p-2 bg-white h-fit w-screen-p4">
      <h1 className={`font-bold truncate`}>{resume.name}</h1>
      <Timestamp createdAt={resume.createdAt} />
      <div className="w-full grid grid-cols-2">
        <button
          onClick={() => {
            deleteFile(resume.name);
          }}
          className="bg-red-500 rounded-bl-lg py-1 fill-white flex justify-center"
        >
          {icons.deleteFile}
        </button>
        <a
          download={resume.name}
          href={downloadLink}
          className="bg-green-500 rounded-br-lg py-1 fill-white flex justify-center"
        >
          {icons.download}
        </a>
      </div>
    </div>
  );
}
