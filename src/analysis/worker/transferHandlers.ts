import { transferHandlers } from "comlink"
import { findKey, memoize } from "lodash"
import * as filters from "../filters"

const knownFilters = Object.values(filters).filter(
  (f) => typeof f === "function"
)

export const registerTransferHandlers = memoize(() => {
  transferHandlers.set("FILTER", {
    canHandle: (v: any): v is Function => knownFilters.includes(v),
    serialize: (filter) => [findKey(filters, (f) => filter === f), []],
    deserialize: (name: any) => filters[name],
  })
})
