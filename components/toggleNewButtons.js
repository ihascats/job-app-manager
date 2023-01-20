import { useRef } from 'react';

export default function ToggleNewButtons({
  setCreateNewEntry,
  setButtonsVisible,
}) {
  async function addResume(event) {
    const formData = new FormData(form.current);
    const link = `/api/uploadResume`;
    const response = await fetch(link, {
      method: 'POST',
      body: formData,
    });
    const json = await response.json();
    console.log(json);
  }
  const form = useRef();

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
      <form ref={form} onChange={addResume} className="h-9">
        <label className="p-2 bg-green-600 text-sm rounded-md">
          Add Resume
          <input hidden name="resume" type="file"></input>
        </label>
      </form>
    </div>
  );
}
