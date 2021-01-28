import { useEffect, useState } from 'react';
import {gapi} from 'gapi-script';

import './googleAuthComponent.css';
import '../../materialize/button.css';
import '../../materialize/shadow.css';
import '../../materialize/card.css';
import '../../materialize/preloader.css';
import '../../materialize/fade.css';
import '../../materialize/textInput.css';

import React from 'react';
import Modal from "../../components/modal";

let googleAuth;
const API_KEY = 'AIzaSyD7EpkVfwnYbLmrpFxtnKX7EzqgXgHZO_Y';
const CLIENT_ID = '811477700755-dhv125fsgng4sss3mghpobho9dvtlvb5.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets';
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

export default function GoogleAuthComponent({authState}) {
  const [popupOpened, setPopupOpened] = useState(false);

  useEffect(
    () => {
      gapi.load('client:auth2', initClient);

      function initClient() {
        gapi.client.init({
          'apiKey': API_KEY,
          'clientId': CLIENT_ID,
          'scope': SCOPES,
          'discoveryDocs': DISCOVERY_DOCS,
        });

        authState.inited.set(true);

        googleAuth = gapi.auth2.getAuthInstance();
        googleAuth.isSignedIn.listen(() => authState.signedIn.set(googleAuth.isSignedIn.get()));
        authState.signedIn.set(googleAuth.isSignedIn.get());
        console.log(googleAuth.currentUser.get().getBasicProfile());
      }
    },
    []
  );

  const handleLogInClick = () => {
    if (authState.inited.state && !authState.signedIn.state) googleAuth.signIn();
  };

  const handleLogOutClick = () => {
    if (authState.inited.state && authState.signedIn.state) {
      googleAuth.signOut();
      setPopupOpened(false);
    }
  };

  const handleRevokeAccessClick = () => {
    if (authState.inited.state && authState.signedIn.state) {
      googleAuth.disconnect();
      setPopupOpened(false);
    }
  };

  const handleFetchClick = async () => {
    if (authState.signedIn.state) {
      try {
        console.log(gapi.client.sheets.spreadsheets.values);
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
    }
  };

  const handleUserImageClick = () => {
    setPopupOpened(prevState => !prevState);
  }

  const userInfo = authState.signedIn.state 
    ? {
      name: googleAuth.currentUser.get().getBasicProfile().getName(),
      email: googleAuth.currentUser.get().getBasicProfile().getEmail(),
      imageUrl: googleAuth.currentUser.get().getBasicProfile().getImageUrl(),
    }
    : {};

  const barButton = 
  !authState.inited.state ?
    <div className='progress'>
      <div className='indeterminate'></div>
    </div>
  :
    authState.signedIn.state ?
      <div className='bar__image-container'>
        <img 
          src={userInfo.imageUrl} 
          alt={userInfo.name} 
          className={`bar__user-image ${popupOpened ? 'bar__user-image__active' : ''}`}
          onClick={handleUserImageClick}
        />
      </div>
    :
      <button
        onClick={handleLogInClick}
        className='btn green darken-3'
      >
        Log in
      </button>
    ;

  return (
    <React.Fragment>
      <div className='bar__account-button'>
        {barButton}
      </div>
      <Modal 
        className='bar__popup card green lighten-5 fade-in__top-right'
        opened={popupOpened}
        setOpened={setPopupOpened}
        layoutOpacity='0'
      >
        <div className='card-content'>
          <div className='popup__account'>
            <img 
              src={userInfo.imageUrl} 
              alt={userInfo.name} 
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
          <div class='input-field'>
            <input id='popup__sheetId' type='text' class='validate'/>
            <label htmlFor='popup__sheetId'>Spreadsheet ID</label>
          </div>
          <button onClick={handleFetchClick} className='btn green darken-3 z-depth-0'>
            fetch data
          </button>
        </div>
      </Modal>
    </React.Fragment>
  );
}