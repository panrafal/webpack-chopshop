import { Box, Button, LinearProgress, Typography } from "@mui/material"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { ParseOptions } from "../../analysis/open"
import { GraphLoadState } from "../../logic/useGraphState"
import ErrorBox from "../ErrorBox"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"
import { makeStyles } from "../makeStyles"

type Props = {
  openGraph: (
    file: string | File,
    options: Omit<ParseOptions, "reportProgress">
  ) => Promise<void>
  trackLoading: PromiseTrackerFn
  graphLoadState: GraphLoadState
}

const useStyles = makeStyles({ name: "OpenStatsPage" })({
  root: {
    width: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    justifySelf: "center",
    alignItems: "center",
  },
})

let initialGraphLoaded = false

export default function OpenStatsPage({
  openGraph,
  trackLoading,
  graphLoadState,
}: Props) {
  const { classes, cx } = useStyles()

  const loading =
    graphLoadState && "progress" in graphLoadState && graphLoadState
  const error = !loading && graphLoadState

  const handleDrop = useCallback(
    ([file], [rejected]) => {
      if (rejected) {
        trackLoading(
          Promise.reject(
            "Only webpack build stats in json format are accepted!"
          )
        )
        return
      }
      openGraph(file, {})
    },
    [openGraph, trackLoading]
  )

  // Load stats from Cmd Line
  useEffect(
    () => {
      if (process.env.REACT_APP_STATS && !initialGraphLoaded) {
        initialGraphLoaded = true
        openGraph(
          process.env.PUBLIC_URL +
            `/stats/${process.env.REACT_APP_STATS || ""}`,
          {}
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    multiple: false,
    accept: ".json",
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
    disabled: !!loading,
  })

  return (
    <Box
      onClick={() => openFileDialog()}
      {...getRootProps({ className: cx(classes.root) })}
    >
      {loading ? (
        <>
          <LinearProgress
            variant="determinate"
            value={loading.progress * 100}
            sx={{ marginBottom: 1, width: "100%" }}
          />
          <Typography variant="body2" color="text.secondary">
            {loading.message}
          </Typography>
        </>
      ) : (
        <>
          {error && <ErrorBox error={error} />}
          {/* @ts-expect-error */}
          <input {...getInputProps()} />
          <Typography variant="body1" sx={{ marginTop: 2, marginBottom: 1 }}>
            First,{" "}
            <a
              href="https://webpack.js.org/api/cli/#stats-options"
              target="_blank"
              rel="noopener noreferrer"
            >
              generate the stats file in webpack
            </a>
            , then click below or drop it anywhere on the page to start
          </Typography>
          <Button variant="contained" onClick={() => openFileDialog()}>
            Open stats file
          </Button>
        </>
      )}
    </Box>
  )
}
