import { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { PrototypeLayout } from './components/Layout/PrototypeLayout';
import { AudioControls } from './components/AudioCapture/AudioControls';
import { RecordingStatus } from './components/AudioCapture/RecordingStatus';
import { TranscriptDisplay } from './components/Transcript/TranscriptDisplay';
import { useAudioCapture } from './hooks/useAudioCapture';
import { useTranscription } from './hooks/useTranscription';

function App() {
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_FAL_AI_API_KEY || '');
  const [isConfigured, setIsConfigured] = useState<boolean>(!!import.meta.env.VITE_FAL_AI_API_KEY);

  // Audio capture hook
  const {
    isRecording,
    isPaused,
    audioLevel,
    totalDuration,
    error: audioError,
    initialize,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearError,
  } = useAudioCapture();

  // Transcription hook
  const {
    segments,
    isProcessing,
    wordCount,
    averageConfidence,
    processAudio,
    clearTranscript,
  } = useTranscription({
    apiKey,
    language: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    task: 'transcribe',
    enableTimestamps: true,
  });

  // Initialize audio on first use
  const handleStartRecording = useCallback(async () => {
    try {
      if (!isConfigured) {
        alert('Please enter your fal.ai API key first');
        return;
      }

      await initialize();
      // Start recording without chunk processing - we'll process on stop
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [initialize, startRecording, isConfigured]);

  const handleStopRecording = useCallback(async () => {
    try {
      const finalBlob = await stopRecording();
      if (finalBlob) {
        // Process the final complete audio blob
        await processAudio(finalBlob);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }, [stopRecording, processAudio]);

  const handleConfigureAPI = useCallback(() => {
    const key = prompt('Enter your fal.ai API key:');
    if (key) {
      setApiKey(key);
      setIsConfigured(true);
    }
  }, []);

  return (
    <PrototypeLayout>
      <Header 
        title="SpeechToText Prototype7" 
        subtitle="Testing fal.ai Wizper API Integration"
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Configuration */}
        {!isConfigured && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">API Configuration Required</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You need to configure your fal.ai API key. You can either add it to your .env.local file or enter it manually.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Tip: Add VITE_FAL_AI_API_KEY=your_key to .env.local for automatic loading
                </p>
              </div>
              <button
                onClick={handleConfigureAPI}
                className="btn-primary text-sm"
              >
                Enter API Key
              </button>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="mb-6 flex items-center justify-between">
          <RecordingStatus
            isRecording={isRecording}
            isPaused={isPaused}
            isProcessing={isProcessing}
            duration={totalDuration}
            error={audioError || undefined}
          />
          
          {isConfigured && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                API Configured {import.meta.env.VITE_FAL_AI_API_KEY ? '(from .env.local)' : '(manual)'}
              </span>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio Controls Panel */}
          <div className="space-y-6">
            <AudioControls
              isRecording={isRecording}
              isPaused={isPaused}
              totalDuration={totalDuration}
              audioLevel={audioLevel}
              error={audioError}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onPauseRecording={pauseRecording}
              onResumeRecording={resumeRecording}
              onClearError={clearError}
            />

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Configure your fal.ai API key first</li>
                <li>• Click "Start Recording" to begin audio capture</li>
                <li>• Speak clearly into your microphone</li>
                <li>• Click "Stop" to finish recording and get transcript</li>
                <li>• Processing happens after recording stops for better accuracy</li>
              </ul>
            </div>
          </div>

          {/* Transcript Panel */}
          <div>
            <TranscriptDisplay
              segments={segments}
              isProcessing={isProcessing}
              wordCount={wordCount}
              averageConfidence={averageConfidence}
              onClearTranscript={clearTranscript}
            />
          </div>
        </div>

        {/* Debug Info (Development only) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Info</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Recording: {isRecording ? 'Yes' : 'No'}</div>
              <div>Paused: {isPaused ? 'Yes' : 'No'}</div>
              <div>Processing: {isProcessing ? 'Yes' : 'No'}</div>
              <div>Segments: {segments.length}</div>
              <div>Audio Level: {Math.round(audioLevel)}%</div>
              <div>Duration: {Math.round(totalDuration)}s</div>
              {audioError && <div className="text-red-600">Error: {audioError}</div>}
            </div>
          </div>
        )}
      </main>
    </PrototypeLayout>
  );
}

export default App;
