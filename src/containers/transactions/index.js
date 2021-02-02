import './index.css';

export default function Transactions() {
  var date = new Date().toISOString().substr(0,10);

  return (
    <div className='transactions-container green lighten-5'>
      <p>Transactions</p>
      <hr/>
      <input type='date' className='trans__input-date' defaultValue={date}/>
    </div>
  );
}