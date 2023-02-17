import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import DeleteConfirmation from './deleteConfirmation';
import Icons from './icons';

export default function NewEntry({
  setCreateNewEntry,
  setButtonsVisible,
  cardVisible,
  setCardVisible,
  updateJobs,
  updateEntryInfo,
  statusList,
  resumeList,
}) {
  const [coverLetterFileName, setCoverLetterFileName] = useState();
  const [jobData, setJobData] = useState();
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();

  function elementStopPropagation(event) {
    event.stopPropagation();
  }
  async function deleteCoverFile(name) {
    const link = `/api/${session.user.email}/cover/${name}`;
    await fetch(link, {
      method: 'DELETE',
    });
  }

  async function deleteEntry({ id }) {
    updateJobs(id);
    cancel();
    const link = `/api/getEntry/${id}`;
    await fetch(link, {
      method: 'DELETE',
    });
    deleteCoverFile(jobData.cover);
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
        if ('name' in value) obj[key] = value.name.trim();
      } else {
        obj[key] = value.trim();
      }
    });
    if (obj.cover !== jobData.cover && jobData.cover !== '') {
      deleteCoverFile(jobData.cover);
      uploadCoverFile();
    }
    updateEntryInfo(id, obj);
    cancel();

    const link = `/api/getEntry/${id}`;
    await fetch(link, {
      method: 'PUT',
      body: formData,
    });
  }

  function toIsoString(date) {
    const tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        return (num < 10 ? '0' : '') + num;
      };

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      dif +
      pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' +
      pad(Math.abs(tzo) % 60)
    );
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.target);
    const obj = {
      createdAt: `${toIsoString(new Date())}`,
    };

    formData.forEach((value, key) => {
      if (typeof value === 'object') {
        if ('name' in value) obj[key] = value.name.trim();
      } else {
        obj[key] = value.trim();
      }
    });
    if (obj.cover !== '') {
      uploadCoverFile();
    }

    const link = `/api/${session.user.email}/addNewEntry`;
    await fetch(link, {
      method: 'POST',
      body: formData,
    }).then((result) => {
      result.json().then((value) => {
        obj.id = value.insertedId;
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

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  function proceed() {
    deleteEntry(cardVisible);
  }
  function terminate() {
    setDeleteConfirmationVisible(false);
  }

  async function getFile(name) {
    const link = `/api/${session.user.email}/cover/${name}`;
    const response = await fetch(link);
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    return fileURL;
  }

  const [downloadLink, setDownloadLink] = useState();
  useEffect(() => {
    if (session && jobData) {
      if (jobData.cover !== '') {
        getFile(jobData.cover).then((result) => {
          setDownloadLink(result);
        });
      }
    }
  }, [jobData, session]);

  async function uploadCoverFile() {
    const file = coverFileInput.current.files?.[0];
    const url = `/api/${session.user.email}/cover/${file.name}`;
    const formData = new FormData();

    formData.append('file', file, file.name);

    await fetch(url, {
      method: 'POST',
      body: formData,
    });
  }

  const coverFileInput = useRef();

  const icons = Icons();

  // prevent cancel when mouseUp is executed on cancelDiv
  const [isMouseDown, setIsMouseDown] = useState(false);
  const cancelDiv = useRef();

  function handleMouseDown(event) {
    elementStopPropagation(event);
    setIsMouseDown(event.target);
  }

  function handleMouseUp(event) {
    elementStopPropagation(event);
    if (
      isMouseDown === cancelDiv.current &&
      event.target === cancelDiv.current
    ) {
      cancel();
    }
    setIsMouseDown(false);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      ref={cancelDiv}
      className={`bg-black/30 py-6 px-4 h-screen absolute top-0 w-full z-50 flex justify-center`}
    >
      {deleteConfirmationVisible ? (
        <DeleteConfirmation
          proceed={proceed}
          terminate={terminate}
          elementStopPropagation={elementStopPropagation}
        />
      ) : null}
      {saving ? (
        <div
          onClick={elementStopPropagation}
          className={`rounded-xl bg-white dark:bg-slate-800 dark:text-neutral-200 w-screen-p4 h-screen-p4 backdrop-blur-md flex flex-col text-neutral-800 justify-center items-center fixed ${
            mobile ? 'w-screen-p4 max-w-[400px]' : 'max-w-[500px]'
          }`}
        >
          {icons.loading}
          <p className="font-mono">Saving job data..</p>
        </div>
      ) : cardVisible && !jobData ? (
        <div
          onClick={elementStopPropagation}
          className={`rounded-xl bg-white dark:bg-slate-800 dark:text-neutral-200 w-screen-p4 h-screen-p4 backdrop-blur-md flex flex-col text-neutral-800 justify-center items-center fixed ${
            mobile ? 'w-screen-p4 max-w-[400px]' : 'max-w-[500px]'
          }`}
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
          } ${mobile ? 'w-screen-p4 max-w-[400px]' : ''}`}
        >
          <div className="flex justify-end dark:text-neutral-50">
            {cardVisible ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setDeleteConfirmationVisible(true);
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
            <select
              name="resume"
              className="p-2 bg-gray-200 dark:bg-slate-600 font-mono text-sm truncate w-full"
              defaultValue={jobData ? jobData.resume : ''}
            >
              {resumeList.map((resume) => (
                <option className="dark:bg-slate-600" key={resume.name}>
                  {resume.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex">
            <label className="py-2 px-4 bg-gray-200 dark:bg-slate-600 font-mono text-sm truncate w-full">
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
                ref={coverFileInput}
                hidden
                name="cover"
                type="file"
              ></input>
            </label>
            {jobData ? (
              jobData.cover !== '' ? (
                <a
                  download={jobData.cover}
                  href={downloadLink}
                  className="h-9 flex justify-center items-center py-2 px-4 bg-green-500 dark:bg-slate-900 fill-white dark:fill-green-600"
                >
                  {downloadLink ? (
                    icons.download
                  ) : (
                    <div className="scale h-6 w-6 flex justify-center items-center">
                      {icons.loading}
                    </div>
                  )}
                </a>
              ) : null
            ) : null}
          </div>
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
