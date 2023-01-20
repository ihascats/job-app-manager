export default function ToggleNewButtons({
  setCreateNewEntry,
  setButtonsVisible,
}) {
  return (
    <div className="flex flex-col absolute bottom-12 right-2 items-end gap-4">
      <button
        onClick={() => {
          setCreateNewEntry(true);
          setButtonsVisible(false);
        }}
        className="h-9 w-9 bg-green-600 text-3xl rounded-md"
      >
        +
      </button>
      <button
        onClick={() => {}}
        className="p-2 bg-green-600 text-sm rounded-md"
      >
        New Resume
      </button>
    </div>
  );
}
