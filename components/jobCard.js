import { useEffect, useState } from 'react';
import Timestamp from './timestamp';

export default function JobCard({
  company,
  position,
  createdAt,
  job,
  setCreateNewEntry,
  setButtonsVisible,
  setCardVisible,
}) {
  const [mobile, setMobile] = useState(false);

  function screenWidth(event) {
    setMobile(event.target.innerWidth <= 768);
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', screenWidth);
  }, []);

  return (
    <div
      onClick={() => {
        setCreateNewEntry(true);
        setButtonsVisible(false);
        setCardVisible(job);
      }}
      className={`container-job-card dark:border-neutral-400 cursor-pointer rounded-xl p-2 h-fit ${
        mobile ? 'w-screen-p4 max-w-[400px]' : ''
      }`}
    >
      <h1
        className={`font-bold truncate dark:text-neutral-300 ${
          !company ? 'text-black/40 dark:text-neutral-300/40' : null
        }`}
      >
        {company || 'Company name missing'}
      </h1>
      <h2
        className={`truncate dark:text-neutral-400 ${
          !position ? 'text-black/40 dark:text-neutral-400/40' : null
        }`}
      >
        {position || 'Position name missing'}
      </h2>
      <Timestamp createdAt={createdAt} />
    </div>
  );
}
