declare module 'whisper-node' {
  export interface WhisperOptions {
    modelName?: string;
    autoDownloadModelName?: string;
    whisperOptions?: {
      language?: string;
      word_timestamps?: boolean;
      [key: string]: any;
    };
  }

  export interface TranscriptResult {
    speech: string;
  }

  export default function whisper(
    filePath: string,
    options?: WhisperOptions
  ): Promise<TranscriptResult[]>;
}
