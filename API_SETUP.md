# API Key Setup Instructions

## 🔑 Setting Up Your fal.ai API Key

### Method 1: Environment File (Recommended)

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your actual API key:**
   ```bash
   # Replace with your actual fal.ai API key
   VITE_FAL_AI_API_KEY=fal_your_actual_api_key_here
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

4. **The API key will be automatically loaded** - you'll see "(from .env.local)" in the status bar

### Method 2: Manual Entry

1. **Start the application** without an API key
2. **Click "Enter API Key"** in the blue configuration banner
3. **Enter your fal.ai API key** when prompted
4. **The key will be stored** for the current session only

## 🔐 Security Notes

- ✅ `.env.local` is automatically ignored by Git
- ✅ Your API key will never be committed to the repository
- ✅ Environment variables are only available in your local development environment
- ✅ The `.env.example` file shows the format but contains no real keys

## 🚀 Getting Your fal.ai API Key

1. **Visit:** https://fal.ai/
2. **Sign up** for an account
3. **Navigate to** your dashboard/API section
4. **Generate** a new API key
5. **Copy** the key and add it to your `.env.local` file

## 🧪 Testing

Once configured, you should see:
- ✅ Green "API Configured" status in the top right
- ✅ No blue configuration banner
- ✅ "Start Recording" button enabled
- ✅ Real-time transcription when recording

## 🔧 Troubleshooting

**API Key Not Loading:**
- Check that `.env.local` exists in the project root
- Verify the key starts with `VITE_FAL_AI_API_KEY=`
- Restart the development server (`npm run dev`)

**Transcription Not Working:**
- Verify your API key is valid
- Check browser console for error messages
- Ensure microphone permissions are granted

**Environment Variables:**
```bash
# Available variables in .env.local
VITE_FAL_AI_API_KEY=your_api_key_here    # Required
VITE_DEFAULT_LANGUAGE=en                 # Optional (default: en)
VITE_DEBUG_MODE=true                     # Optional (development only)
```
