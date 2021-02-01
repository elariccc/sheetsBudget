import GoogleAuth from '../googleAuth/index';

import './index.css';

export default function MenuBar({authState, showMessage}) {
  return (
    <nav className='menuBar green'>
      <GoogleAuth authState={authState} showMessage={showMessage}/>
      
    </nav>
  );
}