// @flow

export const encodeUrlStateHash = (state: Object) => btoa(JSON.stringify(state))
export const decodeUrlStateHash = (hash: string) => {
  try {
    const state = JSON.parse(atob(hash))
    if (!state || typeof state !== 'object') throw new Error(`Url is not an object`)
    return state
  } catch (error) {
    console.error('Decoding url failed', error)
    return {}
  }
}
