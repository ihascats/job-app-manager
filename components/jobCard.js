export default function JobCard({ companyName, position, dateAdded }) {
  return (
    <div className="rounded-xl p-2 bg-white h-fit w-screen-p4">
      <h1 className="font-bold truncate">{companyName}</h1>
      <h2 className="truncate">{position}</h2>
      <h3 className="font-mono">- added {dateAdded}</h3>
    </div>
  );
}
