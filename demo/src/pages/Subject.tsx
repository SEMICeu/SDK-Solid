import { useEffect, useState } from 'react';
import { retrieveData, log, discoverData, decodeIDToken } from '@useid/movejs';
import { JWK } from 'jose';
import { TravelPreference, parseTravelPreference } from '../models/travel-preference';
import { TravelDisruption, parseTravelDisruption } from '../models/travel-disruption';
import { TravelMode, travelModes } from '../models/travel-mode';
import Header from './Header';
import TravelPreferenceForm from './TravelPreference';
import Itinerary from './Itinerary';

const Subject = (i: {
  token: string;
  publicKey: JWK;
  privateKey: JWK;
  subject?: string;
}) => {

  // Determines the selected subject.
  const [ selectedSubject, setSelectedSubject ] = useState<string | undefined>(undefined);

  // Determines the selected travel mode.
  const [ selectedTravelMode, setSelectedTravelMode ] = useState<TravelMode | undefined>(
    // Automatically select the first travel preference when signed-in as PTO.
    decodeIDToken(i.token).payload.webid === import.meta.env.VITE_SUBJECT_WEBID ? travelModes[0] : undefined
  );

  // A list of travel disruptions.
  const [ travelDisruptions, setTravelDisruptions ] = useState<TravelDisruption[]>([]);
  // A list of travel preferences belonging to the given subject.
  const [ travelPreferences, setTravelPreferences ] = useState<TravelPreference[]>([]);
  // States the component can be in.
  const [ state, setState ] = useState<'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR'>('INITIAL');

  useEffect(() => {

    const handleLoadResources = async () => {

      try {

        // Discover data the user has access to
        const combinations = await discoverData(i.token, i.publicKey, i.privateKey, [ `${window.location.href}src/assets/resources` ]);

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

        // Retrieve travel disruptions and add them to the state
        const disruptions = (await Promise.all(
          combinations
            .filter((c) => c.type === 'https://voc.movejs.io/travel-disruption')
            .map(async (c) => {

              const content = await retrieveData(c.uri, i.token, i.publicKey, i.privateKey);

              let travelDisruption: TravelDisruption | undefined;

              try {

                travelDisruption = parseTravelDisruption(c.uri, content);

              } catch(e) {

                log('Failed to parse disruption', travelDisruption);

              }

              return travelDisruption;

            })
        )).filter((preference) => preference !== undefined) as TravelDisruption[];

        setTravelDisruptions(disruptions);

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
            !i.subject ? <div className={`cursor-pointer hover:bg-slate-50 px-4 py-2 ${!selectedTravelMode ? 'bg-slate-50' : ''}`} onClick={() => setSelectedTravelMode(undefined)}>Generate itinerary</div> : ''
          }
          <div className="font-semibold px-4 py-2">Preferences</div>
          <div className="flex flex-col gap-2">
            {
              // Show a list of travel preferences
              travelModes.map(((travelMode, index) =>
                <div className={`cursor-pointer hover:bg-slate-50 px-4 py-2 ${travelMode === selectedTravelMode ? 'bg-slate-50' : ''}`} key={index} onClick={() => setSelectedTravelMode(travelMode)}>{travelMode}</div>
              ))
            }
          </div>
        </div>
        <div className="bg-white flex-1">
          {
            state === 'LOADED' && selectedTravelMode ?
              <TravelPreferenceForm privateKey={i.privateKey} publicKey={i.publicKey} token={i.token} travelMode={selectedTravelMode} travelPreference={travelPreferences.find((p) => p.travelMode === selectedTravelMode)} onSaved={() => setState('INITIAL')}></TravelPreferenceForm> : ''
          }
          {
            state === 'LOADED' && !selectedTravelMode ?
              <Itinerary travelPreferences={travelPreferences} travelDisruptions={travelDisruptions} ></Itinerary> : ''
          }
        </div>
      </div>
      {state === 'ERROR' ? <div>Something went wrong (Subject)</div> : ''}
      {(state === 'INITIAL' || state === 'LOADING') && travelPreferences.length === 0 ? <div>Loading</div> : ''}
    </>
  );

};

export default Subject;
