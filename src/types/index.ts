export interface AudioState {
  isPlaying: boolean;
  bpm: number;
  frequency: number;
  volume: number;
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
}

export interface TourDate {
  id: string;
  city: string;
  venue: string;
  date: string;
  country: string;
  image: string;
}

export interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}
