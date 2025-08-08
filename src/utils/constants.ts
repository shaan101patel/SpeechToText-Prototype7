// Audio capture constants
export const AUDIO_CONFIG = {
  DEFAULT_SAMPLE_RATE: 16000,
  DEFAULT_CHANNEL_COUNT: 1,
  DEFAULT_BIT_RATE: 128000,
  CHUNK_DURATION: 10000, // 10 seconds - larger chunks for better API processing
  MAX_RECORDING_DURATION: 600000, // 10 minutes
  SUPPORTED_MIME_TYPES: [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/wav'
  ]
} as const;

// API constants
export const API_CONFIG = {
  FAL_AI_BASE_URL: 'https://fal.run/fal-ai/wizper',
  MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3
} as const;

// UI constants
export const UI_CONFIG = {
  CONFIDENCE_THRESHOLD: 0.7,
  LOW_CONFIDENCE_THRESHOLD: 0.5,
  PROCESSING_ANIMATION_DURATION: 1000,
  TRANSCRIPT_UPDATE_DEBOUNCE: 300
} as const;
