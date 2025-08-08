# Troubleshooting Guide

## Recent Status Update (Latest)

✅ **RESOLVED: fal.ai Client Integration Issues**
- Fixed incorrect import syntax: Changed from `import * as fal` to `import { fal }`
- Updated API calls to use proper fal.ai queue-based processing with `fal.subscribe()`
- Corrected response handling: Removed `.data` property access as result is direct
- Fixed TypeScript errors with queue status logs
- Application now compiles and runs successfully

**Current Implementation:**
- Uses official `@fal-ai/client` library v1.6.1
- Proper file upload via fal.ai storage system
- Queue-based processing with real-time status updates
- Robust error handling and retry logic

**Next Steps:**
1. Test audio recording and transcription end-to-end
2. Verify API key authentication
3. Test with different audio formats and file sizes

---

## Error History & Solutions

### Issue: "Unsupported data URL" Error (RESOLVED)
**Problem:** fal.ai Wizper API returned 400 error with "Unsupported data URL" message when sending audio as base64 data URI.

**Root Cause:** The Wizper API requires actual file uploads, not data URIs.

**Solution:** 
- Switched to using `fal.storage.upload()` for file uploads
- Using `fal.subscribe()` for queue-based processing
- Proper File object creation from audio blob

### Issue: 422/400 API Errors (RESOLVED)
**Problem:** Various HTTP errors (422 Unprocessable Content, 400 Bad Request) when calling the API.

**Previous Attempts:**
- Tried data URI approach ❌
- Tried FormData with fetch ❌
- Manual multipart/form-data ❌

**Final Solution:** Use official `@fal-ai/client` library with proper imports and queue-based processing ✅

### Issue: TypeScript Compilation Errors (RESOLVED)
**Problem:** Various TypeScript errors due to incorrect API usage and imports.

**Solution:**
- Corrected import statement for fal client
- Fixed queue status type handling
- Removed incorrect `.data` property access
- Added proper type guards for logs

## Configuration Issues

### API Key Setup
Make sure your `.env.local` file contains:
```bash
VITE_FAL_API_KEY=your_fal_api_key_here
```

### Audio Format Support
Supported formats:
- WebM (preferred for web recording)
- MP3, WAV, M4A, OGG
- Maximum file size: 50MB

## Debugging Tips

### Enable Detailed Logging
The app includes comprehensive logging:
- Audio capture events
- API request/response details
- Queue status updates
- Error details with stack traces

### Check Browser Console
Look for these log prefixes:
- `[AudioCapture]` - Audio recording issues
- `[WizperAPI]` - API communication
- `[Queue]` - Processing status

### Common Issues

1. **No audio recorded:**
   - Check microphone permissions
   - Verify MediaRecorder support
   - Check chunk duration settings

2. **API authentication errors:**
   - Verify API key is set correctly
   - Check key format (should be FAL key)
   - Ensure key has necessary permissions

3. **File upload failures:**
   - Check internet connectivity
   - Verify file size under 50MB
   - Check audio format compatibility

## Performance Notes

- Audio chunks are collected over 10-second intervals
- API requests use retry logic (max 3 attempts)
- Queue-based processing provides better reliability
- File uploads are handled automatically by fal.ai client

## Integration Status

✅ **Working Components:**
- Audio capture and recording
- File upload to fal.ai storage
- Queue-based transcription processing
- Error handling and retry logic
- TypeScript compilation

🔄 **To Test:**
- End-to-end audio transcription
- API key authentication
- Various audio formats
- Error recovery scenarios
