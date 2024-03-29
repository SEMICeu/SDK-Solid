import { useState } from 'react';
import { log, requestPatch } from '@useid/movejs';
import logo from '../assets/logo.svg';
import { patchForCommuter } from '../patch/patch-for-commuter';

const SignIn = (i: { codeVerifier: string }) => {

  const [ email, setEmail ] = useState<string>('');

  const onSignIn = async () => {

    log('Handling sign-in', email);

    const patch = patchForCommuter(
      import.meta.env.VITE_CLIENT_ID,
      import.meta.env.VITE_SUBJECT_WEBID,
    );

    const uri = await requestPatch(
      email,
      i.codeVerifier,
      import.meta.env.VITE_IDP_BASE_URI, // idpBaseUri
      import.meta.env.VITE_CLIENT_ID, // clientId
      window.location.href, // redirectUri
      patch
    );

    window.location.href = uri;

  };

  return (
    <>
      <div className="w-full h-full flex flex-col p-8 rounded-lg bg-white gap-8 text-slate-700">
        <img className="self-start" src={logo} />
        <div className="w-full h-full flex flex-row rounded-lg bg-white gap-8">
          <div className="flex-1">
            <h2 className="text-3xl">Sign-in</h2>
          </div>
          <div className="flex-1 flex flex-col content-between justify-between gap-2 text-sm">
            <input className="border border-emerald-500 px-3 py-2 rounded-md" placeholder="Email address" type="text" onChange={(e) => setEmail(e.target.value)}></input>
            <p className="text-slate-500">If you do not have an account yet, do not worry. Just proceed by entering your email address.</p>
            <div className="flex flex-row gap-4 justify-end">
              <button
                className="self-end hover:bg-emerald-600 bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-default px-3 py-2 rounded-full cursor-pointer"
                disabled={!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)}
                onClick={
                  () => {

                    void (async () => {

                      await onSignIn();

                    })();

                  }
                }
              >Sign-in</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default SignIn;
