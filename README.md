# SpeechToText-Prototype7

A React TypeScript prototype application for testing the fal.ai Wizper speech-to-text API integration. This prototype will serve as a foundation for integrating speech-to-text functionality into the Navis application.

## 🎯 Purpose

This prototype is designed to:
- Test the fal.ai Wizper API for speech-to-text conversion
- Evaluate real-time audio capture and processing
- Prototype UI components for transcript display
- Measure performance metrics and accuracy
- Prepare integration patterns for the main Navis application

## 🚀 Features

### Phase 1 (Current Implementation)
- **Audio Capture**: Browser-based microphone recording with MediaRecorder API
- **Real-time Processing**: Chunked audio processing for near real-time results
- **fal.ai Wizper Integration**: Direct API integration with error handling and retries
- **Transcript Display**: Real-time transcript with confidence indicators
- **Modern UI**: Clean interface built with React + TypeScript + Tailwind CSS

### Planned Features (Phase 2 & 3)
- Enhanced audio visualization
- Voice Activity Detection (VAD)
- Speaker diarization support
- Performance optimization
- Integration preparation for Navis

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Audio API**: MediaRecorder API (Web Audio)
- **Speech-to-Text**: fal.ai Wizper API

## 📋 Prerequisites

1. **Node.js**: Version 16 or higher
2. **fal.ai API Key**: You'll need a valid API key from [fal.ai](https://fal.ai/)
3. **Modern Browser**: Chrome, Firefox, or Safari with microphone support

## ⚡ Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Allow microphone permissions when prompted

4. **Configure API**
   - Click "Configure API Key" in the interface
   - Enter your fal.ai API key

5. **Test Recording**
   - Click "Start Recording"
   - Speak into your microphone
   - Watch the real-time transcript appear
   - Click "Stop" to finish

## 🎨 Project Structure

```
src/
├── components/
│   ├── AudioCapture/
│   │   ├── AudioControls.tsx       # Recording controls
│   │   └── RecordingStatus.tsx     # Status indicators
│   ├── Layout/
│   │   ├── Header.tsx              # App header
│   │   └── PrototypeLayout.tsx     # Main layout
│   └── Transcript/
│       ├── TranscriptDisplay.tsx   # Main transcript view
│       ├── TranscriptSegment.tsx   # Individual segments
│       └── ConfidenceIndicator.tsx # Confidence visualization
├── hooks/
│   ├── useAudioCapture.ts          # Audio recording logic
│   └── useTranscription.ts         # API integration logic
├── services/
│   ├── audioCapture.ts             # Audio capture service
│   └── wizperAPI.ts                # fal.ai API client
├── types/
│   ├── audio.ts                    # Audio-related types
│   └── transcript.ts               # Transcript types
└── utils/
    ├── audioFormat.ts              # Audio utilities
    └── constants.ts                # App constants
```

## 🔧 Configuration

### API Configuration
The app requires a fal.ai API key to function. You can:
- Enter it through the UI prompt
- Set it as an environment variable (future enhancement)

### Audio Settings
Audio capture uses these default settings:
- Sample Rate: 16kHz
- Channels: Mono
- Format: WebM (with fallbacks)
- Chunk Duration: 2 seconds

## 📊 Performance Metrics

The prototype tracks:
- **Latency**: Time from speech to transcript
- **Accuracy**: Word-level confidence scores
- **Processing Time**: API response times
- **Audio Quality**: Input level monitoring

## 🧪 Testing

### Manual Testing Scenarios
1. **Clear Audio**: Test with clear speech in quiet environment
2. **Background Noise**: Test with various noise levels
3. **Multiple Speakers**: Test speaker transitions
4. **Long Sessions**: Test extended recording periods
5. **Different Accents**: Test with various accents and languages

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 76+
- ✅ Safari 14+
- ❌ Internet Explorer (not supported)

## 🔗 Integration with Navis

This prototype is designed for easy integration into the main Navis application:

### Component Migration
- `AudioControls` → `src/components/livecall/AudioControls.tsx`
- `TranscriptDisplay` → `src/components/livecall/TranscriptArea.tsx`
- `WizperAPI` → `src/services/speechRecognition.ts`

### State Management
- Convert React Context to Redux slices
- Integrate with existing CallStateContext
- Add to global store for persistence

### Type Compatibility
All TypeScript interfaces are designed to match Navis patterns and can be directly imported.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📈 Next Steps

1. **Complete Phase 1 Testing**
2. **Implement Phase 2 Features** (Audio visualization, VAD)
3. **Performance Optimization**
4. **Integration Planning** with Navis team
5. **Production Deployment** strategy

## 🐛 Known Issues

- Audio chunks may not process in exact real-time on slower connections
- API rate limiting may affect continuous recording
- Some browsers require HTTPS for microphone access

## 📄 License

This is a prototype application for internal development use.

---

**Created**: August 6, 2025  
**Status**: Phase 1 Implementation Complete  
**Next Review**: After Phase 1 testing completion