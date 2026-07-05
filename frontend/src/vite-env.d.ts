/// <reference types="vite/client" />
declare module '*.svg?component' {
  import * as React from 'react';
  const component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}