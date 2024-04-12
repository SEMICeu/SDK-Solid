import { useEffect, useState } from 'react';
import { retrieveData, log, discoverData, decodeIDToken } from '@useid/movejs';
import { JWK } from 'jose';
import { TravelPreference, parseTravelPreference } from '../models/travel-preference';
import Header from './Header';
import TravelPreferenceForm from './TravelPreference';
import Itinerary from './Itinerary';

const Subject = (i: {
  token: string;
  publicKey: JWK;
  privateKey: JWK;
  subject?: string;
}) => {

  const [ selectedSubject, setSelectedSubject ] = useState<string | undefined>(undefined);
  const [ showItinerary, setShowItinerary ] = useState<boolean>(i.subject === undefined);
  // Determines the selected subject
  const [ selectedTravelPreference, setSelectedTravelPreference ] = useState<string | undefined>(undefined);
  // A list of travel preferences belonging to the given subject.
  const [ travelPreferences, setTravelPreferences ] = useState<TravelPreference[]>([]);
  // States the component can be in
  const [ state, setState ] = useState<'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR'>('INITIAL');

  useEffect(() => {

    const handleLoadResources = async () => {

      try {

        // Discover data the user has access to
        const combinations = await discoverData(i.token, i.publicKey, i.privateKey);

        // Retrieve travel preferences and add them to the state
        const preferences = (await Promise.all(
          combinations
            .filter((c) => c.subject === (i.subject ?? decodeIDToken(i.token).payload.webid) && c.type === 'https://voc.movejs.io/travel-preference')
            .map(async (c) => {

              const content = await retrieveData(c.uri, i.token, i.publicKey, i.privateKey);

              let travelPreference: TravelPreference | undefined;

              try {

                travelPreference = parseTravelPreference(c.uri, content);

              } catch(e) {

                log('Failed to parse preference', travelPreference);

              }

              return travelPreference;

            })
        )).filter((preference) => preference !== undefined) as TravelPreference[];

        setTravelPreferences(preferences);

        // Automatically select the first travel preference when subject is set
        if(preferences.length > 0 && i.subject){

          setShowItinerary(false);
          setSelectedTravelPreference(preferences[0].uri);

        }

        // Once done, set state to loaded
        setState('LOADED');

      } catch(e) {

        log('Something went wrong while discovering data', e);
        setState('ERROR');

      }

    };

    if(selectedSubject !== i.subject) {

      setSelectedSubject(i.subject);
      setState('INITIAL');

    }

    // Load subjects only once
    if(state === 'INITIAL'){

      setState('LOADING');

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleLoadResources();

    }

  }, [ state, i.token, i.publicKey, i.privateKey, i.subject, selectedSubject, travelPreferences ]);

  return (
    <>
      <div className="flex flex-row h-full w-full">
        <div className="flex flex-col gap-4 w-72 border-r-2 border-slate-50 bg-slate-100">
          {
            // Only show header when signed-in as commuter
            !i.subject ? <Header privateKey={i.privateKey} publicKey={i.publicKey} token={i.token}></Header> : ''
          }
          {
            // Only show header when signed-in as commuter
            !i.subject ? <div className={`cursor-pointer hover:bg-slate-50 px-4 py-2 ${selectedTravelPreference === undefined ? 'bg-slate-50' : ''}`} onClick={() => setShowItinerary(true)}>Generate itinerary</div> : ''
          }
          <div className="flex flex-row gap-2 px-4 py-2">
            <div className="font-semibold">Preferences</div>
            {
              // Only show add button when not the PTO
              decodeIDToken(i.token).payload.webid !== import.meta.env.VITE_SUBJECT_WEBID ?
                <button
                  className="flex-none w-6 h-6 aspect-square hover:bg-emerald-600 bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-default rounded-full cursor-pointer"
                  onClick={() => { setShowItinerary(false); setSelectedTravelPreference(undefined); }}
                >+</button> : ''
            }
          </div>
          <div className="flex flex-col gap-2">
            {
              // Show a list of travel preferences
              travelPreferences.length > 0 ?
                travelPreferences.map(((travelPreference, index) =>
                  <div className={`cursor-pointer hover:bg-slate-50 px-4 py-2 ${travelPreference.uri === selectedTravelPreference ? 'bg-slate-50' : ''}`} key={index} onClick={() => { setShowItinerary(false); setSelectedTravelPreference(travelPreference.uri); }}>{travelPreference.modeOfTransportation}</div>
                ))
                : <div>No travel preferences found</div>
            }
          </div>
        </div>
        <div className="bg-white flex-1">
          {
            !showItinerary ?
              <TravelPreferenceForm privateKey={i.privateKey} publicKey={i.publicKey} token={i.token} resource={selectedTravelPreference} onSaved={() => setState('INITIAL')}></TravelPreferenceForm> : ''
          }
          {
            showItinerary ?
              <Itinerary></Itinerary> : ''
          }
        </div>
      </div>
      {state === 'ERROR' ? <div>Something went wrong</div> : ''}
      {(state === 'INITIAL' || state === 'LOADING') && travelPreferences.length === 0 ? <div>Loading</div> : ''}
    </>
  );

};

export default Subject;
