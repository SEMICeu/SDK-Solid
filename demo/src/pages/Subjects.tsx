import { useEffect, useState } from 'react';
import { discoverData, log } from '@useid/movejs';
import { JWK } from 'jose';
import Subject from './Subject';
import Header from './Header';

const Subjects = (i: {
  token: string;
  publicKey: JWK;
  privateKey: JWK;
}) => {

  // Determines the selected subject
  const [ selectedSubject, setSelectedSubject ] = useState<string | undefined>(undefined);
  // An array of subjects that shared access with the user
  const [ subjects, setSubjects ] = useState<string[]>([]);
  // States the component can be in
  const [ state, setState ] = useState<'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR'>('INITIAL');

  useEffect(() => {

    const handleLoadSubjects = async () => {

      try {

        // Discover data the user has access to
        const resources = await discoverData(i.token, i.publicKey, i.privateKey);

        const subjectsResources = [ ... new Set(
          resources
            .map((resource) => resource.subject)
            .filter((subject) => subject !== import.meta.env.VITE_SUBJECT_WEBID)
        ) ];

        // Map array of resources to a unique list of its owners
        setSubjects(subjectsResources);

        // Automatically select the first subject
        if(subjectsResources.length > 0) {

          setSelectedSubject(subjectsResources[0]);

        }

        // Once done, set state to loaded
        setState('LOADED');

      } catch(e) {

        log('Something went wrong while discovering data', e);
        setState('ERROR');

      }

    };

    // Load subjects only once
    if(state === 'INITIAL'){

      setState('LOADING');

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleLoadSubjects();

    }

  }, [ state, i.token, i.publicKey, i.privateKey, subjects ]);

  return (
    <>
      <div className="w-full h-full flex flex-row">
        <div className="flex flex-col gap-8 w-72 border-r-2 border-slate-50 bg-slate-100">
          <Header privateKey={i.privateKey} publicKey={i.publicKey} token={i.token}></Header>
          <div className="flex flex-col gap-2 p-4">
            <div className="font-semibold">Subjects</div>
            {state === 'LOADED' && subjects.length >= 0 ? subjects.map(((subject, index) =>
              <div className={`cursor-pointer hover:bg-slate-50 p-2 ${subject === selectedSubject ? 'bg-slate-50' : ''}`} onClick={() => setSelectedSubject(subject)} key={index}>{subject.split('/')[subject.split('/').length - 1]}</div>
            )) : ''}
          </div>
        </div>
        <Subject
          token={i.token}
          publicKey={i.publicKey}
          privateKey={i.privateKey}
          subject={selectedSubject}></Subject>
        {state === 'LOADED' && subjects.length === 0 ? <div>No subjects found</div> : ''}
        {state === 'ERROR' ? <div>Something went wrong</div> : ''}
        {state === 'INITIAL' || state === 'LOADING' ? <div>Loading</div> : ''}
      </div>
    </>
  );

};

export default Subjects;
