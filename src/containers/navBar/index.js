import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import './index.css';

const tabNames = ['Transactions', 'Diagrams', 'Stonks'];


export default function NavBar() {
  const tabRefs = useRef([]);
  const [ tabElements, setTabElements ] = useState(null);
  const [ indexActive, setIndexActive ] = useState(null);
  const [ directionLeft, setDirectionLeft ] = useState(null);

  useEffect(
    () => {
      const elements = [];
      
      tabNames.forEach(
        (name, index) => {
          const classActive = 
            index === indexActive ?
              'white-text'
            :
              'grey-text text-lighten-1'
          ;

          const handleTabClick = () => {
            if (index < indexActive) setDirectionLeft(true)
              else setDirectionLeft(false);
            setIndexActive(index);
          };
          
          elements.push(
            <Link 
              ref={element => tabRefs.current[index] = element}
              key={index}  
              className={`tab ${classActive}`}
              onClick={handleTabClick}
              to={`/${name}`}
            >
              {name}
            </Link>
          );
        }
      );

      setTabElements(elements);
    },
    [ indexActive, setIndexActive, setTabElements ]
  );

  let indicator;
  
  if (tabRefs.current.length && indexActive !== null) {
    const activeTab = tabRefs.current[indexActive];
    
    const tabDimensions = {
      left: activeTab.offsetLeft,
      right: activeTab.offsetParent.offsetWidth - activeTab.offsetLeft - activeTab.offsetWidth,
    };

    const classAnimation = 
      directionLeft ?
        'indicator--to-left'
      :
        'indicator--to-right'
      ;

    indicator = (
      <div
        className={`tab__indicator z-depth-2 ${classAnimation}`}
        style={tabDimensions}
      />
    );
  }

  return (
    <div className='tab-container'>
      {tabElements}
      {indicator}
    </div>
  );
}