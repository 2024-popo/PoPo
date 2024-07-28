import React, { createContext, useState } from 'react';

const CaptureContext = createContext();

export const CaptureProvider = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <CaptureContext.Provider value={{ capturedImage, setCapturedImage }}>
      {children}
    </CaptureContext.Provider>
  );
};

export default CaptureContext;
