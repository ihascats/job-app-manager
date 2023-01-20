import { useEffect, useState } from 'react';

export default function NewEntry() {
  async function save(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const link = `/api/addNewEntry`;
    const response = await fetch(link, {
      method: 'POST',
      body: formData,
    });
    const json = await response.json();
    console.log(json);
  }

  const [coverLetterFileName, setCoverLetterFileName] = useState();
  const [resumeFileName, setResumeFileName] = useState();
  const [resumeList, setResumeList] = useState([]);
  const [resumeSelectSwitch, setResumeSelectSwitch] = useState(true);

  async function getResumes() {
    const link = `/api/getResumes`;
    const response = await fetch(link, {
      method: 'GET',
    });
    const json = await response.json();
    return json.resumes;
  }
  useEffect(() => {
    getResumes().then((result) => {
      setResumeList(result);
    });
  }, []);

  return (
    <div className="bg-black/30 py-6 px-4 h-screen absolute top-0 w-full">
      <form
        onSubmit={save}
        className="bg-white rounded-xl h-full w-full py-4 px-2 flex flex-col-reverse gap-4"
      >
        <div className="flex justify-end">
          <button className="py-2 px-4 bg-lime-500">Save</button>
          <button className="py-2 px-4 bg-red-500">Cancel</button>
        </div>
        <select name="status" className="p-2 bg-gray-200">
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
            onClick={() => {
              setResumeSelectSwitch((prev) => !prev);
            }}
            className="p-2 bg-gray-400 font-mono text-sm w-9"
          >
            C
          </button>
        </div>
        <label className="py-2 px-4 bg-gray-200 font-mono text-sm truncate">
          Cover Letter
          {coverLetterFileName ? `: ${coverLetterFileName}` : ': select a file'}
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
        ></input>
        <input
          className="border-b-2 border-b-black/20 w-full"
          placeholder="Position"
          name="position"
        ></input>
        <input
          className="border-b-2 border-b-black/20 w-full placeholder-blue-500"
          placeholder="Link"
          name="link"
        ></input>
        <input
          className="border-b-2 border-b-black/20 w-full placeholder-green-500"
          placeholder="Location"
          name="location"
        ></input>
        <input
          className="border-b-2 border-b-black/20 w-full placeholder-yellow-500"
          placeholder="Salary"
          name="salary"
        ></input>
        <textarea
          className="border-b-2 border-b-black/20 w-full"
          placeholder="Notes"
          name="notes"
        ></textarea>
      </form>
    </div>
  );
}
