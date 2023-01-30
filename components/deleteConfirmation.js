export default function DeleteConfirmation({
  proceed,
  terminate,
  elementStopPropagation,
}) {
  return (
    <div
      onClick={elementStopPropagation ? elementStopPropagation : null}
      className="h-screen w-screen fixed top-0 left-0 bg-black/80 z-[1000] flex justify-center items-center tracking-widest"
    >
      <div className="bg-orange-300 border-2 border-b-4 border-red-800 text-red-800 px-10 py-2 gap-2 flex">
        <h1>Proceed with Deletion</h1>
        <div className="flex w-full gap-2">
          <button
            onClick={proceed}
            className="bg-orange-300 border-2 border-b-4 border-red-800 text-red-800 p-1 w-full hover:bg-orange-500"
          >
            YES
          </button>
          <button
            onClick={terminate}
            className="bg-orange-300 border-2 border-b-4 border-red-800 text-red-800 p-1 w-full hover:bg-indigo-500"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
