import { useEffect, useState } from 'react';
import Icons from './icons';

export default function NewEntry({
  setCreateNewEntry,
  setButtonsVisible,
  cardVisible,
  setCardVisible,
  updateJobs,
}) {
  const [coverLetterFileName, setCoverLetterFileName] = useState();
  const [resumeFileName, setResumeFileName] = useState();
  const [resumeList, setResumeList] = useState([]);
  const [resumeSelectSwitch, setResumeSelectSwitch] = useState(true);
  const [jobData, setJobData] = useState();

  async function getResumes() {
    const link = `/api/getResumes`;
    const response = await fetch(link, {
      method: 'GET',
    });
    const json = await response.json();
    return json.resumes;
  }

  async function getEntry(id) {
    const link = `/api/getEntry/${id}`;
    const response = await fetch(link, {
      method: 'GET',
    });
    const json = await response.json();
    return json;
  }

  useEffect(() => {
    getResumes().then((result) => {
      setResumeList(result);
    });

    if (cardVisible) {
      getEntry(cardVisible).then((result) => {
        setJobData(result.rows[0]);
      });
    }
  }, [cardVisible]);

  function cancel(event) {
    if (event) {
      if ('preventDefault' in event) event.preventDefault();
    }
    if (cardVisible) {
      setCardVisible();
    }
    updateJobs();
    setButtonsVisible(true);
    setCreateNewEntry(false);
  }

  async function save(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const link = `/api/addNewEntry`;
    await fetch(link, {
      method: 'POST',
      body: formData,
    }).then((result) => {
      console.log(result);
    });
    cancel();
  }

  async function deleteEntry(event, id) {
    event.preventDefault();
    const link = `/api/getEntry/${id}`;
    await fetch(link, {
      method: 'DELETE',
    });
    cancel();
  }

  const icons = Icons();

  return (
    <div className="bg-black/30 py-6 px-4 h-screen absolute top-0 w-full">
      {cardVisible && !jobData ? (
        <div className="rounded-xl bg-white w-screen-p4 h-screen-p4 backdrop-blur-md flex flex-col text-neutral-800 justify-center items-center fixed">
          {icons.loading}
          <p className="font-mono">Loading job data..</p>
        </div>
      ) : (
        <form
          onSubmit={save}
          className="bg-white rounded-xl h-full w-full py-4 px-2 flex flex-col-reverse gap-4"
        >
          <div className="flex justify-end">
            {cardVisible ? (
              <button
                onClick={(event) => {
                  deleteEntry(event, cardVisible);
                }}
                className="py-2 px-4 bg-red-500"
              >
                Delete
              </button>
            ) : null}

            <button className="py-2 px-4 bg-lime-500">Save</button>
            <button onClick={cancel} className="py-2 px-4 bg-yellow-500">
              Cancel
            </button>
          </div>
          <select
            name="status"
            className="p-2 bg-gray-200"
            defaultValue={jobData ? jobData.status : 'Wishlist'}
          >
            <option>Wishlist</option>
            <option>Applied</option>
            <option>Rejected</option>
            <option>Interview</option>
            <option>Pending</option>
            <option>Offer</option>
          </select>
          <div className="w-full flex">
            {resumeSelectSwitch && resumeList.length > 0 ? (
              <select
                name="resume"
                className="p-2 bg-gray-200 font-mono text-sm truncate w-screen-resume-select"
              >
                {resumeList.map((resume) => (
                  <option key={resume}>{resume}</option>
                ))}
              </select>
            ) : (
              <label className="py-2 px-4 bg-gray-200 font-mono text-sm truncate w-screen-resume-select">
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
              className="p-2 bg-gray-400 font-mono text-sm w-9"
            >
              C
            </button>
          </div>
          <label className="py-2 px-4 bg-gray-200 font-mono text-sm truncate">
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
              name="cover_letter"
              type="file"
            ></input>
          </label>
          <input
            className="border-b-2 border-b-black/20 w-full font-bold text-xl placeholder-black/80"
            placeholder="Company"
            name="company"
            defaultValue={jobData ? jobData.company : ''}
          ></input>
          <input
            className="border-b-2 border-b-black/20 w-full"
            placeholder="Position"
            name="position"
            defaultValue={jobData ? jobData.position : ''}
          ></input>
          <input
            className="border-b-2 border-b-black/20 w-full placeholder-blue-500"
            placeholder="Link"
            name="link"
            defaultValue={jobData ? jobData.link : ''}
          ></input>
          <input
            className="border-b-2 border-b-black/20 w-full placeholder-green-500"
            placeholder="Location"
            name="location"
            defaultValue={jobData ? jobData.location : ''}
          ></input>
          <input
            className="border-b-2 border-b-black/20 w-full placeholder-yellow-500"
            placeholder="Salary"
            name="salary"
            defaultValue={jobData ? jobData.salary : ''}
          ></input>
          <textarea
            className="border-b-2 border-b-black/20 w-full"
            placeholder="Notes"
            name="notes"
            defaultValue={jobData ? jobData.notes : ''}
          ></textarea>
        </form>
      )}
    </div>
  );
}
