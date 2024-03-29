import { useEffect, useState } from 'react';
import { decodeIDToken, getUserinfo, log } from '@useid/movejs';
import { JWK } from 'jose';
import Avatar from 'boring-avatars';

const Header = (i: {
  token: string;
  publicKey: JWK;
  privateKey: JWK;
}) => {

  // The user's webid
  const [ webid ] = useState<string>(decodeIDToken(i.token).payload.webid);
  // The user's email address
  const [ email, setEmail ] = useState<string | undefined>(undefined);
  // States the component can be in
  const [ state, setState ] = useState<'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR'>('INITIAL');

  useEffect(() => {

    const handleGetUserinfo = async () => {

      try {

        // Retrieve data from the userinfo endpoint
        const userinfo = await getUserinfo(i.token, i.publicKey, i.privateKey);
        setEmail(userinfo.email);

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
      handleGetUserinfo();

    }

  }, [ state, i.token, i.publicKey, i.privateKey ]);

  return (
    <>
      {state === 'LOADED' || state === 'ERROR' ?
        <div className="flex flex-row p-4 border-b-2 border-slate-50 gap-4 h-20">
          <Avatar
            size={46}
            name={email ?? webid}
            variant="beam"
            colors={[ '#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90' ]}
          />
          <div className="font-semibold text-sm">
            {email ?? webid.split('/')[webid.split('/').length - 1]}
          </div>
        </div>
        : ''
      }
    </>
  );

};

export default Header;
