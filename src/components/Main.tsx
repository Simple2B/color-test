'use client';
import React, { useEffect, useState } from 'react';
import { ColorQuestion } from './colorQuestion/ColorQuestion';
import { ThanksMessage } from './ThanksMessage';

export const Main = () => {
  const [isQuestionShowed, setQuestionShowed] = useState(true);
  const [isVoteResultReceived, setVoteResultReceived] = useState(false);

  const handleQuestionShowed = () => {
    setQuestionShowed(false);
  };

  
  return (
    <div className='h-full flex items-center bg-gray-700'>
      <section className="rounded-lg p-8 mx-auto bg-gray-800">
        <div className="flex flex-col gap-8">  
          {isQuestionShowed ? (  
            <ColorQuestion 
              handleQuestionShowed={handleQuestionShowed} 
              setVoteResultReceived={setVoteResultReceived}
            />
          ): 
            <ThanksMessage isVoteResultReceived={isVoteResultReceived} />        
          }
        </div>
      </section>
    </div>
  );
};