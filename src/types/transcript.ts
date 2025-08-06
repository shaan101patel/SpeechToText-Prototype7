// Transcript-related types
export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;
  confidence: number;
  speaker?: string;
  startTime: number;
  endTime: number;
  isProcessing?: boolean;
}

export interface TranscriptState {
  segments: TranscriptSegment[];
  isProcessing: boolean;
  totalDuration: number;
  wordCount: number;
  averageConfidence: number;
}

export interface WizperResponse {
  text: string;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
    confidence?: number;
  }>;
  language?: string;
  duration?: number;
}

export interface WizperError {
  error: string;
  message: string;
  statusCode?: number;
}
