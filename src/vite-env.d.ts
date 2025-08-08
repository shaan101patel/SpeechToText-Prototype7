/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly VITE_FAL_AI_API_KEY?: string
  readonly VITE_DEFAULT_LANGUAGE?: string
  readonly VITE_DEBUG_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
