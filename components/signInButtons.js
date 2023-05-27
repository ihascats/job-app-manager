import Icons from './icons';
import { signIn } from 'next-auth/react';

export default function SignInButtons() {
  const icons = Icons();

  return (
    <div className="bg-gradient-to-br from-neutral-800 to-indigo-600 flex items-center justify-center z-50 w-screen h-screen">
      <div className="border-4 rounded-xl border-neutral-900 bg-neutral-200 text-neutral-900 flex flex-col items-center justify-center gap-4 z-50 px-8 pt-24">
        <h1 className="text-2xl font-mono tracking-wider">sign in</h1>
        <button
          onClick={() =>
            signIn('google', {
              callbackUrl: process.env.CALLBACK_URL,
            })
          }
          className="btn btn-red bg-neutral-300 flex py-2 px-4 rounded gap-3 w-56 justify-center"
        >
          {icons.googleLogo}
          <h1>Google</h1>
        </button>
        <button
          onClick={() =>
            signIn('github', {
              callbackUrl: process.env.CALLBACK_URL,
            })
          }
          className="btn btn-neutral flex py-2 px-4 rounded gap-3 w-56 justify-center"
        >
          {icons.githubLogo}
          <h1>GitHub</h1>
        </button>
        <a className="pt-24 font-mono tracking-wider underline underline-offset-4 flex hover:text-blue-600 hover:fill-blue-600 cursor-pointer">
          {icons.githubLogo}
          ihascats
        </a>
      </div>
    </div>
  );
}
