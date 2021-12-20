import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser"
import EmptyBox from "../EmptyBox"
import { Box } from "@mui/material"

type Props = {
  openFileDialog: () => void
}

export default function OpenStatsPage({ openFileDialog }: Props) {
  return (
    <Box onClick={() => openFileDialog()}>
      <EmptyBox icon={<OpenInBrowserIcon color="inherit" fontSize="medium" />}>
        First,{" "}
        <a
          href="https://webpack.js.org/api/cli/#stats-options"
          target="_blank"
          rel="noopener noreferrer"
        >
          generate the stats file in webpack
        </a>
        , then click here or drop it anywhere on the page to start
      </EmptyBox>
    </Box>
  )
}
