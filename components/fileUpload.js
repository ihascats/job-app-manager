import { useEffect, useState } from 'react';
import Icons from './icons';

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

export function FileUploading() {
  const icons = Icons();
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
      className={`border-2 border-b-8 border-blue-900 bg-indigo-300 text-blue-900 rounded text p-2 fixed w-full ${
        mobile ? 'top-2 right-0' : 'bottom-2 left-4 max-w-[500px]'
      }`}
    >
      <h1 className="flex items-center">
        <div className="fill-blue-900 scale-50">{icons.loading}</div>
        Uploading File..
      </h1>
    </div>
  );
}

export function FileDeleting() {
  const icons = Icons();
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
      className={`border-2 border-b-8 border-rose-900 bg-pink-300 text-rose-900 rounded text p-2 fixed w-full ${
        mobile ? 'top-2 right-0' : 'bottom-2 left-4 max-w-[500px]'
      }`}
    >
      <h1 className="flex items-center">
        <div className="fill-rose-900 scale-50">{icons.loading}</div>
        Deleting File..
      </h1>
    </div>
  );
}
