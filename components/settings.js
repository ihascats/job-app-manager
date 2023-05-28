import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Icons from './icons';

export default function Settings({
  setButtonsVisible,
  setDarkTheme,
  buttonsVisible,
}) {
  const icons = Icons();
  const [settingsVisible, setSettingsVisible] = useState(false);

  function toggleSettings() {
    setButtonsVisible(settingsVisible);
    setSettingsVisible((prev) => {
      return !prev;
    });
  }

  function changeTheme() {
    setDarkTheme((prev) => {
      localStorage.dark = !prev;
      return !prev;
    });
  }

  useEffect(() => {
    if (buttonsVisible) {
      setSettingsVisible(false);
    }
  }, [buttonsVisible]);

  return (
    <div className="sticky right-0 h-10 w-10 p-2 bg-indigo-500 dark:bg-neutral-900 dark:fill-emerald-500 dark:text-emerald-500 rounded-l z-50">
      {settingsVisible ? (
        <div className="bg-indigo-500/80 dark:bg-neutral-900/60 w-fit fixed bottom-[74px] right-0 flex flex-col p-2 items-end gap-1">
          <button
            onClick={changeTheme}
            className="flex gap-2 w-full justify-end"
          >
            Theme{icons.theme}
          </button>
          <button
            className="flex gap-2 w-full justify-end"
            onClick={() => signOut()}
          >
            Sign Out{icons.signOut}
          </button>
        </div>
      ) : null}
      <button onClick={toggleSettings}>{icons.settings}</button>
    </div>
  );
}
