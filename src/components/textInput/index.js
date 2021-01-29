import './index.css';
import { useState, useEffect } from 'react';

export default function TextInput({id, label, inputState, defaultValue}) {
  const [active, setActive] = useState(false);

  useEffect(
    () => {
     if (defaultValue) setActive(true);
     return () => {
       inputState.set(null);
     }
    },
    [defaultValue, inputState]
  );

  const handleInputChange = (event) => {
    inputState.set(event.target.value);
  };

  const handleInputFocus = () => {
    setActive(true);
  };

  const handleInputBlur = (event) => {
    if (event.target.value === '') setActive(false);
  };

  const handleLabelClick = (event) => {
    if (active) event.preventDefault();
  };

  let labelClass = 'text-input__label';
  if (active) labelClass += ' text-input__label--active';

  return (
    <div className='text-input'>
      <input 
        autoComplete='off' 
        id={id} 
        type='text' 
        value={inputState.value}
        defaultValue={defaultValue}
        className='text-input__field'
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
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