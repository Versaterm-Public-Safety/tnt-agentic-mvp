export type Speaker = 'caller' | 'agent';

export function isValidSpeaker(value: unknown): value is Speaker {
  return value === 'caller' || value === 'agent';
}
