export type Session = {
  id: number;
};

const ephemeralSessionEvents = {
  EphemeralSessionChanged: "devwebpen://ephemeral-session-changed",
} as const;

type EphemeralSessionEventKeys = keyof typeof ephemeralSessionEvents;
export type EphemeralSessionEvent =
  (typeof ephemeralSessionEvents)[EphemeralSessionEventKeys];
