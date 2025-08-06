import { useState, useCallback, useRef } from 'react';
import { WizperAPI, WizperConfig } from '../services/wizperAPI';
import { TranscriptSegment, TranscriptState, WizperResponse } from '../types/transcript';
import { generateSegmentId } from '../utils/audioFormat';
import { UI_CONFIG } from '../utils/constants';

export function useTranscription(config: WizperConfig) {
  const [state, setState] = useState<TranscriptState>({
    segments: [],
    isProcessing: false,
    totalDuration: 0,
    wordCount: 0,
    averageConfidence: 0,
  });

  const wizperRef = useRef<WizperAPI | null>(null);
  const processingTimeoutRef = useRef<number | null>(null);

  // Initialize Wizper API
  const initializeWizper = useCallback(() => {
    if (!wizperRef.current) {
      wizperRef.current = new WizperAPI(config);
    }
  }, [config]);

  // Process audio blob and add to transcript
  const processAudio = useCallback(async (audioBlob: Blob): Promise<void> => {
    initializeWizper();
    
    if (!wizperRef.current) {
      throw new Error('Wizper API not initialized');
    }

    setState(prev => ({ ...prev, isProcessing: true }));

    // Add a processing segment placeholder
    const processingSegment: TranscriptSegment = {
      id: generateSegmentId(),
      text: 'Processing...',
      timestamp: Date.now(),
      confidence: 0,
      startTime: state.totalDuration,
      endTime: state.totalDuration,
      isProcessing: true,
    };

    setState(prev => ({
      ...prev,
      segments: [...prev.segments, processingSegment],
    }));

    try {
      const response: WizperResponse = await wizperRef.current.transcribe(audioBlob);
      
      // Remove processing segment and add real segments
      setState(prev => {
        const segmentsWithoutProcessing = prev.segments.filter(s => !s.isProcessing);
        const newSegments = createSegmentsFromResponse(response, prev.totalDuration);
        const allSegments = [...segmentsWithoutProcessing, ...newSegments];
        
        return {
          ...prev,
          segments: allSegments,
          isProcessing: false,
          wordCount: calculateWordCount(allSegments),
          averageConfidence: calculateAverageConfidence(allSegments),
          totalDuration: prev.totalDuration + (response.duration || 0),
        };
      });

    } catch (error) {
      // Remove processing segment and show error
      setState(prev => ({
        ...prev,
        segments: prev.segments.filter(s => !s.isProcessing),
        isProcessing: false,
      }));
      
      throw error;
    }
  }, [initializeWizper, state.totalDuration]);

  // Add a manual transcript segment (for testing or manual input)
  const addSegment = useCallback((text: string, confidence: number = 1.0): void => {
    const segment: TranscriptSegment = {
      id: generateSegmentId(),
      text: text.trim(),
      timestamp: Date.now(),
      confidence,
      startTime: state.totalDuration,
      endTime: state.totalDuration + 2, // Assume 2 second duration
    };

    setState(prev => {
      const newSegments = [...prev.segments, segment];
      return {
        ...prev,
        segments: newSegments,
        wordCount: calculateWordCount(newSegments),
        averageConfidence: calculateAverageConfidence(newSegments),
        totalDuration: prev.totalDuration + 2,
      };
    });
  }, [state.totalDuration]);

  // Clear all transcript segments
  const clearTranscript = useCallback((): void => {
    setState({
      segments: [],
      isProcessing: false,
      totalDuration: 0,
      wordCount: 0,
      averageConfidence: 0,
    });
  }, []);

  // Get transcript as plain text
  const getTranscriptText = useCallback((): string => {
    return state.segments
      .filter(s => !s.isProcessing)
      .map(s => s.text)
      .join(' ');
  }, [state.segments]);

  // Update Wizper configuration
  const updateConfig = useCallback((newConfig: Partial<WizperConfig>): void => {
    if (wizperRef.current) {
      wizperRef.current.updateConfig(newConfig);
    }
  }, []);

  return {
    ...state,
    processAudio,
    addSegment,
    clearTranscript,
    getTranscriptText,
    updateConfig,
  };
}

// Helper functions
function createSegmentsFromResponse(response: WizperResponse, startTime: number): TranscriptSegment[] {
  if (response.segments && response.segments.length > 0) {
    return response.segments.map((segment, index) => ({
      id: generateSegmentId(),
      text: segment.text.trim(),
      timestamp: Date.now() + index,
      confidence: segment.confidence || 0.9,
      startTime: startTime + (segment.start || 0),
      endTime: startTime + (segment.end || 0),
    }));
  }

  // Fallback: create a single segment from the full text
  return [{
    id: generateSegmentId(),
    text: response.text.trim(),
    timestamp: Date.now(),
    confidence: 0.9,
    startTime,
    endTime: startTime + (response.duration || 2),
  }];
}

function calculateWordCount(segments: TranscriptSegment[]): number {
  return segments
    .filter(s => !s.isProcessing)
    .reduce((count, segment) => {
      return count + segment.text.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
}

function calculateAverageConfidence(segments: TranscriptSegment[]): number {
  const validSegments = segments.filter(s => !s.isProcessing);
  if (validSegments.length === 0) return 0;
  
  const totalConfidence = validSegments.reduce((sum, segment) => sum + segment.confidence, 0);
  return totalConfidence / validSegments.length;
}
