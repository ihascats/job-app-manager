export default function Timestamp({ createdAt }) {
  const currentDate = new Date();
  const pastDate = new Date(createdAt);
  const difference = Math.abs(currentDate - pastDate) / 36e5;

  const calcSeconds = Math.floor(difference * 3600);
  const calcMinutes = Math.floor(difference * 60);
  const calcHours = Math.floor(difference);

  // issues with sql timestamp require the conditional, if time isn't an sql timestamp it'll be 1 (s, m, h, d) behind after the first (s, m, h, d)
  const seconds = calcSeconds - 3600 < 0 ? calcSeconds : calcSeconds - 3600;
  const minutes = calcMinutes - 60 < 0 ? calcMinutes : calcMinutes - 60;
  const hours = calcHours - 1 < 0 ? calcHours : calcHours - 1;
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
