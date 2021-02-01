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
    openedState.set(false);
  };

  const handleRevokeAccessClick = () => {
    googleAuthState.value.disconnect();
    openedState.set(false);
  };

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
      </div>
    </Modal>
  );
}