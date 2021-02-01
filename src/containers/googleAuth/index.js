import React, { useEffect, useMemo, useState } from 'react';

import { gapi } from 'gapi-script';

import Popup from '../popup/index';
import LoadBar from '../../components/loadBar/index';

import { API_KEY, CLIENT_ID, SCOPES, DISCOVERY_DOCS, TEMPLATE_KEY, SPREADSHEET_ID } from '../../constants/index';

import './index.css';

export default function GoogleAuth({authState, showMessage}) {
  const [ isInited, setIsInited ] = useState(false);
  const [ loadingStatus, setLoadingStatus ] = useState(null);
  const [ attachingError, setAttachingError ] = useState(null);

  const [ googleAuth, setGoogleAuth ] = useState(null);
  const googleAuthState = useMemo (
    () => (
      {
        value: googleAuth,
        set: setGoogleAuth,
      }
    ),
    [googleAuth, setGoogleAuth]
  );

  const [ popupOpened, setPopupOpened ] = useState(false);
  const popupOpenedState = useMemo(
    () => (
      {
        value: popupOpened,
        set: setPopupOpened,
      }
    ),
    [popupOpened, setPopupOpened]
  );

  useEffect(
    () => {
      if (!isInited && !authState.isSignedIn.value) {
        setLoadingStatus('Initiating Google API client');
        
        gapi.load('client:auth2', {
          callback: initClient,
          timeout: 5000,
          ontimeout: handleTimeout,
        });
      }

      async function initClient() {
        try {
          await gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPES,
            'discoveryDocs': DISCOVERY_DOCS,
          });
  
          setIsInited(true);
  
          const googleAuthInstance = gapi.auth2.getAuthInstance();
  
          setGoogleAuth(googleAuthInstance);
          googleAuthInstance.isSignedIn.listen(() => authState.isSignedIn.set(googleAuthInstance.isSignedIn.get()));
          authState.isSignedIn.set(googleAuthInstance.isSignedIn.get());

          showMessage('Google API client has been initiated');
        } catch (error) {
          console.log(error.error.message);
        } finally {
          setLoadingStatus(null);
        }
      }

      function handleTimeout() {
        console.log('Request is timed out');
        setLoadingStatus(null);
      }
    },
    [isInited, authState.isSignedIn, showMessage]
  );

  useEffect(
    () => {
      if (authState.isSignedIn.value && !authState.spreadsheetId.value) {
        attachSpreadsheet();
      }

      async function attachSpreadsheet() {
        try {
          setLoadingStatus('Fetching list of spreadsheet files from your drive');

          const spreadsheetsResponse = await gapi.client.drive.files.list({
            q: `mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false and not name = 'OriginTemplate'`,
            fields: 'nextPageToken, files(id, name)',
          });
    
          const spreadsheetIds = spreadsheetsResponse.result.files.map(file => file.id);
    
          let spreadsheetWithCorrectKeyId;
    
          for (let i = 0; i < spreadsheetIds.length; i++) {
            setLoadingStatus(`Looking for a budget spreadsheet, ${i + 1}/${spreadsheetIds.length}`);
            
            let keyResponse;
    
            try {
              keyResponse = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetIds[i],
                range: "'Сводная таблица'!I20",
                valueRenderOption: 'UNFORMATTED_VALUE',
                dateTimeRenderOption: 'FORMATTED_STRING',
              });
            } catch (response) {
              keyResponse = response;
            }
    
            const fetchedKey = 
              keyResponse.result?.values ?
                keyResponse.result.values[0][0]
              :
                null
            ;
    
            if (fetchedKey === TEMPLATE_KEY) {
              spreadsheetWithCorrectKeyId = spreadsheetIds[i];
              break;
            }
          }
    
          if (!spreadsheetWithCorrectKeyId) {
            setLoadingStatus('Budget spreadsheet has not been found. Creating a new one')

            const templateResponse = await gapi.client.sheets.spreadsheets.get({
              spreadsheetId: SPREADSHEET_ID,
              ranges: [],
              includeGridData: true,
            });
      
            const newSpreadsheet = templateResponse.result;
            newSpreadsheet.spreadsheetId = undefined;
            newSpreadsheet.spreadsheetUrl = undefined;
            newSpreadsheet.properties.title = 'Budget';
      
            const templateRequest = await gapi.client.sheets.spreadsheets.create({}, newSpreadsheet);
            
            authState.spreadsheetId.set(templateRequest.result.spreadsheetId);
          } else {
            authState.spreadsheetId.set(spreadsheetWithCorrectKeyId);
          }

          showMessage('Your budget spreadsheet has been attached')

          setLoadingStatus(null);
        } catch (response) {
          setAttachingError(response.result.error.message);
          setLoadingStatus(null);
        }
      }
    },
    [authState.isSignedIn.value, showMessage, authState.spreadsheetId]
  )

  const handleLogInClick = () => {
    if (isInited) googleAuth.signIn();
  };

  const handleUserImageClick = () => {
    setPopupOpened(prevState => !prevState);
  }

  const userInfo = 
    authState.isSignedIn.value ?
      {
        name: googleAuth.currentUser.get().getBasicProfile().getName(),
        email: googleAuth.currentUser.get().getBasicProfile().getEmail(),
        imageUrl: googleAuth.currentUser.get().getBasicProfile().getImageUrl(),
      }
    : 
      {}
  ;

  let buttonClass = 'btn green darken-3';
  if (!isInited) buttonClass += ' disabled';

  const barButton = 
    authState.isSignedIn.value ?
      <div className='bar__image-container'>
        <img 
          src={userInfo.imageUrl} 
          alt='User pic' 
          className={`bar__user-image ${popupOpened ? 'bar__user-image__active' : ''}`}
          onClick={handleUserImageClick}
        />
      </div>
    :
      <button
        onClick={handleLogInClick}
        className={buttonClass}
      >
        Log in
      </button>
  ;

  return (
    <React.Fragment>
      <div className='bar__account-button'>
        {barButton}
      </div>
      <Popup 
        authState={authState}
        googleAuthState={googleAuthState}
        openedState={popupOpenedState}
        userInfo={userInfo}
        attachingError={attachingError}
      />
      <LoadBar status={loadingStatus}/>
    </React.Fragment>
  );
}