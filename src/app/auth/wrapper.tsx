
import React from "react";
import ImageComponent from "./ImageComponent";

const Wrapper = ({
  children,
  isSignedIn = false,
}: {
  children: React.ReactNode;
  isSignedIn: boolean;
}) => {
  return (
    <div className="w-full min-h-screen flex bg-red-600">
      {isSignedIn && (
        <>
          <ImageComponent isSignedIn={isSignedIn} />
          {children}
        </>
      )}

      {!isSignedIn && (
        <>
          {children}
          <ImageComponent />
        </>
      )}
    </div>
  );
};

export default Wrapper;
