import { useState, useEffect } from 'react';


const useOrientation = () => {
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return isPortrait;
  };

export default useOrientation