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
  return (
    <div
      onClick={() => {
        setCreateNewEntry(true);
        setButtonsVisible(false);
        setCardVisible(job);
      }}
      className="rounded-xl p-2 bg-white dark:bg-slate-800 h-fit w-screen-p4"
    >
      <h1
        className={`font-bold truncate dark:text-lime-300 ${
          !company ? 'text-black/40 dark:text-lime-300/40' : null
        }`}
      >
        {company || 'Company name missing'}
      </h1>
      <h2
        className={`truncate dark:text-lime-400 ${
          !position ? 'text-black/40 dark:text-lime-400/40' : null
        }`}
      >
        {position || 'Position name missing'}
      </h2>
      <Timestamp createdAt={createdAt} />
    </div>
  );
}
