import React, { useEffect, useMemo, useState } from 'react';

import {gapi} from 'gapi-script';

import Popup from '../popup/index';

import { API_KEY, CLIENT_ID, SCOPES, DISCOVERY_DOCS } from '../../constants/index';

import './index.css';

export default function GoogleAuth({authState}) {
  const [ isInited, setIsInited ] = useState(false);

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
      gapi.load('client:auth2', initClient);

      function initClient() {
        gapi.client.init({
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
      }
    },
    []
  );

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

  const barButton = 
    !isInited ?
      <div className='progress'>
        <div className='indeterminate'></div>
      </div>
    :
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
      <Popup 
        authState={authState}
        googleAuthState={googleAuthState}
        openedState={popupOpenedState}
        userInfo={userInfo}
      />
    </React.Fragment>
  );
}