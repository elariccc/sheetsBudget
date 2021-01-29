import React, { useEffect, useMemo, useState } from 'react';

import {gapi} from 'gapi-script';

import Modal from '../../components/modal/index';
import TextInput from '../../components/textInput/index';
import { UrlError, TemplateError } from '../../errors/index';

import { TEMPLATE_KEY } from '../../constants/index';

import './index.css';

export default function Popup(
  {
    authState,
    googleAuthState,
    openedState,
    userInfo,
  }
) {
  const [ sheetUrl, setSheetUrl ] = useState(null);
  const sheetUrlState = useMemo (
    () => (
      {
        value: sheetUrl,
        set: setSheetUrl,
      }
    ),
    [sheetUrl, setSheetUrl]
  )

  const [ attachingError, setAttachingError ] = useState(null);

  useEffect(
    () => {
      if (!openedState.value) setAttachingError(null);
    },
    [openedState.value]
  )

  const handleLogOutClick = () => {
    googleAuthState.value.signOut();
    openedState.set(false);
  };

  const handleRevokeAccessClick = () => {
    googleAuthState.value.disconnect();
    openedState.set(false);
  };

  const handleAttachClick = async () => {
    try {
      const indexLeft = sheetUrl.indexOf('docs.google.com/spreadsheets/d/') + 'docs.google.com/spreadsheets/d/'.length;
      
      if (indexLeft === 30) throw (new UrlError('The given URL is not valid'));
      
      const leftCuttedUrl = sheetUrl.slice(indexLeft);
      const indexRight = leftCuttedUrl.indexOf('/');
      const sheetId = leftCuttedUrl.slice(0, indexRight > 0 ? indexRight : undefined);
  
      authState.sheetId.set(sheetId);

      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "'Сводная таблица'!I20",
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
      });

      const fetchedTemplateKey = response.result.values[0][0];

      if (fetchedTemplateKey !== TEMPLATE_KEY) {
        throw new TemplateError('Spreadsheet is not found');
      }

      setAttachingError(null);
    } catch (error) {
      setAttachingError(error);
      authState.sheetId.set(null);
    }
  }

  const handleFetchClick = async () => {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1MenH8sjNj5_lDjbQClo15lQ4W2Q_PZmTIX9_m_ogNuc',
        range: "'Бюджет'!A1",
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
      });

      const range = response.result;

      console.log(range);

      const newRange = {
        values: [[2]],
      };

      const result = await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: '1MenH8sjNj5_lDjbQClo15lQ4W2Q_PZmTIX9_m_ogNuc',
        range: "'Бюджет'!A1",
        valueInputOption: 'RAW',
        resource: newRange,
      });

      console.log(result);
    } catch (response) {
      console.log(response);
    }
  };

  const attachStatus = 
    authState.sheetId.value ?
      <p className='attach-status green-text text-darken-3'>
        Spreadsheet is successfully attached
      </p>
    :
      attachingError ?
        <p className='attach-status red-text text-darken-3'>
          {attachingError.message}
        </p>
      :
        null
  ;

  return (
    <Modal 
      className='bar__popup card green lighten-5 fade-in__top-right'
      openedState={openedState}
      layoutOpacity='0'
    >
      <div className='card-content'>
        <div className='popup__account'>
          <img 
            src={userInfo.imageUrl} 
            alt='User pic'
            className='popup__user-image'
          />
          <p>
            {userInfo.name}
          </p>
          <p>
            {userInfo.email}
          </p>
          <button onClick={handleLogOutClick} className='btn-small green darken-3 z-depth-0'>
            Log out
          </button>
          <button onClick={handleRevokeAccessClick} className='btn-small green darken-3 z-depth-0'> 
            Revoke access
          </button>
        </div>
        <hr/>
        <div className='input-container'>
          <TextInput
            id='popup_sheetUrl' 
            label='Spreadsheet URL'
            inputState={sheetUrlState}
            defaultValue={authState.sheetId.value}
          />
          <button 
            onClick={handleAttachClick} 
            className='btn-small green darken-3 z-depth-0'
          >
            Attach
          </button>
        </div>
        {attachStatus}
      </div>
    </Modal>
  );
}