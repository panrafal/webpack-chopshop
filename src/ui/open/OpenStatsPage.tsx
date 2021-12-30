import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
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
  const [minifySources, setMinifySources] = useState<string>(
    localStorage.getItem("minifySources") || ""
  )

  const loading =
    graphLoadState && "progress" in graphLoadState && graphLoadState
  const error = !loading && graphLoadState

  const parseOptions: ParseOptions = useMemo(
    () => ({
      minifySources:
        minifySources === "minify"
          ? true
          : minifySources === "gzip"
          ? "gzip"
          : false,
    }),
    [minifySources]
  )

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
      openGraph(file, parseOptions)
    },
    [openGraph, trackLoading, parseOptions]
  )

  // Load stats from Cmd Line
  useEffect(
    () => {
      if (process.env.REACT_APP_STATS && !initialGraphLoaded) {
        initialGraphLoaded = true
        openGraph(
          process.env.PUBLIC_URL +
            `/stats/${process.env.REACT_APP_STATS || ""}`,
          parseOptions
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
          <Typography
            variant="body1"
            sx={{ marginTop: 2, marginBottom: 2, textAlign: "center" }}
          >
            First, generate the stats file in webpack, then click below
            <br />
            or drop it anywhere on the page to start
          </Typography>
          <Button variant="contained" onClick={() => openFileDialog()}>
            Open stats file
          </Button>
          <Paper variant="outlined" sx={{ marginTop: 4, padding: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Module sizes</FormLabel>
              <RadioGroup
                row
                value={minifySources}
                onChange={(e) => {
                  const value = e.target.value as any
                  setMinifySources(value)
                  localStorage.setItem("minifySources", value)
                }}
              >
                <FormControlLabel
                  value={""}
                  control={<Radio />}
                  label="As-is"
                />
                <FormControlLabel
                  value={"minify"}
                  control={<Radio />}
                  label="Minified"
                />
                <FormControlLabel
                  value={"gzip"}
                  control={<Radio />}
                  label="GZipped"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </>
      )}
    </Box>
  )
}
