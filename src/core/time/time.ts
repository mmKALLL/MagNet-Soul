export type Time = {
  start: number
  now: number
  elapsed: number
}

const initialTimeSeconds = Date.now() / 1000
export const getTime = (sinceLastTime?: Time): Time => {
  const secondsSinceEpoch = Date.now() / 1000
  return {
    start: initialTimeSeconds,
    now: secondsSinceEpoch,
    elapsed: sinceLastTime != null ? secondsSinceEpoch - sinceLastTime.now : 0,
  }
}
