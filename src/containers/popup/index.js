import Modal from '../../components/modal/index';

import './index.css';

export default function Popup({
  authState,
  googleAuthState,
  openedState,
  userInfo,
  attachingError,
}) {
  const handleLogOutClick = () => {
    googleAuthState.value.signOut();
    authState.spreadsheetId.set(null);
    openedState.set(false);
  };

  const handleRevokeAccessClick = () => {
    googleAuthState.value.disconnect();
    authState.spreadsheetId.set(null);
    openedState.set(false);
  };

  const attachStatus = 
    authState.spreadsheetId.value ?
      <p className='attach-status green-text text-darken-3'>
        Spreadsheet is successfully attached
      </p>
    :
      attachingError ?
        <p className='attach-status red-text'>
          {attachingError}
        </p>
      :
        null
  ;

  return (
    <Modal 
      className='bar__popup card green lighten-5 fade-in__top-right'
      openedState={openedState}
      renderLayout
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
        {attachStatus}
      </div>
    </Modal>
  );
}