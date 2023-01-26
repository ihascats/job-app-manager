import Icons from './icons';
import { signIn } from 'next-auth/react';

export default function SignInButtons() {
  const icons = Icons();

  return (
    <div className="bg-gradient-to-br from-neutral-800 to-red-600 flex flex-col items-center justify-center gap-4 z-50 w-screen h-screen">
      <button
        onClick={() =>
          signIn('google', {
            callbackUrl: process.env.CALLBACK_URL,
          })
        }
        className="flex bg-red-500 py-2 px-4 rounded text-white fill-white gap-3"
      >
        {icons.googleLogo}
        <h1>Sign In with Google</h1>
      </button>
      <button
        onClick={() =>
          signIn('github', {
            callbackUrl: process.env.CALLBACK_URL,
          })
        }
        className="flex bg-neutral-800 py-2 px-4 rounded text-white fill-white gap-3"
      >
        {icons.githubLogo}
        <h1>Sign In with GitHub</h1>
      </button>
    </div>
  );
}
