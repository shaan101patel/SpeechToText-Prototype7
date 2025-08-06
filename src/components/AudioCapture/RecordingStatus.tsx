import React from 'react';

interface RecordingStatusProps {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  duration: number;
  error?: string;
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({
  isRecording,
  isPaused,
  isProcessing,
  duration,
  error,
}) => {
  const getStatusText = () => {
    if (error) return 'Error';
    if (isProcessing) return 'Processing...';
    if (isRecording && isPaused) return 'Paused';
    if (isRecording) return 'Recording';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600 bg-red-50 border-red-200';
    if (isProcessing) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (isRecording) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = () => {
    if (error) {
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (isProcessing) {
      return (
        <svg className="w-4 h-4 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (isRecording) {
      return (
        <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
      );
    }
    
    return (
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    );
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {(isRecording || isProcessing) && (
        <span className="text-xs opacity-75">
          {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
        </span>
      )}
    </div>
  );
};
