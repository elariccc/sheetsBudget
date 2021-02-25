import './index.css';

export default function InputSwitch({inputState, label}) {
  const handleInputChange = event => {
    inputState.set(event.target.checked);
  };

  return (
    <div className='switch'>
      <label>
        {label.left}
        <input 
          type='checkbox'
          checked={inputState.value}
          onChange={handleInputChange}
        />
        <span className='lever'/>
        {label.right}
      </label>
    </div>
  );
}