import './textInput.css';
import { useState } from 'react';

export default function TextInput({id, label}) {
  const [active, setActive] = useState(false);

  return (
    <div className='text-input'>
      <input autocomplete='off' id={id} type='text' className='text-input__field'/>
      <label htmlFor={id} className='text-input__label'>{label}</label>
    </div>
  );
}