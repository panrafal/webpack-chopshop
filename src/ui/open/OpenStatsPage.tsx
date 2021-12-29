import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser"
import EmptyBox from "../EmptyBox"
import { Box, Button, LinearProgress, Typography } from "@mui/material"
import { ParseOptions } from "../../analysis/open"
import { useDropzone } from "react-dropzone"
import { useCallback, useEffect } from "react"
import { makeStyles } from "../makeStyles"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"
import { GraphLoadState } from "../../logic/useGraphState"
import ErrorBox from "../ErrorBox"

type Props = {
  openGraph: (
    file: string | File,
    options: Omit<ParseOptions, "reportProgress">
  ) => Promise<void>
  trackLoading: PromiseTrackerFn
  graphLoadState: GraphLoadState
}

const useStyles = makeStyles({ name: "OpenStatsPage" })({
  root: {},
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
        <Box>
          <LinearProgress variant="determinate" value={loading.progress} />
          <Typography color="text.secondary">{loading.message}</Typography>
        </Box>
      ) : (
        <>
          {error && <ErrorBox error={error} />}
          {/* @ts-expect-error */}
          <input {...getInputProps()} />
          <EmptyBox
            icon={<OpenInBrowserIcon color="inherit" fontSize="medium" />}
          >
            First,{" "}
            <a
              href="https://webpack.js.org/api/cli/#stats-options"
              target="_blank"
              rel="noopener noreferrer"
            >
              generate the stats file in webpack
            </a>
            , then click below or drop it anywhere on the page to start
            <Button variant="contained" onClick={() => openFileDialog()}>
              Open
            </Button>
          </EmptyBox>
        </>
      )}
    </Box>
  )
}
