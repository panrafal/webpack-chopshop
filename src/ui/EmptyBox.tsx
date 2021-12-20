import { Stack, Typography } from "@mui/material"
import * as React from "react"
import { makeStyles } from "./makeStyles"
import BlockIcon from "@mui/icons-material/Block"

type Props = {
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function EmptyBox({ children, icon }: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ padding: 2, color: "text.secondary" }}
      spacing={2}
    >
      {icon}
      <div>{children}</div>
    </Stack>
  )
}
