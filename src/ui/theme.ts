import { createTheme, PaletteColor, Theme } from "@mui/material"

type AppThemeExtension = {
  graph: {
    treeLevelGap: number
    treeItemHeight: number
    treeLineSize: number
    treeRailSize: number
    treeRailColor: string
    treeLineColor: {
      chained: string
      cycled: string
      enabled: string
      disabled: string
    }
  }
}
export type AppTheme = Theme & AppThemeExtension

declare module "@mui/material/styles" {
  interface Palette {
    graphAsync: PaletteColor
  }
}

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
    graphAsync: true
  }
}

export function createAppTheme() {
  const baseTheme = createTheme({
    palette: {
      mode: "dark",
    },
  })

  return createTheme(baseTheme, {
    palette: {
      graphAsync: baseTheme.palette.success,
    },
    graph: {
      treeLevelGap: 48,
      treeItemHeight: 64,
      treeLineSize: 4,
      treeRailSize: 2,
      treeRailColor: "#222",
      treeLineColor: {
        chained: baseTheme.palette.primary.main,
        cycled: baseTheme.palette.warning.main,
        enabled: "#444",
        disabled: "#222",
      },
    },
  } as AppThemeExtension)
}
