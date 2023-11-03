import React from 'react';
import { Spinner } from './Spinner';

interface IThanksMessageProps{
    isVoteResultReceived: boolean
}

export const ThanksMessage = ({isVoteResultReceived}: IThanksMessageProps) => {
  return (
    <div className='flex justify-center'>
      {isVoteResultReceived ? (
        <p className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white text-center"> 
        Thank you for playing!
        </p>
      ): 
        <Spinner />
      }
    </div>
  );
};