# Solid-SDK
This repository contains an SDK and demo of the Solid protocol. It's written 

## Getting started
Start by installing the SDK as a dependency of your project.

```bash
npm i @useid/movejs
```

As a first step, you need to authorize your user. This is done by following OIDC's Code Grant Flow. To do so, start by generating a uri by calling the `requestPatch` function and redirecting the user.

```typescript
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
```

The user will be redirected back to your application after he authenticated and authorized the given request. Upon redirect, the authorization code will be available as a query parameter. Next, exchange this code by calling the `exchangeCode` function.

```typescript
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
```

With this token, your application can start interacting with the user's pod. Call the `discoverData` function to discover what data the user has access to. Subsequently, the resources can be retrieved by calling the `retrieveData` function and parsed according to your app's requirements.

```typescript
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
));
```

## Contributing
Start by cloning, installing and building the dependencies.

```bash
git clone https://github.com/SEMICeu/SDK-Solid.git
cd SDK-Solid
npm i
npm run build
```

Since the master branch is protected, develop and test your contributions on a separate branch. Open a pull request to master once you are finished.

```bash
git checkout -b <branch-name>
```

Run the automated tests and linting in order to ensure code quality. Note these scripts will also be required to succeed before you will be able to merge your pull request.

```bash
npm test
npm run lint
```

## License

