import React, { useEffect, useState } from 'react';
import { Spinner } from '../Spinner';
import { ErrorMessage } from '../ErrorMessage';
import { IError, IData } from './interfaces';

type IColorQuestionProps = {
    handleQuestionShowed: () => void,
    setVoteResultReceived: (value: boolean) => void
}

export const ColorQuestion = ({ handleQuestionShowed, setVoteResultReceived}: IColorQuestionProps) => {
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IData>();
  const [isColorsLoaded, setColorsLoaded] = useState(false);


  useEffect(() => {
    fetch(`/api/displayData`)
      .then(res => res.json())
      .then(data=> {
        setData(data.data);
        setColorsLoaded(true);
      })
      .catch(err => {
        setError({
          error: true,
          message: err.message
        });
      });
  }, []);
  

  const handleClick = async (id: string | undefined, color: string | undefined) => {
    if(!id || !color) {
      setError({message: 'id or color is undefined', error: true});
      return;
    }

    handleQuestionShowed();
    setVoteResultReceived(false);
      
    await fetch(`/api/create-vote?id=${id}&color=${color}`)
      .then(res => res.json())
      .then(data=> {    
        setVoteResultReceived(true);
      })
      .catch((err: IError) => {
        setError({
          error: true,
          message: err.message
        });
      });        
  };

      
  return (
    <>
      {error && (
        <p className='text-red-500'>
          <ErrorMessage message={error.message} />
        </p>        
      )}
      <p className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white text-center">
            What is your favorite color?
      </p>
      <div className='w-full flex justify-evenly flex-wrap gap-4 items-center'>   
        {isColorsLoaded ? (  
          <>
            <button 
              className='text-lg text-white bg-gradient-to-br w-48 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2' 
              onClick={()=>{
                handleClick(data?.Index, data?.Color1);
              }}>
              {data?.Color1}
            </button>
            <button 
              className='text-lg text-white bg-gradient-to-br w-48 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2' 
              onClick={()=>{
                handleClick(data?.Index, data?.Color2);
              }}>
              {data?.Color2}
            </button>
          </>) 
          : 
          <Spinner />      
        }   
        
      </div>
    </>
  );
};