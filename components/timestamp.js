export default function Timestamp({ createdAt }) {
  const currentDate = new Date();
  const pastDate = new Date(createdAt);
  const difference = Math.abs(currentDate - pastDate) / 36e5;

  const seconds = Math.floor(difference * 3600);
  const minutes = Math.floor(difference * 60);
  const hours = Math.floor(difference);
  const days = Math.floor(difference / 24);

  const timeAmount =
    seconds < 60
      ? `${seconds}s`
      : minutes < 60
      ? `${minutes}m`
      : hours < 24
      ? `${hours}h`
      : `${days}d`;

  return (
    <h3 className="text-sm font-bold opacity-60 font-mono whitespace-nowrap dark:text-lime-400">
      - added {timeAmount} ago
    </h3>
  );
}
