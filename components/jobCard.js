import Timestamp from './timestamp';

export default function JobCard({
  company,
  position,
  createdAt,
  id,
  setCreateNewEntry,
  setButtonsVisible,
  setCardVisible,
}) {
  return (
    <div
      onClick={() => {
        setCreateNewEntry(true);
        setButtonsVisible(false);
        setCardVisible(id);
      }}
      className="rounded-xl p-2 bg-white h-fit w-screen-p4"
    >
      <h1 className={`font-bold truncate ${!company ? 'text-black/40' : null}`}>
        {company || 'Company name missing'}
      </h1>
      <h2 className={`truncate ${!position ? 'text-black/40' : null}`}>
        {position || 'Position name missing'}
      </h2>
      <Timestamp createdAt={createdAt} />
    </div>
  );
}
