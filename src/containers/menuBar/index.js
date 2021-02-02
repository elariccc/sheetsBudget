import GoogleAuth from '../googleAuth/index';
import Balance from '../balance/index';

import './index.css';

export default function MenuBar({authState, balance, showMessage}) {
  return (
    <nav className='menu-bar green'>
      <Balance value={balance} show={authState.isSignedIn.value}/>
      <GoogleAuth authState={authState} showMessage={showMessage}/>
    </nav>
  );
}