import { useSession } from 'next-auth/react';
import { useRef } from 'react';

export default function ToggleNewButtons({
  setCreateNewEntry,
  setButtonsVisible,
  getResumeList,
}) {
  const { data: session } = useSession();

  async function addResume() {
    const formData = new FormData(form.current);
    const link = `/api/${session.user.email}/uploadResume`;
    await fetch(link, {
      method: 'POST',
      body: formData,
    });
    getResumeList();
  }
  const form = useRef();

  return (
    <div className="flex flex-col absolute bottom-[78px] right-2 items-end gap-2">
      <button
        onClick={() => {
          setCreateNewEntry(true);
          setButtonsVisible(false);
        }}
        className="h-9 w-9 bg-emerald-500 dark:bg-neutral-900 dark:text-emerald-500 text-3xl rounded-md"
      >
        +
      </button>
      <form ref={form} onChange={addResume} className="h-[35px] pt-1">
        <label className="p-2 bg-emerald-500 dark:bg-neutral-900 dark:text-emerald-500 text-sm rounded-md">
          Add Resume
          <input hidden name="resume" type="file"></input>
        </label>
      </form>
    </div>
  );
}
