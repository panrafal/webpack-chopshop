import { Stack } from "@mui/material"
import * as React from "react"

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
