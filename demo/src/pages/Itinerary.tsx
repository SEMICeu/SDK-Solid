import { useState } from 'react';
import { log } from '@useid/movejs';

const Itinerary = () => {

  const [ destination, setDestination ] = useState<string>('');
  const [ start, setStart ] = useState<string>('');

  const onGenerateItinerary = () => {

    log('Handling generating itinerary');

    // TODO: implement algorithm to generate itinerary

  };

  return (
    <>
      <div className="w-full h-full flex flex-col rounded-lg bg-white">
        <h2 className="text-3xl p-4 border-b-2 border-slate-50 h-20">Where would you like to go?</h2>
        <div className="flex flex-col content-between justify-between gap-2 text-sm p-4">
          <input className="border border-emerald-500 px-3 py-2 rounded-md" placeholder="Start" type="text" value={start} onChange={(e) => setStart(e.target.value)}></input>
          <input className="border border-emerald-500 px-3 py-2 rounded-md" placeholder="Destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)}></input>
          <div className="flex flex-row gap-4 justify-end">
            <button
              className="self-end hover:bg-emerald-600 bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-default px-3 py-2 rounded-full cursor-pointer"
              disabled={destination === '' || start === ''}
              onClick={
                () => {

                  void (() => {

                    onGenerateItinerary();

                  })();

                }
              }
            >Generate itinerary</button>
          </div>
        </div>
      </div>
    </>
  );

};

export default Itinerary;
