import Timestamp from './timestamp';

export default function ResumeCard({ resume }) {
  return (
    <div className="rounded-xl p-2 bg-white h-fit w-screen-p4">
      <h1 className={`font-bold truncate`}>{resume.name}</h1>
      <Timestamp createdAt={resume.createdAt} />
    </div>
  );
}
