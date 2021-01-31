import React from 'react';

import Layout from "../layout/index";

export default function Modal ({
  openedState, 
  children, 
  className,
  renderLayout,
  layoutOpacity,
  layoutColor,
}) {
  const handleLayoutClick = () => {
    openedState && openedState.set(false);
  }

  const opened = 
    openedState ?
      openedState.value
    : 
      true
  ;

  return (
    opened ? 
      <React.Fragment>
        <div 
          style={{zIndex: '1001'}}
          className={className}
        >
          {children}
        </div>
        {
        renderLayout ?
          <Layout 
            onClick={handleLayoutClick}
            opacity={layoutOpacity}
            color={layoutColor}
          />
        :
          null
        }
      </React.Fragment>
    : 
      null
  );
}