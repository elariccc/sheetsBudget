import { gapi } from 'gapi-script';
import { useState, useMemo } from 'react';
import deepClone from '../../functions/index';

import Input from '../../components/input/index';
import InputDate from '../../components/inputDate/index';
import InputSwitch from '../../components/inputSwitch/index';

import './index.css';

export default function Transactions({authState, updateData, transactionsData}) {
  const isTransactionsLoaded = !!transactionsData.length;
  
  const rows = useMemo( 
    () => {
      return isTransactionsLoaded ?
        transactionsData.map(
          (row, index) => {
            const handleDeleteClick = async () => {
              const emptyValues = new Array(699).fill(new Array(3).fill(''));

              const newValues = deepClone(transactionsData);
              newValues.splice(index, 1);

              const emptyBody = {
                range: "'Бюджет'!A3",
                values: emptyValues,
              };

              const newBody = {
                range: "'Бюджет'!A3",
                values: newValues,
              };

              const newData = [emptyBody, newBody];

              const requestBody = {
                data: newData,
                valueInputOption: 'USER_ENTERED',
              };

              await gapi.client.sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: authState.spreadsheetId.value,
                resource: requestBody,
              });

              updateData();
            }

            let purpose;
            let earned = false;
  
            if (row[2]) {
              const words = row[2].toString().split(' ');
              const earnedIndex = words.indexOf('зарплата');
  
              if (earnedIndex !== -1) {
                words.splice(earnedIndex, 1);
                purpose = words.join(' ');
                earned = true;
              } else {
                purpose = row[2];
              }
            }
  
            return (
              <TransRow
                date={row[0]}
                amount={row[1] ? row[1] : '\u00A0'}
                purpose={purpose ? purpose : '\u00A0'}
                earned={earned}
                key={index}
                handleDeleteClick={handleDeleteClick}
              />
            );
          }
        ).reverse()
      : 
        null;
    },
    [isTransactionsLoaded, transactionsData, authState.spreadsheetId.value, updateData]
  );

  const activeClass = isTransactionsLoaded ? 'trans__table--active' : null;

  return (
    <div className='trans-container card green lighten-5'>
      <h2 className='green-text text-darken-4'>Transactions</h2>
      <hr/>
      <div className={`trans__table ${activeClass}`}>
        <TransForm
          authState={authState}
          updateData={updateData}
        />
        {rows}
      </div>
    </div>
  );
}

function TransForm({authState, updateData}) {
  const [ date, setDate ] = useState(new Date().toISOString().substr(0,10));
  const dateState = useMemo(
    () => (
      {
        value: date,
        set: setDate,
      }
    ),
    [ date, setDate ]
  );

  const [ amount, setAmount ] = useState('');
  const amountState = useMemo(
    () => (
      {
        value: amount,
        set: setAmount,
      }
    ),
    [ amount, setAmount ]
  );

  const [ purpose, setPurpose ] = useState('');
  const purposeState = useMemo(
    () => (
      {
        value: purpose,
        set: setPurpose,
      }
    ),
    [ purpose, setPurpose ]
  );

  const [ earned, setEarned ] = useState(false);
  const earnedState = useMemo(
    () => (
      {
        value: earned,
        set: setEarned,
      }
    ),
    [ earned, setEarned ]
  );

  const colorClass = earned ? 'green lighten-4' : 'grey lighten-3';

  async function handleFormSubmit(event) {
    event.preventDefault();

    const transBody = {
      values: [
        [
          date,
          amount,
          ( earned ? 'зарплата ' : '' ) + purpose
        ]
      ]
    };

    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: authState.spreadsheetId.value,
      range: "'Бюджет'!A3",
      valueInputOption: 'USER_ENTERED',
      resource: transBody,
    });

    updateData();

    setDate(new Date().toISOString().substr(0,10));
    setAmount('');
    setPurpose('');
    setEarned(false);

    const inputs = event.target.querySelectorAll('input');

    inputs.forEach(
      input => {
        input.focus(); input.blur();
      }
    );
  }

  return (
    <form 
      className='trans__row-container'
      onSubmit={handleFormSubmit}
    >
      <div className={`trans__row ${colorClass}`}>
        <InputDate
          inputState={dateState}
        />
        <Input
          inputState={amountState}
          label='Amount of money'
          id='moneyAmount'
          type='number'
          required={true}
        />
        <Input
          inputState={purposeState}
          id='purpose'
          type='text'
          label='Purpose'
        />
        <InputSwitch
          inputState={earnedState}
          label={{left:'Spent', right:'Earned'}}
        />
      </div>
      <button 
        className='material-icons trans__submit green-text text-darken-4'
        type='submit'
      >add_circle_outline</button>
    </form>
  );
}

function TransRow({date, amount, purpose, earned, handleDeleteClick}) {
  const colorClass = earned ? 'green lighten-4' : 'grey lighten-3';

  return (
    <form 
      className='trans__row-container'
    >
      <div className={`trans__row ${colorClass}`}>
        <span>{date}</span>
        <span className='row__amount'>{amount.toLocaleString('fr-Fr', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        <span>{purpose}</span>
        <span>{earned ? 'Earned' : 'Spent'}</span>
      </div>
      <button 
        className='material-icons trans__submit green-text text-darken-4'
        type='button'
        onClick={handleDeleteClick}
      >backspace</button>
    </form>
  );
}