import Timestamp from './timestamp';

export default function JobCard({ companyName, position, dateAdded }) {
  return (
    <div className="rounded-xl p-2 bg-white h-fit w-screen-p4">
      <h1 className="font-bold truncate">
        {companyName || 'Company name missing'}
      </h1>
      <h2 className="truncate">{position || 'Position name missing'}</h2>
      <Timestamp createdAt={dateAdded} />
    </div>
  );
}
