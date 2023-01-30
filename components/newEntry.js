import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Icons from './icons';

export default function NewEntry({
  setCreateNewEntry,
  setButtonsVisible,
  cardVisible,
  setCardVisible,
  updateJobs,
  updateEntryInfo,
  statusList,
}) {
  const [coverLetterFileName, setCoverLetterFileName] = useState();
  const [resumeFileName, setResumeFileName] = useState();
  const [resumeList, setResumeList] = useState([]);
  const [resumeSelectSwitch, setResumeSelectSwitch] = useState(true);
  const [jobData, setJobData] = useState();
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();

  function elementStopPropagation(event) {
    event.stopPropagation();
  }

  async function getResumes() {
    const link = `/api/${session.user.email}/getResumes`;
    const response = await fetch(link, {
      method: 'GET',
    });
    const json = await response.json();
    return json.resumes;
  }

  async function deleteEntry(event, { id }) {
    event.preventDefault();
    updateJobs(id);
    cancel();
    const link = `/api/${session.user.email}/getEntry/${id}`;
    await fetch(link, {
      method: 'DELETE',
    });
  }

  function cancel(event) {
    if (event) {
      if ('preventDefault' in event) event.preventDefault();
    }
    if (cardVisible) {
      setCardVisible();
    }
    setButtonsVisible(true);
    setCreateNewEntry(false);
  }

  async function updateEntry(event, { id }) {
    event.preventDefault();
    const formData = new FormData(event.target.parentElement.parentElement);
    const obj = { createdAt: '' };

    formData.forEach((value, key) => {
      if (typeof value === 'object') {
        if ('name' in value) obj[key] = value.name;
      } else {
        obj[key] = value;
      }
    });
    updateEntryInfo(id, obj);
    cancel();

    const link = `/api/${session.user.email}/getEntry/${id}`;
    await fetch(link, {
      method: 'PUT',
      body: formData,
    });
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.target);
    const obj = {
      createdAt: `${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
    };

    formData.forEach((value, key) => {
      if (typeof value === 'object') {
        if ('name' in value) obj[key] = value.name;
      } else {
        obj[key] = value;
      }
    });

    const link = `/api/${session.user.email}/addNewEntry`;
    await fetch(link, {
      method: 'POST',
      body: formData,
    }).then((result) => {
      result.json().then((value) => {
        obj.id = value.insertedId;
        obj.createdAt = value.createdAt;
        updateJobs(obj.id, obj);
        setSaving(false);
        cancel();
      });
    });
  }

  useEffect(() => {
    if (session && cardVisible) {
      setJobData(cardVisible);
    }
    if (jobData) {
      if (jobData.resume === '') {
        setResumeSelectSwitch(false);
      }
      getResumes().then((result) => {
        if (
          !result.some((resume) => resume.name === jobData.resume) &&
          jobData.resume !== ''
        ) {
          // if resume under a listed name doesn't exist add an object with said name
          result.push({ name: jobData.resume });
        }
        setResumeList(result);
      });
    }
  }, [cardVisible, session, jobData]);

  // mobile switch
  const [mobile, setMobile] = useState(false);

  function screenWidth(event) {
    setMobile(event.target.innerWidth <= 768);
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', screenWidth);
  }, []);

  const icons = Icons();

  return (
    <div
      onClick={cancel}
      className={`bg-black/30 py-6 px-4 h-screen absolute top-0 w-full z-50 ${
        mobile ? '' : 'flex justify-center'
      }`}
    >
      {saving ? (
        <div
          onClick={elementStopPropagation}
          className="rounded-xl bg-white dark:bg-slate-800 dark:text-neutral-200 w-screen-p4 h-screen-p4 backdrop-blur-md flex flex-col text-neutral-800 justify-center items-center fixed"
        >
          {icons.loading}
          <p className="font-mono">Saving job data..</p>
        </div>
      ) : cardVisible && !jobData ? (
        <div
          onClick={elementStopPropagation}
          className="rounded-xl bg-white dark:bg-slate-800 dark:text-neutral-200 w-screen-p4 h-screen-p4 backdrop-blur-md flex flex-col text-neutral-800 justify-center items-center fixed"
        >
          {icons.loading}
          <p className="font-mono">Loading job data..</p>
        </div>
      ) : (
        <form
          onClick={elementStopPropagation}
          onSubmit={save}
          className={`bg-white dark:bg-slate-800 dark:text-neutral-200 rounded-xl h-full w-full py-4 px-2 flex  gap-4 z-50 ${
            mobile ? 'flex-col-reverse' : ' flex-col max-w-[500px]'
          }`}
        >
          <div className="flex justify-end dark:text-neutral-50">
            {cardVisible ? (
              <button
                onClick={(event) => {
                  deleteEntry(event, cardVisible);
                }}
                className="py-2 px-4 bg-red-500 dark:bg-neutral-900 dark:text-red-500"
              >
                Delete
              </button>
            ) : null}
            {cardVisible ? (
              <button
                onClick={(event) => {
                  updateEntry(event, cardVisible);
                }}
                className="py-2 px-4 bg-lime-500 dark:bg-neutral-800 dark:text-lime-500"
              >
                Update
              </button>
            ) : (
              <button className="py-2 px-4 bg-lime-500 dark:bg-neutral-800 dark:text-lime-500">
                Save
              </button>
            )}
            <button
              onClick={cancel}
              className="py-2 px-4 bg-yellow-500 dark:bg-neutral-700 dark:text-yellow-500"
            >
              Cancel
            </button>
          </div>
          <select
            name="status"
            className="p-2 bg-gray-200 dark:bg-slate-600"
            defaultValue={jobData ? jobData.status : 'Applied'}
          >
            {statusList
              ? statusList.map((option) => (
                  <option key={option}>{option}</option>
                ))
              : null}
          </select>
          <div className="w-full flex">
            {resumeSelectSwitch && resumeList.length > 0 ? (
              <select
                name="resume"
                className="p-2 bg-gray-200 dark:bg-slate-600 font-mono text-sm truncate w-screen-resume-select"
                defaultValue={jobData ? jobData.resume : ''}
              >
                {resumeList.map((resume) => (
                  <option className="dark:bg-slate-600" key={resume.name}>
                    {resume.name}
                  </option>
                ))}
              </select>
            ) : (
              <label className="py-2 px-4 bg-gray-200 dark:bg-slate-600 font-mono text-sm truncate w-screen-resume-select">
                Resume
                {resumeFileName ? `: ${resumeFileName}` : ': select a file'}
                <input
                  onChange={(event) => {
                    setResumeFileName(
                      event.target.value.split('\\').reverse()[0],
                    );
                  }}
                  hidden
                  name="resume"
                  type="file"
                ></input>
              </label>
            )}
            <button
              onClick={(event) => {
                event.preventDefault();
                setResumeSelectSwitch((prev) => !prev);
              }}
              className="p-2 bg-gray-400 dark:bg-slate-700 font-mono text-sm"
            >
              {icons.swap}
            </button>
          </div>
          <label className="py-2 px-4 bg-gray-200 dark:bg-slate-600 font-mono text-sm truncate">
            Cover Letter
            {jobData
              ? `: ${jobData.cover}`
              : coverLetterFileName
              ? `: ${coverLetterFileName}`
              : ': select a file'}
            <input
              onChange={(event) => {
                setCoverLetterFileName(
                  event.target.value.split('\\').reverse()[0],
                );
              }}
              hidden
              name="cover"
              type="file"
            ></input>
          </label>
          <input
            className="border-b-2 dark:bg-slate-800 border-b-black/20 w-full font-bold text-xl placeholder-black/80 dark:placeholder-white/80"
            placeholder="Company"
            name="company"
            defaultValue={jobData ? jobData.company : ''}
          ></input>
          <input
            className="border-b-2 dark:bg-slate-800 border-b-black/20 w-full"
            placeholder="Position"
            name="position"
            defaultValue={jobData ? jobData.position : ''}
          ></input>
          <input
            className="border-b-2 dark:bg-slate-800 border-b-black/20 w-full placeholder-blue-500"
            placeholder="Link"
            name="link"
            defaultValue={jobData ? jobData.link : ''}
          ></input>
          <input
            className="border-b-2 dark:bg-slate-800 border-b-black/20 w-full placeholder-green-500"
            placeholder="Location"
            name="location"
            defaultValue={jobData ? jobData.location : ''}
          ></input>
          <input
            className="border-b-2 dark:bg-slate-800 border-b-black/20 w-full placeholder-yellow-500"
            placeholder="Salary"
            name="salary"
            defaultValue={jobData ? jobData.salary : ''}
          ></input>
          <textarea
            className="border-b-2 dark:bg-slate-800 border-b-black/20 w-full"
            placeholder="Notes"
            name="notes"
            defaultValue={jobData ? jobData.notes : ''}
          ></textarea>
        </form>
      )}
    </div>
  );
}
