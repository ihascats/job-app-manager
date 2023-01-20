export default function Timestamp({ createdAt }) {
  const timeDifference =
    Math.abs(new Date(createdAt).getTime() - new Date().getTime()) / 36e5;

  const timeAmount =
    timeDifference > 24
      ? new Date(createdAt).toString().split(' ')[1].trim() +
        ' ' +
        new Date(createdAt).toString().split(' ')[2].trim()
      : timeDifference > 1
      ? Math.floor(timeDifference) + 'h'
      : timeDifference * 60 > 1
      ? Math.floor(timeDifference * 60) + 'm'
      : Math.floor(timeDifference * 3600) + 's';

  return (
    <h3 className="text-sm font-bold opacity-60 font-mono whitespace-nowrap">
      - added {timeAmount} ago
    </h3>
  );
}
