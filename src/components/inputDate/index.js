import './index.css';

export default function InputDate ({inputState}) {
  const handleInputChange = (event) => {
    inputState.set(event.target.value);
  };

  return (
    <input 
      autoComplete='off' 
      type='date' 
      value={inputState.value}
      className='date-input'
      onChange={handleInputChange}
    />
  );
}