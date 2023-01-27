export default function NavItems({ status, sortedJobs, filterJobs }) {
  const sortedJobLength = sortedJobs
    ? sortedJobs[status.toLowerCase()].length
    : '0';
  return (
    <li
      onClick={sortedJobLength ? filterJobs : null}
      className={`px-4 py-2 ${
        sortedJobLength && sortedJobLength !== '0'
          ? 'hover:bg-white/30'
          : 'bg-black/20 text-black/60'
      } flex gap-1`}
      data-filter={status}
    >
      {status}
      <p className="text-sm">{sortedJobs ? sortedJobLength : '0'}</p>
    </li>
  );
}
