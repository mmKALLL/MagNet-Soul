export type Time = {
  now: number
  elapsed: number
}

export const getTime = (sinceLastTime?: Time): Time => {
  const secondsSinceEpoch = Date.now() / 1000
  return {
    now: secondsSinceEpoch,
    elapsed: sinceLastTime != null ? secondsSinceEpoch - sinceLastTime.now : 0
  }
}
