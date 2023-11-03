import React from 'react';

type IErrorMessage = {
    message: string
}

export const ErrorMessage = ({message}: IErrorMessage) => {
  return (
    <div className='fixed top-5 left-5 p-4 bg-gray-900 text-red-700 font-semibold rounded-lg'>
      {message}
    </div>
  );
};