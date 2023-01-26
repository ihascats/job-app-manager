import { signOut } from 'next-auth/react';
import { useRef } from 'react';
import Icons from './icons';

export default function ToggleNewButtons({
  setCreateNewEntry,
  setButtonsVisible,
  getResumeList,
}) {
  async function addResume() {
    const formData = new FormData(form.current);
    const link = `/api/uploadResume`;
    await fetch(link, {
      method: 'POST',
      body: formData,
    });
    getResumeList();
  }
  const form = useRef();
  const icons = Icons();

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
      <form ref={form} onChange={addResume} className="h-[35px] pt-1">
        <label className="p-2 bg-green-600 text-sm rounded-md">
          Add Resume
          <input hidden name="resume" type="file"></input>
        </label>
      </form>
      <button
        className="p-2 bg-green-600 text-sm rounded-md flex gap-1 h-9 items-center"
        onClick={() => signOut()}
      >
        Sign out{icons.signOut}
      </button>
    </div>
  );
}
