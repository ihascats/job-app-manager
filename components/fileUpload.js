import { useEffect, useState } from 'react';

export function FileUploadFail({ message }) {
  const [mobile, setMobile] = useState(false);

  function screenWidth(event) {
    setMobile(event.target.innerWidth <= 768);
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', screenWidth);
  }, []);
  return (
    <div
      className={`border-2 border-b-8 border-red-900 bg-red-300 text-red-900 rounded text p-2 fixed w-full ${
        mobile ? 'top-2 right-0' : 'bottom-2 left-4 max-w-[500px]'
      } errorMessage`}
    >
      <h1>error: {message}</h1>
    </div>
  );
}

export function FileUploadSuccess({ message }) {
  const [mobile, setMobile] = useState(false);

  function screenWidth(event) {
    setMobile(event.target.innerWidth <= 768);
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', screenWidth);
  }, []);
  return (
    <div
      className={`border-2 border-b-8 border-green-900 bg-lime-300 text-green-900 rounded text p-2 fixed w-full ${
        mobile ? 'top-2 right-0' : 'bottom-2 left-4 max-w-[500px]'
      } errorMessage`}
    >
      <h1>success: {message}</h1>
    </div>
  );
}
