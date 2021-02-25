import './index.css';
import { useState, useEffect } from 'react';

export default function Input({id, label, inputState, type, required}) {
  const [active, setActive] = useState(false);

  useEffect(
    () => {
     if (inputState.value) setActive(true);
    },
    [inputState.value]
  );

  const handleInputChange = (event) => {
    inputState.set(event.target.value);
  };

  const handleInputFocus = () => {
    setActive(true);
  };

  const handleInputBlur = () => {
    if (inputState.value === '') setActive(false);
  };

  const handleLabelClick = (event) => {
    if (active) event.preventDefault();
  };

  let labelClass = 'input__label';
  if (active) labelClass += ' input__label--active';

  return (
    <div className='input'>
      <input 
        autoComplete='off' 
        id={id} 
        type={type} 
        value={inputState.value}
        className='input__field'
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        required={required}
      />
      <label 
        htmlFor={id}
        className={labelClass}
        onMouseDown={handleLabelClick}
      >
        {label}
      </label>
    </div>
  );
}