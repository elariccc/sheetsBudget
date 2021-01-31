import React, {useMemo, useState} from 'react';

import MenuBar from '../menuBar/index'

import '../../materialize/button.css';
import '../../materialize/card.css';
import '../../materialize/fade.css';
import '../../materialize/palette.css';
import '../../materialize/preloader.css';
import '../../materialize/shadow.css';

export default function App() {
  const [ isSignedIn, setIsSignedIn ] = useState(false);
  const [ spreadsheetId, setSpreadsheetId ] = useState(null);

  const authState = useMemo(
    () => (
      {
        isSignedIn: {
          value: isSignedIn,
          set: setIsSignedIn,
        },
        spreadsheetId: {
          value: spreadsheetId,
          set: setSpreadsheetId,
        },
      }
    ),
    [isSignedIn, setIsSignedIn, spreadsheetId, setSpreadsheetId]
  );

  return (
    <MenuBar authState={authState}/>
  );
}