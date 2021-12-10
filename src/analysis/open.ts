import { readWebpackStats } from "./webpack"

export type OpenProgressFn = (group: string, progress: number) => void

export type ParseOptions = {
  minifySources?: boolean | "gzip"
}

async function loadJSON(
  file: string | File,
  reportProgress: OpenProgressFn
): Promise<any> {
  if (typeof file === "string") {
    const result = await fetch(file)
    reportProgress("parsing", 0.2)
    return await result.json()
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        reportProgress("parsing", 0.2)
        const json = JSON.parse(reader.result as any)
        resolve(json)
      }
      reader.onerror = () => {
        reject("Could not read the file")
      }
      reader.readAsBinaryString(file)
    })
  }
}

export async function openGraph(
  file: string | File,
  options: ParseOptions,
  reportProgress: OpenProgressFn
) {
  reportProgress("loading", 0.1)
  const json = await loadJSON(file, reportProgress)

  const graph = await readWebpackStats(json, options, reportProgress)
  console.log("Graph: ", graph)
  console.warn("Errors found: ", graph.errors)

  return graph
}
