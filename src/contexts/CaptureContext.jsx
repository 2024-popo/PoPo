import React, { createContext, useState } from 'react';

const CaptureContext = createContext();

export const CaptureProvider = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  const clearCapturedImage = () => {
    setCapturedImage(null);
  };

  return (
    <CaptureContext.Provider value={{ capturedImage, setCapturedImage, clearCapturedImage }}>
      {children}
    </CaptureContext.Provider>
  );
};

export default CaptureContext;
