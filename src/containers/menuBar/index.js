import React, {useMemo, useState} from 'react';
import GoogleAuth from '../googleAuth/index';
import '../../materialize/palette.css';
import './index.css';

export default function MenuBar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [sheetId, setSheetId] = useState(null);

  const authState = useMemo(
    () => (
      {
        isSignedIn: {
          value: isSignedIn,
          set: setIsSignedIn,
        },
        sheetId: {
          value: sheetId,
          set: setSheetId,
        },
      }
    ),
    [isSignedIn, setIsSignedIn, sheetId, setSheetId]
  );

  return (
    <nav>
      <div className='menuBar green'>
        <GoogleAuth authState={authState} />
      </div>
    </nav>
  );
}