import { useEffect, useState } from 'react';
import { createData, decodeIDToken, log } from '@useid/movejs';
import { JWK } from 'jose';
import { VOC_TRAVEL_PREFERENCE } from '../vocabulary';
import { TravelPreference } from '../models/travel-preference';
import { TravelMode, travelModes } from '../models/travel-mode';
import { DayOfWeek } from '../models/days-of-week';
import DaysOfWeek from './DaysOfWeek';

const TravelPreferenceForm = (i: {
  token: string;
  publicKey: JWK;
  privateKey: JWK;
  travelMode: TravelMode;
  travelPreference?: TravelPreference;
  onSaved?: () => void;
}) => {

  const [ travelPreference, setTravelPreference ] = useState<TravelPreference | undefined>(undefined);
  const [ selectedDaysOfWeek, setSelectedDaysOfWeek ] = useState<DayOfWeek[]>([]);
  // States the component can be in
  const [ state, setState ] = useState<'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR'>('INITIAL');

  useEffect(() => {

    const handleLoadResource = () => {

      if(i.travelPreference){

        setTravelPreference(i.travelPreference);
        setSelectedDaysOfWeek(i.travelPreference.daysOfWeek);

      } else {

        setSelectedDaysOfWeek([]);

      }

      // Once done, set state to loaded
      setState('LOADED');

    };

    if(travelPreference !== i.travelPreference) {

      setTravelPreference(i.travelPreference);
      setState('INITIAL');

    }

    // Load subjects only once
    if(state === 'INITIAL'){

      setState('LOADING');

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleLoadResource();

    }

  }, [ state, i.token, i.publicKey, i.privateKey, i.travelPreference, travelPreference ]);

  const onSave = async () => {

    log('Handling save');

    // Create a travel preference
    await createData(
      'https://storage.sandbox-use.id',
      VOC_TRAVEL_PREFERENCE,
      decodeIDToken(i.token).payload.webid,
      JSON.stringify({
        travelMode: i.travelMode,
        daysOfWeek: selectedDaysOfWeek,
      }),
      'application/json',
      i.token,
      i.publicKey,
      i.privateKey
    );

    if(i.onSaved) {

      i.onSaved();

    }

  };

  return (
    <>
      <div className="w-full h-full flex flex-col rounded-lg bg-white">
        <h2 className="text-3xl p-4 border-b-2 border-slate-50 h-20">Travel preference</h2>
        <div className="flex flex-col content-between justify-between gap-2 text-sm p-4">
          <DaysOfWeek
            multiple={true}
            disabled={i.travelPreference !== undefined}
            selection={selectedDaysOfWeek}
            onSelectionChanged={setSelectedDaysOfWeek} />
          {
            // Only show save button when creating preference
            decodeIDToken(i.token).payload.webid !== import.meta.env.VITE_SUBJECT_WEBID
            && travelPreference === undefined ?
              <div className="flex flex-row gap-4 justify-end">
                <button
                  className="self-end hover:bg-emerald-600 bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-default px-3 py-2 rounded-full cursor-pointer"
                  disabled={!travelModes.includes(i.travelMode) || selectedDaysOfWeek.length === 0}
                  onClick={
                    () => {

                      void (async () => {

                        await onSave();

                      })();

                    }
                  }
                >Save</button>
              </div> : ''
          }
        </div>
      </div>
    </>
  );

};

export default TravelPreferenceForm;
