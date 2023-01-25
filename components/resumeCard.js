import Icons from './icons';
import Timestamp from './timestamp';

export default function ResumeCard({ resume }) {
  const icons = Icons();
  return (
    <div className="rounded-xl p-2 bg-white h-fit w-screen-p4">
      <h1 className={`font-bold truncate`}>{resume.name}</h1>
      <Timestamp createdAt={resume.createdAt} />
      <div className="w-full grid grid-cols-2">
        <button className="bg-red-500 rounded-bl-lg py-1 fill-white flex justify-center">
          {icons.deleteFile}
        </button>
        <button className="bg-green-500 rounded-br-lg py-1 fill-white flex justify-center">
          {icons.download}
        </button>
      </div>
    </div>
  );
}
