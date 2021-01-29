import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function Layout({color = 'black', opacity = 0.5, onClick}) {
  const [layoutEl, setLayoutEl] = useState(null);

  useEffect(
    () => {
      const divLayout = document.createElement('div');
      divLayout.id = nanoid();
      document.getElementsByTagName("BODY")[0].appendChild(divLayout);
      setLayoutEl(divLayout);

      return (
        () => {
          divLayout.remove();
        }
      );
    },
    []
  )

  return (
    layoutEl ?
      ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            backgroundColor: color,
            opacity: opacity,
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
          onClick={onClick}
        ></div>,
        layoutEl
      )
    : 
      null
  );
}