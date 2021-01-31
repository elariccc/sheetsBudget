import GoogleAuth from '../googleAuth/index';

import './index.css';

export default function MenuBar({authState}) {
  return (
    <nav>
      <div className='menuBar green'>
        <GoogleAuth authState={authState} />
      </div>
    </nav>
  );
}