import React from 'react';

const ErrorMessageBox = ({ message }: { message: string }) => {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
      ></div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
        <strong className="font-bold">Erro!</strong>
        <br />
        <span className="block sm:inline">{message}</span>
      </div>
    </>
  );
};

export default ErrorMessageBox;
