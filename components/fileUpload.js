export function FileUploadFail({ message }) {
  return (
    <div className="border-2 border-b-8 border-red-900 bg-red-300 text-red-900 rounded text p-2 fixed top-2 w-full right-0 errorMessage">
      <h1>error: {message}</h1>
    </div>
  );
}

export function FileUploadSuccess({ message }) {
  return (
    <div className="border-2 border-b-8 border-green-900 bg-lime-300 text-green-900 rounded text p-2 fixed top-2 w-full right-0 errorMessage">
      <h1>success: {message}</h1>
    </div>
  );
}
