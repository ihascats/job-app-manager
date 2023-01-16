export default function NewEntry() {
  function save(event) {
    event.preventDefault();
    // const formData = new FormData(event.target);
  }

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
        <select>
          <option>Wishlist</option>
          <option>Applied</option>
          <option>Rejected</option>
          <option>Interview</option>
          <option>Pending</option>
          <option>Offer</option>
        </select>
        <input
          className="border-b-2 border-b-black w-full font-bold text-xl placeholder-black/80"
          placeholder="Company"
          name="company"
        ></input>
        <input
          className="border-b-2 border-b-black w-full"
          placeholder="Position"
          name="position"
        ></input>
        <input
          className="border-b-2 border-b-black w-full placeholder-blue-500"
          placeholder="Link"
          name="link"
        ></input>
        <input
          className="border-b-2 border-b-black w-full placeholder-green-500"
          placeholder="Location"
          name="location"
        ></input>
        <input
          className="border-b-2 border-b-black w-full placeholder-yellow-500"
          placeholder="Salary"
          name="salary"
        ></input>
        {/* add resume select */}
        <textarea
          className="border-b-2 border-b-black w-full h-full"
          placeholder="Notes"
          name="notes"
        ></textarea>
      </form>
    </div>
  );
}
