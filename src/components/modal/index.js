import React from 'react';

import Layout from "../layout/index";

export default function Modal ({
  openedState, 
  children, 
  className,
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
        <Layout 
          onClick={handleLayoutClick}
          opacity={layoutOpacity}
          color={layoutColor}
        />
      </React.Fragment>
    : 
      null
  );
}