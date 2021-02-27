import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Switch, Route } from 'react-router-dom';

import { gapi } from 'gapi-script';

import MenuBar from '../menuBar/index';
import MessagePanel from '../../components/messagePanel/index';
import LoadBar from '../../components/loadBar/index';
import Transactions from '../transactions/index';

import './index.css';

import '../../materialize/animations.css';
import '../../materialize/button.css';
import '../../materialize/card.css';
import '../../materialize/palette.css';
import '../../materialize/preloader.css';
import '../../materialize/shadow.css';
import '../../materialize/table.css';

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

  const [ message, setMessage ] = useState(null);

  const showMessage = useCallback(
    newMessage => {
      setMessage(null);
      setMessage(newMessage);
    },
    [ setMessage ]
  );

  const [ spreadsheetBatch, setSpreadsheetBatch ] = useState(null);
  const [ updateTick, setUpdateTick ] = useState(0);
  const [ updatingStatus, setUpdatingStatus ] = useState(null);

  function updateData() {
    setUpdateTick(prevTick => ++prevTick);
  }

  //update data body
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
              "'Бюджет'!A3:C701",
            ],
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING',
          });

          const valueRanges = response.result.valueRanges;
    
          setSpreadsheetBatch({
            balance: valueRanges[0],
            transactions: valueRanges[1],
          });

          showMessage('Data has been updated');
        } catch (response) {
          console.log(response);
        } finally {
          setUpdatingStatus(null);
        }
      }
    },
    [spreadsheetId, updateTick, isSignedIn, showMessage]
  );
 
  const [ balance, setBalance ] = useState(null);
  const [ transactionsData, setTransactionsData ] = useState([]);

  //setting data to its hooks
  useEffect(
    () => {
      if (spreadsheetBatch) {
        setBalance(spreadsheetBatch.balance.values[0][0]);
        setTransactionsData(spreadsheetBatch.transactions.values ? spreadsheetBatch.transactions.values : []);
      }
    },
    [spreadsheetBatch]
  );

   //handle sign out
  useEffect(
    () => {
      if (!isSignedIn) {
        setSpreadsheetId(null);
        setSpreadsheetBatch(null);
      }
    },
    [isSignedIn, setSpreadsheetId, setSpreadsheetBatch]
  );

  return (
    <React.Fragment>
      <MenuBar
        authState={authState}
        balance={balance}
        showMessage={showMessage}
      />
      <div className='field-container'>
        <Switch>
          <Route path='/Transactions'>
            <Transactions
              authState={authState}
              updateData={updateData}
              transactionsData={transactionsData}
            />
          </Route>
        </Switch>
      </div>
      <LoadBar status={updatingStatus}/>
      <MessagePanel message={message}/>
    </React.Fragment>
  );
}