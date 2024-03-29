import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { ListItem, ListItemButton, ListItemText } from "@mui/material"
import { ReactNode } from "react"
import { formatSize } from "../format"
import { makeStyles } from "../makeStyles"
import { GroupElement } from "./ElementList"

export type ElementListGroupProps = {
  className?: string
  style?: any

  group: GroupElement

  expanded?: boolean
  children?: ReactNode

  onClick?: () => void
  onDoubleClick?: () => void
}

const useStyles = makeStyles({ name: "ElementListGroup" })((theme) => ({
  root: {
    padding: 0,
    background: theme.palette.background.paper,
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
    zIndex: 1,
  },
}))

export default function ElementListGroup({
  className,
  style,
  group,
  expanded,
  onClick,
}: ElementListGroupProps) {
  const { classes, cx } = useStyles()

  return (
    <ListItem
      className={cx(className, classes.root)}
      dense
      // @ts-expect-error mui
      ContainerComponent="div"
      onClick={onClick}
      disableGutters
      style={
        // sticky groups should only stick to top and be covered by other groups
        (style?.position === "sticky"
          ? { ...style, top: 0, bottom: undefined, zIndex: 0 }
          : style) as any
      }
      divider
    >
      <ListItemButton>
        <ListItemText
          primary={group.name}
          secondary={`${formatSize(group.size)} in ${group.children.length}`}
        />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
    </ListItem>
  )
}
