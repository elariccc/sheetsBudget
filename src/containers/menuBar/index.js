import NavBar from '../navBar/index';
import Balance from '../balance/index';
import GoogleAuth from '../googleAuth/index';

import './index.css';

export default function MenuBar({authState, balance, showMessage}) {
  return (
    <nav className='menu-bar green'>
      <NavBar/>
      <Balance value={balance} show={authState.isSignedIn.value}/>
      <GoogleAuth authState={authState} showMessage={showMessage}/>
    </nav>
  );
}