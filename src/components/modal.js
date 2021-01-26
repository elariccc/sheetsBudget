import Layout from "./layout";

export default function Modal ({
  opened, 
  setOpened, 
  children, 
  className,
  layoutOpacity,
  layoutColor,
}) {
  const handleLayoutClick = () => {
    setOpened && setOpened(false);
  }

  return opened
    ? <>
        <div 
          style={{zIndex: '2000'}}
          className={className}
        >
          {children}
        </div>
        <Layout 
          onClick={handleLayoutClick}
          opacity={layoutOpacity}
          color={layoutColor}
        />
      </>
    : null;
}