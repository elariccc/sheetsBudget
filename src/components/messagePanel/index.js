import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

import './index.css';

const disappearDelay = 4000;

export default function MessagePanel({message}) {
  const [ messageEls, setMessageEls ] = useState([]);

  useEffect(
    () => {
      if (message) {
        setMessageEls(
          prevEls => {
            const newEls = [...prevEls];
            newEls.push(<MessageElement message={message} key={nanoid()}/>);
            return newEls;
          }
        );

        setTimeout(
          () => {
            setMessageEls(
              prevEls => {
                const newEls = [...prevEls];
                newEls.shift();
                return newEls;
              }
            );
          },
          disappearDelay
        );
      }
    },
    [message]
  );

  return (
    <div
      className='message-panel'
    >
      {messageEls}
    </div>
  );
}

function MessageElement ({message}) {
  const [animation, setAnimation] = useState('slide-in__right');

  useEffect(
    () => {
      setTimeout(
        () => setAnimation('slide-out__right'),
        disappearDelay - 290
      );
    },
    []
  );

  const messageClass = `message-element card green lighten-3 ${animation}`;

  return (
    <div
      className={messageClass}
    >
      <p>{message}</p>
    </div>
  );
}