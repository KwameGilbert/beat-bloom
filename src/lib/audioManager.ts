/**
 * Global Audio Manager Singleton
 * Ensures only one audio instance exists across the entire application.
 * This prevents multiple beats from playing simultaneously.
 */

class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public getAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
    }
    return this.audio;
  }

  public play(src: string): Promise<void> {
    const audio = this.getAudio();
    
    // Always stop current playback first
    audio.pause();
    audio.currentTime = 0;
    
    // Set new source and play
    audio.src = src;
    audio.load();
    
    return audio.play();
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public resume(): Promise<void> {
    const audio = this.getAudio();
    return audio.play();
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
    }
  }

  public seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  public setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime ?? 0;
  }

  public getDuration(): number {
    return this.audio?.duration ?? 0;
  }

  public isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  // Event management
  public on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    this.getAudio().addEventListener(event, callback as EventListener);
  }

  public off(event: string, callback: (...args: unknown[]) => void): void {
    this.listeners.get(event)?.delete(callback);
    this.audio?.removeEventListener(event, callback as EventListener);
  }

  public removeAllListeners(): void {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.audio?.removeEventListener(event, callback as EventListener);
      });
    });
    this.listeners.clear();
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();
