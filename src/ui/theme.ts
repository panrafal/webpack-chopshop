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

    groupCode: PaletteColor
    groupStyles: PaletteColor
    groupImages: PaletteColor
    groupVendors: PaletteColor
    groupOther: PaletteColor
  }
}

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
    graphAsync: true
  }
}

export function createAppTheme() {
  const baseTheme = createTheme({
    typography: { fontSize: 13 },
    palette: {
      mode: "dark",
    },
  })

  return createTheme(baseTheme, {
    palette: {
      graphAsync: baseTheme.palette.success,

      groupCode: baseTheme.palette.primary,
      groupStyles: baseTheme.palette.warning,
      groupImages: baseTheme.palette.success,
      groupVendors: baseTheme.palette.secondary,
      groupOther: {
        main: baseTheme.palette.common.white,
        contrastText: baseTheme.palette.common.black,
      },
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
