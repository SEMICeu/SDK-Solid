/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDP_BASE_URI: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_SUBJECT_WEBID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
