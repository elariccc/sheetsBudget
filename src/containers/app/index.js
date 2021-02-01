import React, {useEffect, useMemo, useState} from 'react';

import { gapi } from 'gapi-script';

import MenuBar from '../menuBar/index';
import MessagePanel from '../messagePanel/index';
import LoadBar from '../../components/loadBar/index';

import '../../materialize/button.css';
import '../../materialize/card.css';
import '../../materialize/appearAnimation.css';
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

  const [ message, showMessage ] = useState(null);

  const [ spreadsheetBatch, setSpreadsheetBatch ] = useState(null);
  const [ updateTick, setUpdateTick ] = useState(0);
  const [ updatingStatus, setUpdatingStatus ] = useState(null);

  function update() {
    setUpdateTick(prevTick => ++prevTick);
  }

  useEffect(
    () => {
      if (isSignedIn && spreadsheetId) fetchUpdatedValues();

      async function fetchUpdatedValues() {
        try {
          setUpdatingStatus('Updating data');

          const response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: spreadsheetId,
            ranges: [
              "'Бюджет'!F1",
            ],
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING',
          });

          const valueRanges = response.result.valueRanges;
    
          setSpreadsheetBatch({
            balance: valueRanges[0],
          });

          showMessage('Data has been updated');
        } catch (response) {
          console.log(response);
        } finally {
          setUpdatingStatus(null);
        }
      }
    },
    [spreadsheetId, updateTick, isSignedIn]
  );

  useEffect(
    () => {
      if (!isSignedIn) {
        setSpreadsheetId(null);
        setSpreadsheetBatch(null);
      }
    },
    [isSignedIn, setSpreadsheetId, setSpreadsheetBatch]
  )

  const [ balance, setBalance ] = useState(null);

  useEffect(
    () => {
      if (spreadsheetBatch) setBalance(spreadsheetBatch.balance.values[0][0]);
    },
    [spreadsheetBatch]
  );

  return (
    <React.Fragment>
      <MenuBar authState={authState} update={update} showMessage={showMessage}/>
      <LoadBar status={updatingStatus}/>
      <MessagePanel message={message}/>
    </React.Fragment>
  );
}