import './App.css';
import { generateCodeVerifier, log, exchangeCode, generateKeys, decodeIDToken } from '@useid/movejs';
import { useEffect, useState } from 'react';
import { JWK } from 'jose';
import SignIn from './pages/SignIn';
import Subjects from './pages/Subjects';
import Subject from './pages/Subject';

const App = () => {

  // Setting state objects.
  const [ actor, setActor ] = useState<string | undefined>(localStorage.getItem('actor') ?? undefined);
  const [ publicKey, setPublicKey ] = useState<JWK | undefined>(undefined);
  const [ privateKey, setPrivateKey ] = useState<JWK | undefined>(undefined);
  const [ error, setError ] = useState<string | undefined>(undefined);
  const [ loading, setLoading ] = useState<boolean>(true);

  // Try to retrieve a code verifier from local storage, and generate a new one when not found
  const [ codeVerifier ] = useState<string>(localStorage.getItem('codeVerifier') ?? generateCodeVerifier(44));
  localStorage.setItem('codeVerifier', codeVerifier);

  // Try to retrieve token from local storage
  const [ token, setToken ] = useState<string | undefined>(localStorage.getItem('token') ?? undefined);

  useEffect(() => {

    const handleCode = async () => {

      // Try to retrieve code and state from url
      const code = new URLSearchParams(window.location.search).get('code') ?? undefined;

      let retrievedPublicKey = publicKey;
      let retrievedPrivateKey = privateKey;

      // Try to retrieve or generate keyset when not yet in state
      if(!retrievedPublicKey || !retrievedPrivateKey) {

        log('No public or private key found');

        // Retrieve raw keyset from local storage and try to parse them when found
        const localStoragePublicKeyString = localStorage.getItem('publicKey');
        const localStoragePrivateKeyString = localStorage.getItem('privateKey');

        if(localStoragePrivateKeyString && localStoragePublicKeyString) {

          try {

            retrievedPublicKey = JSON.parse(localStoragePublicKeyString) as JWK;
            retrievedPrivateKey = JSON.parse(localStoragePrivateKeyString) as JWK;
            log('Attempted to retrieve keypair from local storage', { retrievedPublicKey, retrievedPrivateKey });

          } catch(e) {

            log('Failed to parse keypair from local storage');

          }

        }

        // Generate new keyset if no keyset could be found or parsed
        if(!retrievedPublicKey || !retrievedPrivateKey){

          const { publicKey: newPublicKey, privateKey: newPrivateKey } = await generateKeys();

          log('Still no keypair after restore from local storage, generated new keypair', { newPublicKey, newPrivateKey });

          retrievedPublicKey = newPublicKey;
          retrievedPrivateKey = newPrivateKey;

        }

        // Store newly generated keyset to local storage and set state
        localStorage.setItem('publicKey', JSON.stringify(retrievedPublicKey));
        localStorage.setItem('privateKey', JSON.stringify(retrievedPrivateKey));

        setPublicKey(retrievedPublicKey);
        setPrivateKey(retrievedPrivateKey);

      }

      // Exchange code when found in url
      if(code && publicKey && privateKey) {

        try {

          const newToken = await exchangeCode(
            import.meta.env.VITE_IDP_BASE_URI,
            code,
            import.meta.env.VITE_CLIENT_ID,
            window.location.href.split('?')[0],
            codeVerifier,
            publicKey,
            privateKey
          );

          localStorage.setItem('token', newToken);
          setToken(newToken);

          const { payload } = decodeIDToken(newToken);
          const newActor = payload.webid === import.meta.env.VITE_SUBJECT_WEBID ? 'pto' : 'commuter';

          localStorage.setItem('actor', newActor);
          setActor(newActor);

          window.location.href = window.location.href.split('?')[0];

          log('Code exchanged for token', token);

        } catch(e) {

          log('Code not exchanged for token');
          setError('Code could not be exchanged');

        }

      }

      setLoading(false);

    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleCode();

  });

  return (
    <>
      <div className="w-full h-full bg-slate-100 flex flex-col content-center justify-center gap-8">
        {error ? <p className="error w-full max-w-2xl bg-red-600 max-w-2xl p-2 rounded-md place-self-center">{error}</p> : ''}
        {loading ? <p>Loading</p> :

          <div className="w-full h-full flex flex-col justify-center">
            {token && publicKey && privateKey && actor === 'pto' ?
              // Render subjects when pto is signed-in
              <div className="w-full h-full flex flex-row bg-white text-slate-700">
                <Subjects
                  token={token}
                  publicKey={publicKey}
                  privateKey={privateKey}></Subjects>
              </div> : ''
            }
            {token && publicKey && privateKey && actor === 'commuter' ?
              // Render subjects when commuter is signed-in
              <div className="w-full h-full flex flex-row bg-white text-slate-700">
                <Subject
                  token={token}
                  publicKey={publicKey}
                  privateKey={privateKey}
                ></Subject>
              </div> : ''
            }
            {!token || !publicKey || !privateKey || !actor ?
              // Render sign-in screen when user is not signed-in
              <div className="w-full max-w-2xl max-h-96 self-center">
                <SignIn codeVerifier={codeVerifier}></SignIn>
                <div className="flex px-2 py-1 text-sm text-slate-400 content-between justify-between">
                  <p>Movejs Demo</p>
                </div>
              </div>
              : ''
            }
          </div>
        }
      </div>
    </>
  );

};

export default App;
