import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DeleteConfirmation from './deleteConfirmation';
import Icons from './icons';
import Timestamp from './timestamp';

export default function ResumeCard({ resume, getResumeList }) {
  const icons = Icons();
  const { data: session } = useSession();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  async function deleteFile(name) {
    const link = `/api/${session.user.email}/resume/${name}`;
    await fetch(link, {
      method: 'DELETE',
    });
    getResumeList();
  }

  async function getFile(name) {
    const link = `/api/${session.user.email}/resume/${name}`;
    const response = await fetch(link);
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    return fileURL;
  }

  const [downloadLink, setDownloadLink] = useState();
  useEffect(() => {
    if (session) {
      getFile(resume.name).then((result) => {
        setDownloadLink(result);
      });
    }
  }, [resume.name, session]);

  const [mobile, setMobile] = useState(false);

  function screenWidth(event) {
    setMobile(event.target.innerWidth <= 768);
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', screenWidth);
  }, []);

  function proceed() {
    deleteFile(resume.name);
  }
  function terminate() {
    setDeleteConfirmationVisible(false);
  }

  return (
    <div
      className={`rounded-xl p-2 bg-white dark:bg-slate-800 dark:text-lime-300 h-fit ${
        mobile ? 'w-screen-p4' : ''
      }`}
    >
      {deleteConfirmationVisible ? (
        <DeleteConfirmation proceed={proceed} terminate={terminate} />
      ) : null}
      <h1 className={`font-bold truncate`}>{resume.name}</h1>
      <Timestamp createdAt={resume.createdAt} />
      <div className="w-full grid grid-cols-2">
        <button
          onClick={() => {
            setDeleteConfirmationVisible(true);
          }}
          className="bg-red-500 rounded-bl-lg py-1 fill-white dark:fill-red-400 dark:bg-zinc-600 flex justify-center"
        >
          {icons.deleteFile}
        </button>
        <a
          download={resume.name}
          href={downloadLink}
          className="bg-green-500 rounded-br-lg py-1 fill-white dark:fill-green-500 dark:bg-zinc-700 flex justify-center"
        >
          {icons.download}
        </a>
      </div>
    </div>
  );
}
