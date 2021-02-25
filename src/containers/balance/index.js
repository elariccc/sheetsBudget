import { useEffect, useState } from 'react';

import './index.css';

export default function Balance({value, show}) {
  const [numbers, setNumbers] = useState(new Array(9).fill('\u00A0'));

  useEffect(
    () => {
      const originNumbers = Array.from(String(Number(value).toFixed(2)));
      const newNumbers = new Array(9 - originNumbers.length).fill('\u00A0');
      newNumbers.push(...originNumbers);
      setNumbers(newNumbers);
    },
    [value]
  );

  const numberEls = numbers.map(
    (number, position) => <BalanceNumber number={number} key={position} thousand={position === 2}/>
  );

  return (
    show ?
      <div className='menu-bar__balance'>
        <p className='balance__label white-text'>Balance:</p>
        {numberEls}
      </div>
    :
      null
  );
}

function BalanceNumber({number, thousand}) {
  const [ topNumber, setTopNumber ] = useState('\u00A0');
  const [ bottomNumber, setBottomNumber ] = useState('\u00A0');
  const [ isChanging, setIsChanging ] = useState(false);

  let containerAnimation = '';
  let topNumberAnimation = '';
  let bottomNumberAnimation = '';

  if (isChanging) {
    containerAnimation = ' number-container--change';
    topNumberAnimation = ' number-top--change';
    bottomNumberAnimation = ' number-bottom--change'
  }

  const containerClass = 'balance__number-container' + containerAnimation;
  const topNumberClass = 'balance__number' + topNumberAnimation;
  const bottomNumberClass = 'balance__number' + bottomNumberAnimation;

  const maskClass = 'balance__number-mask card green lighten-4'
    + (thousand ? ' mask--thousand' : '');

  useEffect(
    () => {
      if (number !== topNumber) {
        setIsChanging(true);
        setBottomNumber(number);

        setTimeout(
          () => {
            setTopNumber(number);
            setIsChanging(false);
          },
          995
        )
      }
    },
    [number, topNumber]
  )

  return (
    <div className={maskClass}>
      <div className={containerClass}>
        <p className={topNumberClass}>{topNumber}</p>
        <p className={bottomNumberClass}>{bottomNumber}</p>
      </div>
    </div>
  );
}