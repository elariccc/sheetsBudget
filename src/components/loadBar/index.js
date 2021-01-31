import React, { useEffect, useMemo, useState } from 'react';

import Modal from '../modal/index';

import './index.css';

export default function LoadBar({status}) {
  const [ dotsLoader, setDotsLoader ] = useState('');

  const [ opened, setOpened ] = useState(false);
  const openedState = useMemo (
    () => (
      {
        value: opened,
        set: setOpened,
      }
    ),
    [opened, setOpened]
  );

  useEffect(
    () => {
      const dotsInterval = setInterval(
        () => {
          setDotsLoader(prevState => 
            prevState.length === 3 ?
              ''
            :
              prevState + '.'
          );
        },
        750
      );

      return () => {
        clearInterval(dotsInterval);
      }
    },
    []
  );

  useEffect(
    () => {
      setOpened(!!status);
    },
    [status]
  )

  return (
    <Modal
      className='load-bar card green darken-4 white-text'
      openedState={openedState}
    >
      <p>{status + dotsLoader}</p>
    </Modal>
  )
}