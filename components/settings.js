import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Icons from './icons';

export default function Settings({ setButtonsVisible }) {
  const icons = Icons();
  const [settingsVisible, setSettingsVisible] = useState(false);

  function toggleSettings() {
    setButtonsVisible(settingsVisible);
    setSettingsVisible((prev) => {
      return !prev;
    });
  }

  return (
    <div className="sticky right-0 h-10 w-10 p-2 bg-emerald-500 rounded-l z-50">
      {settingsVisible ? (
        <div className="bg-emerald-500 bg-opacity-60 w-fit fixed bottom-10 right-0 flex flex-col p-2 items-end gap-1">
          <button className="flex gap-2">Theme{icons.theme}</button>
          <button className="flex gap-2" onClick={() => signOut()}>
            Sign Out{icons.signOut}
          </button>
        </div>
      ) : null}
      <button onClick={toggleSettings}>{icons.settings}</button>
    </div>
  );
}
