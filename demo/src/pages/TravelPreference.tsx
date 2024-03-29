import { useEffect, useState } from 'react';
import { createData, decodeIDToken, log, retrieveData } from '@useid/movejs';
import { JWK } from 'jose';
import { VOC_TRAVEL_PREFERENCE } from '../vocabulary';
import { TravelPreference, parseTravelPreference } from '../models/travel-preference';

const TravelPreferenceForm = (i: {
  token: string;
  publicKey: JWK;
  privateKey: JWK;
  resource?: string;
  onSaved?: () => void;
}) => {

  const [ selectedResource, setSelectedResource ] = useState<string | undefined>(undefined);
  const [ travelPreference, setTravelPreference ] = useState<TravelPreference | undefined>(undefined);
  const [ modeOfTransportation, setModeOfTransportation ] = useState<string>('');
  // States the component can be in
  const [ state, setState ] = useState<'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR'>('INITIAL');

  useEffect(() => {

    const handleLoadResource = async () => {

      try {

        if(i.resource){

          const content = await retrieveData(i.resource, i.token, i.publicKey, i.privateKey);
          const parsedTravelPreference = parseTravelPreference(i.resource, content);

          setTravelPreference(parsedTravelPreference as { modeOfTransportation: string });
          setModeOfTransportation(parsedTravelPreference.modeOfTransportation);

        } else {

          setModeOfTransportation('');

        }

        // Once done, set state to loaded
        setState('LOADED');

      } catch(e) {

        log('Something went wrong while discovering data', e);
        setState('ERROR');

      }

    };

    if(selectedResource !== i.resource) {

      setSelectedResource(i.resource);
      setState('INITIAL');

    }

    // Load subjects only once
    if(state === 'INITIAL'){

      setState('LOADING');

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleLoadResource();

    }

  }, [ state, i.token, i.publicKey, i.privateKey, selectedResource, i.resource, travelPreference ]);

  const onSave = async () => {

    log('Handling save');

    // Create a travel preference
    await createData(
      'https://storage.sandbox-use.id',
      VOC_TRAVEL_PREFERENCE,
      decodeIDToken(i.token).payload.webid,
      JSON.stringify({
        modeOfTransportation,
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
      {state === 'ERROR' ? <p>Something went wrong</p> :
        <div className="w-full h-full flex flex-col rounded-lg bg-white">
          <h2 className="text-3xl p-4 border-b-2 border-slate-50 h-20">Travel preference</h2>
          <div className="flex flex-col content-between justify-between gap-2 text-sm p-4">
            <input className="border border-emerald-500 px-3 py-2 rounded-md" placeholder="Mode of transportation" type="text" value={modeOfTransportation} onChange={(e) => setModeOfTransportation(e.target.value)}></input>
            <div className="flex flex-row gap-4 justify-end">
              <button
                className="self-end hover:bg-emerald-600 bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-default px-3 py-2 rounded-full cursor-pointer"
                disabled={modeOfTransportation === '' || i.resource !== undefined}
                onClick={
                  () => {

                    void (async () => {

                      await onSave();

                    })();

                  }
                }
              >Save</button>
            </div>
          </div>
        </div>
      }
    </>
  );

};

export default TravelPreferenceForm;
