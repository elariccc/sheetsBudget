import { useEffect, useState } from 'react';
import {gapi} from 'gapi-script';
import './googleAuthComponent.css';
import '../materialize/button.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from "../components/modal";

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
        }).then(() => {
          authState.inited.set(true);

          googleAuth = gapi.auth2.getAuthInstance();
          googleAuth.isSignedIn.listen(() => authState.signedIn.set(googleAuth.isSignedIn.get()));
          authState.signedIn.set(googleAuth.isSignedIn.get());
          console.log(googleAuth.currentUser.get().getBasicProfile());
        });
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
    if (authState.inited.state && authState.signedIn.state) googleAuth.disconnect();
  };

  const handleFetchClick = async () => {
    if (authState.signedIn.state) {
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
    }
  };

  const handleUserImageClick = () => {
    setPopupOpened(prevState => !prevState);
  }

  const userInfo = authState.signedIn.state 
    ? {
      name: googleAuth.currentUser.get().getBasicProfile().getName(),
      imageUrl: googleAuth.currentUser.get().getBasicProfile().getImageUrl(),
    }
    : {};

  const barButton = authState.signedIn.state
    ? (
      <div className='image-container'>
        <img 
          src={userInfo.imageUrl} 
          alt={userInfo.name} 
          className={`user-image ${popupOpened ? 'user-image__active' : ''}`}
          onClick={handleUserImageClick}
        />
      </div>
    )
    : (
      <button
        onClick={handleLogInClick}
        className='btn green darken-3'
      >
        Log in
      </button>
    );

  // const popup = popupOpened
  //   ? (
  //     <div className='bar__popup'>
  //       <Layout/>
  //       <button onClick={handleLogOutClick}>
  //         Log out
  //       </button>
  //       <button onClick={handleRevokeAccessClick}>
  //         Revoke access
  //       </button>
  //       <button onClick={handleFetchClick}>
  //         fetch data
  //       </button>
  //     </div>
  //   )
  //   : null;

  return (
    <React.Fragment>
      <div className='bar__account-button'>
        {barButton}
      </div>
      <Modal 
        className='bar__popup'
        opened={popupOpened}
        setOpened={setPopupOpened}
        layoutOpacity='0'
      >
        <button onClick={handleLogOutClick}>
          Log out
        </button>
        <button onClick={handleRevokeAccessClick}>
          Revoke access
        </button>
        <button onClick={handleFetchClick}>
          fetch data
        </button>
      </Modal>
    </React.Fragment>
  );
}