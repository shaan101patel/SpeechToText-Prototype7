import { WizperResponse, WizperError } from '../types/transcript';
import { API_CONFIG } from '../utils/constants';
import { blobToBase64 } from '../utils/audioFormat';

export interface WizperConfig {
  apiKey: string;
  language?: string;
  task?: 'transcribe' | 'translate';
  enableTimestamps?: boolean;
}

export class WizperAPI {
  private config: WizperConfig;
  private retryCount: number = 0;

  constructor(config: WizperConfig) {
    this.config = {
      task: 'transcribe',
      enableTimestamps: true,
      ...config,
    };
  }

  /**
   * Transcribe audio using fal.ai Wizper API
   */
  async transcribe(audioBlob: Blob): Promise<WizperResponse> {
    try {
      // Validate file size
      if (audioBlob.size > API_CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum limit of ${API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      // Convert blob to base64
      const audioBase64 = await blobToBase64(audioBlob);

      const payload = {
        audio_data: audioBase64,
        task: this.config.task,
        language: this.config.language,
        enable_timestamps: this.config.enableTimestamps,
      };

      const response = await this.makeRequest(payload);
      return this.parseResponse(response);
    } catch (error) {
      if (this.retryCount < API_CONFIG.MAX_RETRIES) {
        this.retryCount++;
        console.warn(`Transcription failed, retrying... (${this.retryCount}/${API_CONFIG.MAX_RETRIES})`);
        return this.transcribe(audioBlob);
      }
      throw this.createWizperError(error);
    }
  }

  /**
   * Transcribe audio from URL
   */
  async transcribeFromUrl(audioUrl: string): Promise<WizperResponse> {
    try {
      const payload = {
        audio_url: audioUrl,
        task: this.config.task,
        language: this.config.language,
        enable_timestamps: this.config.enableTimestamps,
      };

      const response = await this.makeRequest(payload);
      return this.parseResponse(response);
    } catch (error) {
      throw this.createWizperError(error);
    }
  }

  /**
   * Check API health/connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Create a minimal test request
      const testPayload = {
        audio_data: '', // Empty for health check
        task: 'transcribe',
      };

      await fetch(API_CONFIG.FAL_AI_BASE_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(testPayload),
      });

      return true;
    } catch (error) {
      console.warn('Wizper API health check failed:', error);
      return false;
    }
  }

  private async makeRequest(payload: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

    try {
      const response = await fetch(API_CONFIG.FAL_AI_BASE_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.detail || ''}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Key ${this.config.apiKey}`,
    };
  }

  private parseResponse(response: any): WizperResponse {
    // Reset retry count on successful response
    this.retryCount = 0;

    if (response.error) {
      throw new Error(response.error);
    }

    return {
      text: response.text || '',
      segments: response.segments || [],
      language: response.language,
      duration: response.duration,
    };
  }

  private createWizperError(error: any): WizperError {
    let message = 'Unknown error occurred';
    let statusCode: number | undefined;

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error.detail) {
      message = error.detail;
      statusCode = error.status_code;
    }

    return {
      error: 'TRANSCRIPTION_FAILED',
      message,
      statusCode,
    };
  }

  /**
   * Update API configuration
   */
  updateConfig(newConfig: Partial<WizperConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
