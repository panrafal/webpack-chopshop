import { useTheme } from "@mui/material/styles"
import { createMakeAndWithStyles } from "tss-react"
import { AppTheme } from "./theme"

export const { makeStyles, withStyles, useStyles } = createMakeAndWithStyles({
  useTheme: useTheme as () => AppTheme,
})
