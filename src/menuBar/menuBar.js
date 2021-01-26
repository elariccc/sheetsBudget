import React, {useState, useMemo} from 'react';
import GoogleAuthComponent from '../googleAuthComponent/googleAuthComponent';
import '../materialize/palette.css';
import '../materialize/grid.css';
import './menuBar.css';

export default function MenuBar() {
  const [isInited, setIsInited] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const authState = useMemo(
    () => {
      return {
        inited: {
          state: isInited,
          set: setIsInited,
        },
        signedIn: {
          state: isSignedIn,
          set: setIsSignedIn,
        },
      }
    },
    [isInited, setIsInited, isSignedIn, setIsSignedIn]
  );

  return (
    <nav>
      <div className='menuBar green'>
        <GoogleAuthComponent authState={authState} />
      </div>
    </nav>
  );
}