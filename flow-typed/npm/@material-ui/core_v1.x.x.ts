import type {
  ReactNode,
  ComponentType,
  ElementType,
  ReactElement,
  SyntheticEvent,
  ChangeEvent,
  UIEvent,
  FocusEvent,
  KeyboardEvent,
} from "react";

// flow-typed signature: 63e847cde7f057e6df213c255d5cd4a8
// flow-typed version: 50dbc499f3/@material-ui/core_v1.x.x/flow_>=v0.58.x

declare module "@material-ui/core/AppBar/AppBar" {
  type Color = "inherit" | "primary" | "secondary" | "default";
  type Position = "fixed" | "absolute" | "sticky" | "static";

  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
    color?: Color;
    position?: Position;
  }>;

  export = __exports;
}

declare module "@material-ui/core/AppBar" {
  let __exports: import("@material-ui/core/AppBar/AppBar");
  export = __exports;
}

declare module "@material-ui/core/Avatar/Avatar" {
  let __exports: ComponentType<{
    alt?: string;
    children?: string | ReactElement<any>;
    childrenClassName?: string;
    className?: string;
    classes?: any;
    component?: ElementType;
    imgProps?: any;
    sizes?: string;
    src?: string;
    srcSet?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Avatar" {
  let __exports: import("@material-ui/core/Avatar/Avatar");
  export = __exports;
}

declare module "@material-ui/core/Badge/Badge" {
  type Color = "default" | "primary" | "secondary" | "error";

  let __exports: ComponentType<{
    badgeContent: ReactNode;
    children: ReactNode;
    className?: string;
    classes?: any;
    color?: Color;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Badge" {
  let __exports: import("@material-ui/core/Badge/Badge");
  export = __exports;
}

declare module "@material-ui/core/BottomNavigation/BottomNavigation" {
  let __exports: ComponentType<{
    children: ReactNode;
    className?: string;
    classes?: any;
    onChange?: Function;
    showLabels?: boolean;
    value: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/BottomNavigationAction/BottomNavigationAction" {
  let __exports: ComponentType<{
    className?: string;
    classes?: any;
    icon?: string | ReactElement<any>;
    label?: ReactNode;
    onChange?: Function;
    onClick?: Function;
    selected?: boolean;
    showLabel?: boolean;
    value?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/BottomNavigation" {
  let __default: import("@material-ui/core/BottomNavigation/BottomNavigation");
  export default __default;
}

declare module "@material-ui/core/BottomNavigationAction" {
  let __default: import("@material-ui/core/BottomNavigationAction/BottomNavigationAction");
  export default __default;
}

declare module "@material-ui/core/Button/Button" {
  type Color = "default" | "inherit" | "primary" | "secondary";
  type Variant =
    | "text"
    | "flat"
    | "outlined"
    | "contained"
    | "raised"
    | "fab"
    | "extendedFab";
  type Size = "small" | "medium" | "large";

  let __exports: ComponentType<{
    children: ReactNode;
    className?: string;
    classes?: any;
    color?: Color;
    component?: ElementType;
    disabled?: boolean;
    disableFocusRipple?: boolean;
    disableRipple?: boolean;
    fullWidth?: boolean;
    href?: string;
    mini?: boolean;
    size?: Size;
    variant?: Variant;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Button" {
  let __exports: import("@material-ui/core/Button/Button");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/ButtonBase" {
  let __exports: ComponentType<{
    centerRipple?: boolean;
    children?: ReactNode;
    className?: string;
    classes?: any;
    component?: ElementType;
    disableRipple?: boolean;
    disabled?: boolean;
    focusRipple?: boolean;
    keyboardFocusedClassName?: string;
    onBlur?: Function;
    onClick?: Function;
    onFocus?: Function;
    onKeyDown?: Function;
    onKeyUp?: Function;
    onMouseDown?: Function;
    onMouseLeave?: Function;
    onMouseUp?: Function;
    onTouchEnd?: Function;
    onTouchMove?: Function;
    onTouchStart?: Function;
    role?: string;
    rootRef?: Function;
    tabIndex?: number | string;
    type?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ButtonBase/createRippleHandler" {
  function handleEvent(event: UIEvent<any>): void;
  let __exports: (
    instance: any,
    eventName: string,
    action: string,
    cb?: Function | null
  ) => handleEvent;
  export = __exports;
}

declare module "@material-ui/core/ButtonBase" {
  let __exports: import("@material-ui/core/ButtonBase/ButtonBase");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/Ripple" {
  let __exports: ComponentType<{
    className?: string;
    classes?: any;
    pulsate?: boolean;
    rippleSize: number;
    rippleX: number;
    rippleY: number;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ButtonBase/TouchRipple" {
  let __exports: ComponentType<{
    center?: boolean;
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Card/Card" {
  let __exports: ComponentType<{
    className?: string;
    raised?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/CardActions/CardActions" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
    disableActionSpacing?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/CardContent/CardContent" {
  let __exports: ComponentType<{
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/CardHeader/CardHeader" {
  let __exports: ComponentType<{
    action?: ReactNode;
    avatar?: ReactNode;
    className?: string;
    classes?: any;
    subheader?: ReactNode;
    title?: ReactNode;
  }>;

  export = __exports;
}

declare module "@material-ui/core/CardMedia/CardMedia" {
  let __exports: ComponentType<{
    className?: string;
    classes?: any;
    component?: ElementType;
    image?: string;
    src?: string;
    style?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Card" {
  let __default: import("@material-ui/core/Card/Card");
  export default __default;
}

declare module "@material-ui/core/CardActions" {
  let __default: import("@material-ui/core/CardActions/CardActions");
  export default __default;
}

declare module "@material-ui/core/CardContent" {
  let __default: import("@material-ui/core/CardContent/CardContent");
  export default __default;
}

declare module "@material-ui/core/CardHeader" {
  let __default: import("@material-ui/core/CardHeader/CardHeader");
  export default __default;
}

declare module "@material-ui/core/CardMedia" {
  let __default: import("@material-ui/core/CardMedia/CardMedia");
  export default __default;
}

declare module "@material-ui/core/Checkbox/Checkbox" {
  let __exports: ComponentType<{
    checked?: boolean | string;
    checkedIcon?: ReactNode;
    className?: string;
    classes?: any;
    defaultChecked?: boolean;
    disableRipple?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    indeterminate?: boolean;
    indeterminateIcon?: ReactNode;
    inputProps?: any;
    inputRef?: Function;
    name?: string;
    onChange?: Function;
    tabIndex?: number | string;
    value?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Checkbox" {
  let __exports: import("@material-ui/core/Checkbox/Checkbox");
  export = __exports;
}

declare module "@material-ui/core/Chip/Chip" {
  type Avatar = typeof import("@material-ui/core/Avatar/Avatar").default;

  let __exports: ComponentType<{
    avatar?: ReactElement<Avatar>;
    className?: string;
    classes?: any;
    deleteIcon?: ReactElement<any>;
    label?: ReactNode;
    onClick?: Function;
    onDelete?: (event: SyntheticEvent<any>) => void;
    onKeyDown?: Function;
    tabIndex?: number | string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Chip" {
  let __exports: import("@material-ui/core/Chip/Chip");
  export = __exports;
}

declare module "@material-ui/core/CssBaseline/CssBaseline" {
  let __exports: ComponentType<{
    children?: ReactNode;
  }>;

  export = __exports;
}

declare module "@material-ui/core/CssBaseline" {
  let __exports: import("@material-ui/core/CssBaseline/CssBaseline");
  export = __exports;
}

declare module "@material-ui/core/colors/amber" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/blue" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/blueGrey" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/brown" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/common" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/cyan" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/deepOrange" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/deepPurple" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/green" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/grey" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/indigo" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/lightBlue" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/lightGreen" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/lime" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/orange" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/pink" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/purple" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/red" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/teal" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/colors/yellow" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/Dialog/Dialog" {
  import type {
    TransitionCallback,
    TransitionDuration,
  } from "@material-ui/core/internal/transition";
  type MaxWidth = "xs" | "sm" | "md" | false;

  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
    fullScreen?: boolean;
    fullWidth?: boolean;
    ignoreBackdropClick?: boolean;
    ignoreEscapeKeyUp?: boolean;
    maxWidth?: MaxWidth;
    onBackdropClick?: Function;
    onClose?: Function;
    onEnter?: TransitionCallback;
    onEntered?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEscapeKeyUp?: Function;
    onExit?: TransitionCallback;
    onExited?: TransitionCallback;
    onExiting?: TransitionCallback;
    open?: boolean;
    transition?: ComponentType<any>;
    transitionDuration?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/DialogActions/DialogActions" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/DialogContent/DialogContent" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/DialogContentText/DialogContentText" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/DialogTitle/DialogTitle" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
    disableTypography?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/withMobileDialog/withMobileDialog" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/Dialog" {
  let __default: import("@material-ui/core/Dialog/Dialog");
  export default __default;
}

declare module "@material-ui/core/DialogActions" {
  let __default: import("@material-ui/core/DialogActions/DialogActions");
  export default __default;
}

declare module "@material-ui/core/DialogContent" {
  let __default: import("@material-ui/core/DialogContent/DialogContent");
  export default __default;
}

declare module "@material-ui/core/DialogContentText" {
  let __default: import("@material-ui/core/DialogContentText/DialogContentText");
  export default __default;
}

declare module "@material-ui/core/DialogTitle" {
  let __default: import("@material-ui/core/DialogTitle/DialogTitle");
  export default __default;
}

declare module "@material-ui/core/withMobileDialog" {
  let __default: import("@material-ui/core/withMobileDialog/withMobileDialog");
  export default __default;
}

declare module "@material-ui/core/withWidth" {
  import type { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
  export var isWidthUp: (
    matchWidth: Breakpoint,
    currentWidth: Breakpoint
  ) => boolean;
  export var isWidthDown: (
    matchWidth: Breakpoint,
    currentWidth: Breakpoint
  ) => boolean;
  let __default: import("@material-ui/core/withWidth/withWidth");
  export default __default;
}

declare module "@material-ui/core/Divider/Divider" {
  let __exports: ComponentType<{
    absolute?: boolean;
    className?: string;
    classes?: any;
    inset?: boolean;
    light?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Divider" {
  let __exports: import("@material-ui/core/Divider/Divider");
  export = __exports;
}

declare module "@material-ui/core/Drawer/Drawer" {
  import type { TransitionDuration } from "@material-ui/core/internal/transition";

  type Anchor = "left" | "top" | "right" | "bottom";
  type Variant = "permanent" | "persistent" | "temporary";

  let __exports: ComponentType<{
    ModalProps?: any;
    SlideProps?: any;
    PaperProps?: any;
    anchor?: Anchor;
    children: ReactNode;
    className?: string;
    classes?: any;
    elevation?: number;
    onClose?: Function;
    open?: boolean;
    transitionDuration?: TransitionDuration;
    variant?: Variant;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Drawer" {
  let __exports: import("@material-ui/core/Drawer/Drawer");
  export = __exports;
}

declare module "@material-ui/core/SwipeableDrawer/SwipeableDrawer" {
  type Drawer = typeof import("@material-ui/core/Drawer/Drawer").default;
  import type { TransitionDuration } from "@material-ui/core/internal/transition";

  let __exports: ComponentType<
    {
      disableBackdropTransition: boolean;
      disableDiscovery: boolean;
      disableSwipeToOpen: boolean;
      onClose?: Function;
      onOpen?: Function;
      open?: boolean;
      swipeAreaWidth: number;
      transitionDuration?: TransitionDuration;
    } & Drawer
  >;

  export = __exports;
}

declare module "@material-ui/core/SwipeableDrawer" {
  let __exports: import("@material-ui/core/SwipeableDrawer/SwipeableDrawer");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel/ExpansionPanel" {
  let __exports: ComponentType<{
    CollapseProps?: any;
    children?: ReactNode;
    className?: string;
    classes?: any;
    defaultExpanded?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    onChange?: Function;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
    disabled?: boolean;
    expanded?: boolean;
    expandIcon?: ReactNode;
    onChange?: Function;
    onClick?: Function;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel" {
  let __default: import("@material-ui/core/ExpansionPanel/ExpansionPanel");
  export default __default;
}

declare module "@material-ui/core/ExpansionPanelActions" {
  let __default: import("@material-ui/core/ExpansionPanelActions/ExpansionPanelActions");
  export default __default;
}

declare module "@material-ui/core/ExpansionPanelDetails" {
  let __default: import("@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails");
  export default __default;
}

declare module "@material-ui/core/ExpansionPanelSummary" {
  let __default: import("@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary");
  export default __default;
}

declare module "@material-ui/core/FormControl/FormControl" {
  type Margin = "none" | "dense" | "normal";

  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    disabled?: boolean;
    error?: boolean;
    fullWidth?: boolean;
    margin?: Margin;
    onBlur?: Function;
    onFocus?: Function;
    required?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/FormControlLabel/FormControlLabel" {
  let __exports: ComponentType<{
    checked?: boolean | string;
    classes?: any;
    className?: string;
    control: ReactElement<any>;
    disabled?: boolean;
    inputRef?: Function;
    label: ReactNode;
    name?: string;
    onChange?: Function;
    value?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/FormGroup/FormGroup" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    row?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/FormHelperText/FormHelperText" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    margin?: "dense";
  }>;

  export = __exports;
}

declare module "@material-ui/core/FormLabel/FormLabel" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    disabled?: boolean;
    error?: boolean;
    focused?: boolean;
    required?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/FormControl" {
  let __exports: import("@material-ui/core/FormControl/FormControl");
  export = __exports;
}

declare module "@material-ui/core/FormControlLabel" {
  let __exports: import("@material-ui/core/FormControlLabel/FormControlLabel");
  export = __exports;
}

declare module "@material-ui/core/FormGroup" {
  let __exports: import("@material-ui/core/FormGroup/FormGroup");
  export = __exports;
}

declare module "@material-ui/core/FormHelperText" {
  let __exports: import("@material-ui/core/FormHelperText/FormHelperText");
  export = __exports;
}

declare module "@material-ui/core/FormLabel" {
  let __exports: import("@material-ui/core/FormLabel/FormLabel");
  export = __exports;
}

declare module "@material-ui/core/Grid/Grid" {
  type GridSizes = boolean | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  type AlignContent =
    | "stretch"
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around";
  type AlignItems =
    | "flex-start"
    | "center"
    | "flex-end"
    | "stretch"
    | "baseline";
  type Direction = "row" | "row-reverse" | "column" | "column-reverse";
  type Justify =
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  type Spacing = 0 | 8 | 16 | 24 | 32 | 40;
  type Wrap = "nowrap" | "wrap" | "wrap-reverse";

  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    container?: boolean;
    item?: boolean;
    alignContent?: AlignContent;
    alignItems?: AlignItems;
    direction?: Direction;
    spacing?: Spacing;
    hidden?: any;
    justify?: Justify;
    wrap?: Wrap;
    xs?: GridSizes;
    sm?: GridSizes;
    md?: GridSizes;
    lg?: GridSizes;
    xl?: GridSizes;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Grid" {
  let __exports: import("@material-ui/core/Grid/Grid");
  export = __exports;
}

declare module "@material-ui/core/GridList/GridList" {
  type CellHeight = number | "auto";

  let __exports: ComponentType<{
    cellHeight?: CellHeight;
    children: ReactNode;
    classes?: any;
    className?: string;
    cols?: number;
    component?: ElementType;
    spacing?: number;
    style?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/GridListTile/GridListTile" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    cols?: number;
    component?: ElementType;
    rows?: number;
  }>;

  export = __exports;
}

declare module "@material-ui/core/GridListTileBar/GridListTileBar" {
  type TitlePosition = "top" | "bottom";
  type ActionPosition = "left" | "right";

  let __exports: ComponentType<{
    actionIcon?: ReactNode;
    actionPosition?: ActionPosition;
    classes?: any;
    className?: string;
    subtitle?: ReactNode;
    title: ReactNode;
    titlePosition?: TitlePosition;
  }>;

  export = __exports;
}

declare module "@material-ui/core/GridList" {
  let __default: import("@material-ui/core/GridList/GridList");
  export default __default;
}

declare module "@material-ui/core/GridListTile" {
  let __default: import("@material-ui/core/GridListTile/GridListTile");
  export default __default;
}

declare module "@material-ui/core/GridListTileBar" {
  let __default: import("@material-ui/core/GridListTileBar/GridListTileBar");
  export default __default;
}

declare module "@material-ui/core/Hidden/Hidden" {
  import type { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

  let __exports: ComponentType<{
    children: ReactNode;
    className?: string;
    only?: Breakpoint | Array<Breakpoint>;
    xsUp?: boolean;
    smUp?: boolean;
    mdUp?: boolean;
    lgUp?: boolean;
    xlUp?: boolean;
    xsDown?: boolean;
    smDown?: boolean;
    mdDown?: boolean;
    lgDown?: boolean;
    xlDown?: boolean;
    implementation?: "js" | "css";
    initialWidth?: number;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Hidden/HiddenCss" {
  type Hidden = typeof import("@material-ui/core/Hidden/Hidden").default;
  let __exports: ComponentType<React$ElementProps<Hidden>>;
  export = __exports;
}

declare module "@material-ui/core/Hidden/HiddenJs" {
  type Hidden = typeof import("@material-ui/core/Hidden/Hidden").default;
  let __exports: ComponentType<React$ElementProps<Hidden>>;
  export = __exports;
}

declare module "@material-ui/core/Hidden" {
  let __default: import("@material-ui/core/Hidden/Hidden");
  export default __default;
}

declare module "@material-ui/core/Hidden/types" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/Icon/Icon" {
  type Color =
    | "inherit"
    | "accent"
    | "action"
    | "contrast"
    | "disabled"
    | "error"
    | "primary";

  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    classes?: any;
    color?: Color;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Icon" {
  let __exports: import("@material-ui/core/Icon/Icon");
  export = __exports;
}

declare module "@material-ui/core/IconButton/IconButton" {
  type Color = "default" | "inherit" | "primary" | "secondary";

  let __exports: ComponentType<{
    buttonRef?: Function;
    children?: ReactNode;
    classes?: any;
    className?: string;
    color?: Color;
    disabled?: boolean;
    disableRipple?: boolean;
    rootRef?: Function;
  }>;

  export = __exports;
}

declare module "@material-ui/core/IconButton" {
  let __exports: import("@material-ui/core/IconButton/IconButton");
  export = __exports;
}

declare module "@material-ui/core/Input" {
  let __default: import("@material-ui/core/Input/Input");
  export default __default;
}

declare module "@material-ui/core/InputAdornment" {
  let __default: import("@material-ui/core/InputAdornment/InputAdornment");
  export default __default;
}

declare module "@material-ui/core/InputLabel" {
  let __default: import("@material-ui/core/InputLabel/InputLabel");
  export default __default;
}

declare module "@material-ui/core/Input/Input" {
  let __exports: ComponentType<{
    autoComplete?: string;
    autoFocus?: boolean;
    classes?: any;
    className?: string;
    defaultValue?: string | number;
    disabled?: boolean;
    disableUnderline?: boolean;
    endAdornment?: ReactNode;
    error?: boolean;
    fullWidth?: boolean;
    id?: string;
    inputComponent?: string | ComponentType<any>;
    inputProps?: any;
    inputRef?: Function;
    margin?: "dense" | "none";
    multiline?: boolean;
    name?: string;
    readOnly?: boolean;
    onBlur?: (event: FocusEvent<any>) => void;
    onChange?: (event: ChangeEvent<any>) => void;
    onClean?: () => void;
    onDirty?: () => void;
    onFocus?: (event: FocusEvent<any>) => void;
    onKeyDown?: (event: KeyboardEvent<any>) => void;
    onKeyUp?: (event: KeyboardEvent<any>) => void;
    placeholder?: string;
    rows?: string | number;
    rowsMax?: string | number;
    startAdornment?: ReactNode;
    type?: string;
    value?: string | number | Array<string | number>;
  }>;

  export = __exports;
}

declare module "@material-ui/core/InputAdornment/InputAdornment" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    disableTypography?: boolean;
    position: "start" | "end";
  }>;

  export = __exports;
}

declare module "@material-ui/core/InputLabel/InputLabel" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    disableAnimation?: boolean;
    disabled?: boolean;
    error?: boolean;
    FormControlClasses?: any;
    focused?: boolean;
    margin?: "dense";
    required?: boolean;
    shrink?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Input/Textarea" {
  type Rows = string | number;

  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    defaultValue?: string | number;
    disabled?: boolean;
    onChange?: Function;
    rows: Rows;
    rowsMax?: string | number;
    textareaRef?: Function;
    value?: string | number;
  }>;

  export = __exports;
}

declare module "@material-ui/core/internal/dom" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/Portal/Portal" {
  let __exports: ComponentType<{
    children?: ReactNode;
    open?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Portal" {
  let __exports: import("@material-ui/core/Portal/Portal");
  export = __exports;
}

declare module "@material-ui/core/internal/SwitchBase" {
  let __exports: ComponentType<{
    checked?: boolean | string;
    checkedIcon?: ReactNode;
    children?: ReactNode;
    classes?: any;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    disableRipple?: boolean;
    icon?: ReactNode;
    indeterminate?: boolean;
    indeterminateIcon?: ReactNode;
    inputProps?: any;
    inputRef?: Function;
    inputType?: string;
    name?: string;
    onChange?: Function;
    tabIndex?: number | string;
    value?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/internal/transition" {
  type TransitionDuration =
    | number
    | {
        enter: number;
        exit: number;
      };

  type TransitionCallback = (element: HTMLElement) => void;

  type TransitionClasses = {
    appear?: string;
    appearActive?: string;
    enter?: string;
    enterActive?: string;
    exit?: string;
    exitActive?: string;
  };
}

declare module "@material-ui/core/List" {
  let __default: import("@material-ui/core/List/List");
  export default __default;
}

declare module "@material-ui/core/ListItem" {
  let __default: import("@material-ui/core/ListItem/ListItem");
  export default __default;
}

declare module "@material-ui/core/ListItemAvatar" {
  let __default: import("@material-ui/core/ListItemAvatar/ListItemAvatar");
  export default __default;
}

declare module "@material-ui/core/ListItemIcon" {
  let __default: import("@material-ui/core/ListItemIcon/ListItemIcon");
  export default __default;
}

declare module "@material-ui/core/ListItemSecondaryAction" {
  let __default: import("@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction");
  export default __default;
}

declare module "@material-ui/core/ListItemText" {
  let __default: import("@material-ui/core/ListItemText/ListItemText");
  export default __default;
}

declare module "@material-ui/core/ListSubheader" {
  let __default: import("@material-ui/core/ListSubheader/ListSubheader");
  export default __default;
}

declare module "@material-ui/core/List/List" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    dense?: boolean;
    disablePadding?: boolean;
    rootRef?: Function;
    subheader?: ReactNode;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ListItem/ListItem" {
  let __exports: ComponentType<{
    button?: boolean;
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    dense?: boolean;
    disabled?: boolean;
    disableGutters?: boolean;
    divider?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ListItemAvatar/ListItemAvatar" {
  let __exports: ComponentType<{
    children: ReactElement<any>;
    classes?: any;
    className?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ListItemIcon/ListItemIcon" {
  let __exports: ComponentType<{
    children: ReactElement<any>;
    classes?: any;
    className?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ListItemText/ListItemText" {
  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    disableTypography?: boolean;
    inset?: boolean;
    primary?: ReactNode;
    secondary?: ReactNode;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ListSubheader/ListSubheader" {
  type Color = "default" | "primary" | "inherit";

  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    color?: Color;
    disableSticky?: boolean;
    inset?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Menu" {
  let __default: import("@material-ui/core/Menu/Menu");
  export default __default;
}

declare module "@material-ui/core/MenuItem" {
  let __default: import("@material-ui/core/MenuItem/MenuItem");
  export default __default;
}

declare module "@material-ui/core/MenuList" {
  let __default: import("@material-ui/core/MenuList/MenuList");
  export default __default;
}

declare module "@material-ui/core/Menu/Menu" {
  import type { TransitionCallback } from "@material-ui/core/internal/transition";

  type TransitionDuration =
    | number
    | {
        enter?: number;
        exit?: number;
      }
    | "auto";

  let __exports: ComponentType<{
    anchorEl?: HTMLElement | null;
    children?: ReactNode;
    classes?: any;
    MenuListProps?: any;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    onExited?: TransitionCallback;
    onClose?: Function;
    open?: boolean;
    PaperProps?: any;
    PopoverClasses?: any;
    transitionDuration?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/MenuItem/MenuItem" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    role?: string;
    selected?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/MenuList/MenuList" {
  let __exports: ComponentType<{
    children?: ReactNode;
    className?: string;
    onBlur?: Function;
    onKeyDown?: (event: UIEvent<any>, key: string) => void;
  }>;

  export = __exports;
}

declare module "@material-ui/core/MobileStepper" {
  let __exports: import("@material-ui/core/MobileStepper/MobileStepper");
  export = __exports;
}

declare module "@material-ui/core/MobileStepper/MobileStepper" {
  type Position = "bottom" | "top" | "static";
  type Variant = "text" | "dots" | "progress";

  let __exports: ComponentType<{
    activeStep?: number;
    backButton: ReactElement<any>;
    classes?: any;
    className?: string;
    nextButton: ReactElement<any>;
    position?: Position;
    steps: number;
    variant?: Variant;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Backdrop/Backdrop" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    invisible?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Modal/ModalManager" {
  class ModalManager {
    constructor(a: any);
    add(b: any, a: any): void;
    remove(a: any): number;
    isTopModal(modal: any): boolean;
  }

  let __default: typeof ModalManager;
  export default __default;
}

declare module "@material-ui/core/Modal" {
  let __default: import("@material-ui/core/Modal/Modal");
  export default __default;
  export var ModalManager: import("@material-ui/core/Modal/ModalManager");
}

declare module "@material-ui/core/Backdrop" {
  let __default: import("@material-ui/core/Backdrop/Backdrop");
  export default __default;
}

declare module "@material-ui/core/Modal/Modal" {
  import type {
    TransitionDuration,
    TransitionCallback,
  } from "@material-ui/core/internal/transition";

  let __exports: ComponentType<{
    BackdropClassName?: string;
    BackdropComponent?: ElementType;
    BackdropInvisible?: boolean;
    BackdropTransitionDuration?: TransitionDuration;
    children?: ReactElement<any>;
    classes?: any;
    className?: string;
    keepMounted?: boolean;
    disableBackdrop?: boolean;
    ignoreBackdropClick?: boolean;
    ignoreEscapeKeyUp?: boolean;
    modalManager?: any;
    onBackdropClick?: Function;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onEscapeKeyUp?: Function;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    onExited?: TransitionCallback;
    onClose?: Function;
    open: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Modal/ModalManager" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/NativeSelect" {
  let __exports: import("@material-ui/core/NativeSelect/NativeSelect");
  export = __exports;
}

declare module "@material-ui/core/NativeSelect/NativeSelect" {
  let __exports: ComponentType<{
    classes: any;
    children?: ReactNode;
    IconComponent?: ElementType | Function;
    input?: ReactElement<any>;
    inputProps?: any;
    onChange?: Function;
    value?: string | number;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Paper" {
  let __exports: import("@material-ui/core/Paper/Paper");
  export = __exports;
}

declare module "@material-ui/core/Paper/Paper" {
  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    children?: ReactNode;
    component?: ElementType;
    elevation?: number;
    square?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Popover" {
  let __exports: import("@material-ui/core/Popover/Popover");
  export = __exports;
}

declare module "@material-ui/core/Popover/Popover" {
  import type {
    TransitionCallback,
    TransitionClasses,
  } from "@material-ui/core/internal/transition";

  type Position = {
    top: number;
    left: number;
  };

  type Origin = {
    horizontal: "left" | "center" | "right" | number;
    vertical: "top" | "center" | "bottom" | number;
  };

  let __exports: ComponentType<{
    anchorEl?: HTMLElement | null;
    anchorPosition?: Position;
    anchorReference?: "anchorEl" | "anchorPosition";
    anchorOrigin?: Origin;
    children: ReactNode;
    classes?: any;
    elevation?: number;
    getContentAnchorEl?: Function;
    marginThreshold?: number;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    onExited?: TransitionCallback;
    onClose?: Function;
    open: boolean;
    PaperProps?: any;
    role?: string;
    transformOrigin?: Origin;
    transitionClasses?: TransitionClasses;
    transitionDuration?:
      | number
      | {
          enter?: number;
          exit?: number;
        }
      | "auto";
  }>;

  export = __exports;
}

declare module "@material-ui/core/CircularProgress/CircularProgress" {
  type Color = "primary" | "secondary" | "inherit";
  type Mode = "determinate" | "indeterminate";
  type Variant = "determinate" | "indeterminate" | "static";

  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    color?: Color;
    max?: number;
    min?: number;
    mode?: Mode;
    size?: number | string;
    style?: any;
    thickness?: number;
    value?: number;
    variant?: Variant;
  }>;

  export = __exports;
}

declare module "@material-ui/core/CircularProgress" {
  let __default: import("@material-ui/core/CircularProgress/CircularProgress");
  export default __default;
}

declare module "@material-ui/core/LinearProgress" {
  let __default: import("@material-ui/core/LinearProgress/LinearProgress");
  export default __default;
}

declare module "@material-ui/core/LinearProgress/LinearProgress" {
  type Color = "primary" | "accent";
  type Mode = "determinate" | "indeterminate" | "buffer" | "query";

  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    color?: Color;
    mode?: Mode;
    value?: number;
    valueBuffer?: number;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Radio" {
  let __default: import("@material-ui/core/Radio/Radio");
  export default __default;
}

declare module "@material-ui/core/RadioGroup" {
  let __default: import("@material-ui/core/RadioGroup/RadioGroup");
  export default __default;
}

declare module "@material-ui/core/Radio/Radio" {
  let __exports: ComponentType<{
    checked?: boolean | string;
    checkedIcon?: ReactNode;
    children?: ReactNode;
    classes?: any;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    disableRipple?: boolean;
    icon?: ReactNode;
    inputProps?: any;
    inputRef?: Function;
    name?: string;
    onChange?: Function;
    tabIndex?: number | string;
    value?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/RadioGroup/RadioGroup" {
  let __exports: ComponentType<{
    children?: ReactNode;
    name?: string;
    onBlur?: Function;
    onChange?: Function;
    onKeyDown?: Function;
    value?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Select" {
  let __exports: import("@material-ui/core/Select/Select");
  export = __exports;
}

declare module "@material-ui/core/Select/Select" {
  let __exports: ComponentType<{
    autoWidth?: boolean;
    children: ReactNode;
    classes?: any;
    displayEmpty?: boolean;
    input?: ReactElement<any>;
    inputProps?: any;
    native?: boolean;
    multiple?: boolean;
    onChange?: (event: ChangeEvent<any>, child: any) => void;
    onClose?: (event: UIEvent<any>) => void;
    onOpen?: (event: UIEvent<any>) => void;
    open?: boolean;
    MenuProps?: any;
    renderValue?: Function;
    value?: ReadonlyArray<string | number> | string | number | null;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Select/SelectInput" {
  let __exports: ComponentType<{
    autoWidth: boolean;
    children: ReactNode;
    classes?: any;
    className?: string;
    disabled?: boolean;
    displayEmpty: boolean;
    native: boolean;
    multiple: boolean;
    MenuProps?: any;
    name?: string;
    onBlur?: Function;
    onChange?: (event: UIEvent<any>, child: ReactElement<any>) => void;
    onFocus?: Function;
    readOnly?: boolean;
    renderValue?: Function;
    selectRef?: Function;
    value?: string | number | ReadonlyArray<string | number>;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Snackbar" {
  let __default: import("@material-ui/core/Snackbar/Snackbar");
  export default __default;
  export var SnackbarContent: import("@material-ui/core/SnackbarContent/SnackbarContent");
}

declare module "@material-ui/core/SnackbarContent" {
  let __default: import("@material-ui/core/SnackbarContent/SnackbarContent");
  export default __default;
}

declare module "@material-ui/core/Snackbar/Snackbar" {
  import type {
    TransitionDuration,
    TransitionCallback,
  } from "@material-ui/core/internal/transition";

  type Origin = {
    horizontal?: "left" | "center" | "right" | number;
    vertical?: "top" | "center" | "bottom" | number;
  };

  let __exports: ComponentType<{
    action?: ReactNode;
    anchorOrigin?: Origin;
    autoHideDuration?: number | null;
    resumeHideDuration?: number;
    children?: ReactElement<any>;
    classes?: any;
    className?: string;
    key?: any;
    message?: ReactNode;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    onExited?: TransitionCallback;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onClose?: (event: Event | undefined | null, reason: string) => void;
    open: boolean;
    SnackbarContentProps?: any;
    transition?: ComponentType<any>;
    transitionDuration?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/SnackbarContent/SnackbarContent" {
  let __exports: ComponentType<{
    action?: ReactNode;
    classes?: any;
    className?: string;
    message: ReactNode;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Step" {
  let __default: import("@material-ui/core/Step/Step");
  export default __default;
}

declare module "@material-ui/core/StepButton" {
  let __default: import("@material-ui/core/StepButton/StepButton");
  export default __default;
}

declare module "@material-ui/core/StepContent" {
  let __default: import("@material-ui/core/StepContent/StepContent");
  export default __default;
}

declare module "@material-ui/core/StepIcon" {
  let __default: import("@material-ui/core/StepIcon/StepIcon");
  export default __default;
}

declare module "@material-ui/core/StepLabel" {
  let __default: import("@material-ui/core/StepLabel/StepLabel");
  export default __default;
}

declare module "@material-ui/core/Stepper" {
  let __default: import("@material-ui/core/Stepper/Stepper");
  export default __default;
}

declare module "@material-ui/core/Step/Step" {
  import type { Orientation } from "@material-ui/core/Stepper/Stepper";

  let __exports: ComponentType<{
    active?: boolean;
    alternativeLabel?: boolean;
    children?: ReactNode;
    classes?: any;
    className?: string;
    completed?: boolean;
    connector?: ReactElement<any>;
    disabled?: boolean;
    index?: number;
    last?: boolean;
    optional?: boolean;
    orientation?: Orientation;
  }>;

  export = __exports;
}

declare module "@material-ui/core/StepButton/StepButton" {
  import type { Orientation } from "@material-ui/core/Stepper/Stepper";

  type Icon = ReactElement<any> | string | number;

  let __exports: ComponentType<{
    active?: boolean;
    alternativeLabel?: boolean;
    children: ReactElement<any>;
    classes?: any;
    className?: string;
    completed?: boolean;
    disabled?: boolean;
    icon?: Icon;
    last?: boolean;
    optional?: boolean;
    orientation?: Orientation;
  }>;

  export = __exports;
}

declare module "@material-ui/core/StepConnector/StepConnector" {
  import type { Orientation } from "@material-ui/core/Stepper/Stepper";

  let __exports: ComponentType<{
    alternativeLabel?: boolean;
    classes?: any;
    className?: string;
    orientation?: Orientation;
  }>;

  export = __exports;
}

declare module "@material-ui/core/StepContent/StepContent" {
  import type { TransitionDuration } from "@material-ui/core/Collapse/Collapse";
  import type { Orientation } from "@material-ui/core/Stepper/Stepper";

  let __exports: ComponentType<{
    active?: boolean;
    alternativeLabel?: boolean;
    children: ReactNode;
    classes?: any;
    className?: string;
    completed?: boolean;
    last?: boolean;
    optional?: boolean;
    orientation?: Orientation;
    transition?: Function;
    transitionDuration?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/StepIcon/StepIcon" {
  import type { Icon } from "@material-ui/core/StepButton/StepButton";

  let __exports: ComponentType<{
    active?: boolean;
    classes?: any;
    completed?: boolean;
    icon?: Icon;
  }>;

  export = __exports;
}

declare module "@material-ui/core/StepLabel/StepLabel" {
  import type { Orientation } from "@material-ui/core/Stepper/Stepper";
  import type { Icon } from "@material-ui/core/StepButton/StepButton";

  let __exports: ComponentType<{
    active?: boolean;
    alternativeLabel?: boolean;
    children: ReactNode;
    classes?: any;
    className?: string;
    completed?: boolean;
    disabled?: boolean;
    icon?: Icon;
    last?: boolean;
    optional?: boolean;
    orientation?: Orientation;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Stepper/Stepper" {
  type Step = typeof import("@material-ui/core/Step/Step").default;
  type StepConnector =
    typeof import("@material-ui/core/StepConnector/StepConnector").default;
  type Orientation = "horizontal" | "vertical";

  let __exports: ComponentType<{
    activeStep?: number;
    alternativeLabel?: boolean;
    children: ReactNode;
    classes?: any;
    className?: string;
    connector?: ReactElement<StepConnector> | ReactNode;
    nonLinear?: boolean;
    orientation?: Orientation;
  }>;

  export = __exports;
}

declare module "@material-ui/core/StepIcion/StepPositionIcon" {
  import type { Icon } from "@material-ui/core/StepButton/StepButton";

  let __exports: ComponentType<{
    active?: boolean;
    classes?: any;
    className?: string;
    position?: Icon;
  }>;

  export = __exports;
}

declare module "@material-ui/core/styles/colorManipulator" {
  let __exports: {
    convertColorToString: (color: any) => any;
    convertHexToRGB: (color: string) => any;
    decomposeColor: (color: string) => any;
    getContrastRatio: (foreground: string, background: string) => any;
    getLuminance: (color: string) => any;
    emphasize: (color: string, coefficient: number) => any;
    fade: (color: string, value: number) => any;
    darken: (color: string, coefficient: number) => any;
    lighten: (color: string, coefficient: number) => any;
  };

  export = __exports;
}

declare module "@material-ui/core/styles/createBreakpoints" {
  type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

  let __exports: {
    keys: Array<Breakpoint>;
    default: (breakpoints: any) => any;
  };

  export = __exports;
}

declare module "@material-ui/core/styles/createGenerateClassName" {
  let __exports: () => any;
  export = __exports;
}

declare module "@material-ui/core/styles/createMixins" {
  let __exports: (breakpoints: any, spacing: any, mixins: any) => any;
  export = __exports;
}

declare module "@material-ui/core/styles/createMuiTheme" {
  let __exports: (options: any) => any;
  export = __exports;
}

declare module "@material-ui/core/styles/createPalette" {
  export var light: any;
  export var dark: any;
  let __default: (palette: any) => any;
  export default __default;
}

declare module "@material-ui/core/styles/createTypography" {
  let __exports: (palette: any, typography: any | Function) => any;
  export = __exports;
}

declare module "@material-ui/core/styles/jssPreset" {
  let __exports: () => any;
  export = __exports;
}

declare module "@material-ui/core/styles/getStylesCreator" {
  let __exports: (stylesOrCreator: any | ((a: any) => any)) => any;
  export = __exports;
}

declare module "@material-ui/core/styles" {
  let __exports: {
    MuiThemeProvider: import("@material-ui/core/styles/MuiThemeProvider");
    withStyles: import("@material-ui/core/styles/withStyles");
    withTheme: import("@material-ui/core/styles/withTheme");
    createMuiTheme: import("@material-ui/core/styles/createMuiTheme");
    jssPreset: import("@material-ui/core/styles/jssPreset");
  };

  export = __exports;
}

declare module "@material-ui/core/styles/MuiThemeProvider" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/styles/shadows" {
  let __exports: Array<any>;
  export = __exports;
}

declare module "@material-ui/core/styles/spacing" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/styles/themeListener" {
  export var CHANNEL: string;
  let __default: any;
  export default __default;
}

declare module "@material-ui/core/styles/transitions" {
  export var easing: any;
  export var duration: any;
  export var formatMs: (milliseconds: number) => string;
  export var isString: (value: any) => boolean;
  export var isNumber: (value: any) => boolean;
  let __default: any;
  export default __default;
}

declare module "@material-ui/core/styles/withStyles" {
  type Options = {
    flip?: boolean;
    withTheme?: boolean;
    name?: string;
    media?: string;
    meta?: string;
    index?: number;
    link?: boolean;
    element?: HTMLStyleElement;
    generateClassName?: Function;
  };

  let __exports: (
    stylesOrCreator: any,
    options?: Options
  ) => <Props extends {}>(
    Component: ComponentType<Props>
  ) => ComponentType<Omit<Props, "classes" | "innerRef">>;
  export = __exports;
}

declare module "@material-ui/core/styles/withTheme" {
  let __exports: () => <Props extends {}>(
    Component: ComponentType<Props>
  ) => ComponentType<Props>;
  export = __exports;
}

declare module "@material-ui/core/styles/zIndex" {
  let __exports: any;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/ArrowDownward" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/ArrowDropDown" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/Cancel" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/CheckBox" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/CheckBoxOutlineBlank" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/CheckCircle" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/IndeterminateCheckBox" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/KeyboardArrowLeft" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/KeyboardArrowRight" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/RadioButtonChecked" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/svg-icons/RadioButtonUnchecked" {
  let __exports: ComponentType<any>;
  export = __exports;
}

declare module "@material-ui/core/SvgIcon" {
  let __exports: import("@material-ui/core/SvgIcon/SvgIcon");
  export = __exports;
}

declare module "@material-ui/core/SvgIcon/SvgIcon" {
  let __exports: ComponentType<{
    children: ReactNode;
    classes?: any;
    className?: string;
    titleAccess?: string;
    viewBox?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Switch" {
  let __exports: import("@material-ui/core/Switch/Switch");
  export = __exports;
}

declare module "@material-ui/core/Switch/Switch" {
  let __exports: ComponentType<{
    checked?: boolean | string;
    checkedIcon?: ReactNode;
    classes?: any;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    disableRipple?: boolean;
    icon?: ReactNode;
    inputProps?: any;
    inputRef?: Function;
    name?: string;
    onChange?: Function;
    tabIndex?: number | string;
    value?: string;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Table" {
  let __default: import("@material-ui/core/Table/Table");
  export default __default;
}

declare module "@material-ui/core/TableBody" {
  let __default: import("@material-ui/core/TableBody/TableBody");
  export default __default;
}

declare module "@material-ui/core/TableCell" {
  let __default: import("@material-ui/core/TableCell/TableCell");
  export default __default;
}

declare module "@material-ui/core/TableFooter" {
  let __default: import("@material-ui/core/TableFooter/TableFooter");
  export default __default;
}

declare module "@material-ui/core/TableHead" {
  let __default: import("@material-ui/core/TableHead/TableHead");
  export default __default;
}

declare module "@material-ui/core/TablePagination" {
  let __default: import("@material-ui/core/TablePagination/TablePagination");
  export default __default;
}

declare module "@material-ui/core/TableRow" {
  let __default: import("@material-ui/core/TableRow/TableRow");
  export default __default;
}

declare module "@material-ui/core/TableSortLabel" {
  let __default: import("@material-ui/core/TableSortLabel/TableSortLabel");
  export default __default;
}

declare module "@material-ui/core/Table/Table" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TableBody/TableBody" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TableCell/TableCell" {
  type Padding = "default" | "checkbox" | "dense" | "none";

  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    numeric?: boolean;
    padding?: Padding;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TableFooter/TableFooter" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TableHead/TableHead" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TablePagination/TablePagination" {
  type LabelDisplayedRowsArgs = {
    from: number;
    to: number;
    count: number;
    page: number;
  };

  type LabelDisplayedRows = (paginationInfo: LabelDisplayedRowsArgs) => Node;

  let __exports: ComponentType<{
    classes?: any;
    component?: ElementType;
    colSpan?: number;
    count: number;
    labelDisplayedRows?: LabelDisplayedRows;
    labelRowsPerPage?: ReactNode;
    onChangePage: (event: ChangeEvent<any> | null, page: number) => void;
    onChangeRowsPerPage: (event: ChangeEvent<any>) => void;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions?: Array<number>;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TableRow/TableRow" {
  let __exports: ComponentType<{
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    hover?: boolean;
    selected?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TableSortLabel/TableSortLabel" {
  type Direction = "asc" | "desc";

  let __exports: ComponentType<{
    active?: boolean;
    children?: ReactNode;
    classes?: any;
    className?: string;
    direction?: Direction;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Tabs" {
  let __default: import("@material-ui/core/Tabs/Tabs");
  export default __default;
}

declare module "@material-ui/core/Tab" {
  let __default: import("@material-ui/core/Tab/Tab");
  export default __default;
}

declare module "@material-ui/core/Tab/Tab" {
  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: string | ReactElement<any>;
    indicator?: string | ReactElement<any>;
    label?: string | ReactElement<any>;
    onChange?: (event: SyntheticEvent<any>, value: any) => void;
    onClick?: (event: SyntheticEvent<any>) => void;
    selected?: boolean;
    style?: any;
    textColor?: "accent" | "primary" | "inherit" | string;
    value?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Tabs/TabIndicator" {
  type IndicatorStyle = {
    left: number;
    width: number;
  };

  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    color: "accent" | "primary" | string;
    style: IndicatorStyle;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Tabs/Tabs" {
  import type { IndicatorStyle } from "@material-ui/core/Tabs/TabIndicator";

  type IndicatorColor = "accent" | "primary" | string;
  type ScrollButtons = "auto" | "on" | "off";
  type TextColor = "accent" | "primary" | "inherit";

  let __exports: ComponentType<{
    buttonClassName?: string;
    centered?: boolean;
    children?: ReactNode;
    classes?: any;
    className?: string;
    fullWidth?: boolean;
    indicatorClassName?: string;
    indicatorColor?: IndicatorColor;
    onChange?: (event: SyntheticEvent<any>, value: any) => void;
    scrollable?: boolean;
    scrollButtons?: ScrollButtons;
    TabScrollButton?: ComponentType<any>;
    textColor?: TextColor;
    value: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Tabs/TabScrollButton" {
  let __exports: ComponentType<{
    classes?: any;
    className?: string;
    direction: "left" | "right";
    onClick?: Function;
    visible?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/TextField" {
  let __exports: import("@material-ui/core/TextField/TextField");
  export = __exports;
}

declare module "@material-ui/core/TextField/TextField" {
  let __exports: ComponentType<{
    autoComplete?: string;
    autoFocus?: boolean;
    children?: ReactNode;
    className?: string;
    defaultValue?: string;
    disabled?: boolean;
    error?: boolean;
    FormHelperTextProps?: any;
    fullWidth?: boolean;
    helperText?: ReactNode;
    helperTextClassName?: string;
    id?: string;
    InputLabelProps?: any;
    InputProps?: any;
    inputRef?: Function;
    label?: ReactNode;
    labelClassName?: string;
    multiline?: boolean;
    name?: string;
    onChange?: (event: ChangeEvent<any>) => void;
    placeholder?: string;
    required?: boolean;
    rootRef?: Function;
    rows?: string | number;
    rowsMax?: string | number;
    select?: boolean;
    SelectProps?: any;
    type?: string;
    value?: string | number;
    margin?: "none" | "dense" | "normal";
  }>;

  export = __exports;
}

declare module "@material-ui/core/Toolbar" {
  let __exports: import("@material-ui/core/Toolbar/Toolbar");
  export = __exports;
}

declare module "@material-ui/core/Toolbar/Toolbar" {
  let __exports: ComponentType<{
    classes?: any;
    children?: ReactNode;
    className?: string;
    disableGutters?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Tooltip" {
  let __exports: import("@material-ui/core/Tooltip/Tooltip");
  export = __exports;
}

declare module "@material-ui/core/Tooltip/Tooltip" {
  type Placement =
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";

  let __exports: ComponentType<{
    children: ReactElement<any>;
    classes?: any;
    className?: string;
    disableTriggerFocus?: boolean;
    disableTriggerHover?: boolean;
    disableTriggerTouch?: boolean;
    id?: string;
    onClose?: Function;
    onRequestOpen?: Function;
    open?: boolean;
    title: ReactNode;
    enterDelay?: number;
    leaveDelay?: number;
    placement?: Placement;
    PopperProps?: any;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Collapse/Collapse" {
  import type { TransitionCallback } from "@material-ui/core/internal/transition";

  type TransitionDuration =
    | number
    | {
        enter?: number;
        exit?: number;
      }
    | "auto";

  let __exports: ComponentType<{
    appear?: boolean;
    children: ReactNode;
    classes?: any;
    className?: String;
    component?: ElementType;
    collapsedHeight?: string;
    containerProps?: any;
    in: boolean;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    style?: any;
    timeout?: TransitionDuration;
    unmountOnExit?: boolean;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Fade/Fade" {
  import type {
    TransitionDuration,
    TransitionCallback,
  } from "@material-ui/core/internal/transition";

  let __exports: ComponentType<{
    appear?: boolean;
    children: ReactElement<any>;
    in: boolean;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onExit?: TransitionCallback;
    style?: any;
    timeout?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Zoom/Zoom" {
  import type {
    TransitionDuration,
    TransitionCallback,
  } from "@material-ui/core/internal/transition";

  let __exports: ComponentType<{
    children: ReactElement<any>;
    in: boolean;
    onEnter?: TransitionCallback;
    onExit?: TransitionCallback;
    style?: any;
    timeout?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Grow/Grow" {
  import type {
    TransitionCallback,
    TransitionClasses,
  } from "@material-ui/core/internal/transition";

  type TransitionDuration =
    | number
    | {
        enter?: number;
        exit?: number;
      }
    | "auto";

  let __exports: ComponentType<{
    appear?: boolean;
    children: ReactElement<any>;
    in: boolean;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    onExited?: TransitionCallback;
    rootRef?: Function;
    style?: any;
    transitionClasses?: TransitionClasses;
    timeout?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Collapse" {
  let __default: import("@material-ui/core/Collapse/Collapse");
  export default __default;
}

declare module "@material-ui/core/Fade" {
  let __default: import("@material-ui/core/Fade/Fade");
  export default __default;
}

declare module "@material-ui/core/Grow" {
  let __default: import("@material-ui/core/Grow/Grow");
  export default __default;
}

declare module "@material-ui/core/Slide" {
  let __default: import("@material-ui/core/Slide/Slide");
  export default __default;
}

declare module "@material-ui/core/Zoom" {
  let __default: import("@material-ui/core/Zoom/Zoom");
  export default __default;
}

declare module "@material-ui/core/Slide/Slide" {
  import type {
    TransitionDuration,
    TransitionCallback,
  } from "@material-ui/core/internal/transition";

  type Direction = "left" | "right" | "up" | "down";
  function setTranslateValue(props: any, node: HTMLElement | any): void;

  let __exports: ComponentType<{
    children: ReactElement<any>;
    direction: Direction;
    in: boolean;
    onEnter?: TransitionCallback;
    onEntering?: TransitionCallback;
    onEntered?: TransitionCallback;
    onExit?: TransitionCallback;
    onExiting?: TransitionCallback;
    onExited?: TransitionCallback;
    style?: any;
    timeout?: TransitionDuration;
  }>;

  export = __exports;
}

declare module "@material-ui/core/Typography" {
  let __exports: import("@material-ui/core/Typography/Typography");
  export = __exports;
}

declare module "@material-ui/core/Typography/Typography" {
  type Align = "inherit" | "left" | "center" | "right" | "justify";
  type Color =
    | "inherit"
    | "primary"
    | "secondary"
    | "textSecondary"
    | "error"
    | "default";
  type Variant =
    | "display4"
    | "display3"
    | "display2"
    | "display1"
    | "headline"
    | "title"
    | "subheading"
    | "body2"
    | "body1"
    | "caption"
    | "button";

  let __exports: ComponentType<{
    align?: Align;
    children?: ReactNode;
    classes?: any;
    className?: string;
    component?: ElementType;
    color?: Color;
    gutterBottom?: boolean;
    headlineMapping?: {
      [key in Variant]: string;
    };
    noWrap?: boolean;
    paragraph?: boolean;
    variant?: Variant;
  }>;

  export = __exports;
}

declare module "@material-ui/core/utils/addEventListener" {
  let __exports: (
    node: ReactNode,
    event: string,
    handler: EventHandler,
    capture?: boolean
  ) => any;
  export = __exports;
}

declare module "@material-ui/core/ClickAwayListener/ClickAwayListener" {
  let __exports: ComponentType<{
    children: ReactNode;
    onClickAway: (event: Event) => void;
  }>;

  export = __exports;
}

declare module "@material-ui/core/ClickAwayListener" {
  let __exports: import("@material-ui/core/ClickAwayListener/ClickAwayListener");
  export = __exports;
}

declare module "@material-ui/core/utils/exactProp" {
  let __exports: (propTypes: any, componentNameInError: string) => any;
  export = __exports;
}

declare module "@material-ui/core/utils/helpers" {
  let __exports: {
    capitalizeFirstLetter: Function;
    contains: (obj: any, pred: any) => any;
    findIndex: (arr: Array<any>, pred: any) => any;
    find: (arr: Array<any>, pred: any) => any;
    createChainedFunction: (...funcs: Array<any>) => any;
  };

  export = __exports;
}

declare module "@material-ui/core/utils/keyboardFocus" {
  let __exports: {
    focusKeyPressed: Function;
    detectKeyboardFocus: Function;
    listenForFocusKeys: Function;
  };

  export = __exports;
}

declare module "@material-ui/core/utils/manageAriaHidden" {
  let __exports: {
    ariaHidden: Function;
    hideSiblings: Function;
    showSiblings: Function;
  };

  export = __exports;
}

declare module "@material-ui/core/utils/reactHelpers" {
  let __exports: {
    cloneChildrenWithClassName: (
      children?: ReactNode,
      className: string
    ) => any;
    isMuiElement: (element: any, muiNames: Array<string>) => any;
    isMuiComponent: (element: any, muiNames: Array<string>) => any;
  };

  export = __exports;
}

declare module "@material-ui/core/utils/requirePropFactory" {
  let __exports: (componentNameInError: string) => any;
  export = __exports;
}

declare module "@material-ui/core/withWidth/withWidth" {
  import type { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

  let __exports: (options?: {
    withTheme?: boolean;
    noSSR?: boolean;
    initialWidth?: Breakpoint;
    resizeInterval?: number;
  }) => <
    Props extends {
      width: Breakpoint;
    }
  >(
    Component: ComponentType<Props>
  ) => ComponentType<Omit<Props, "width">>;

  export = __exports;
}

declare module "@material-ui/core/colors" {
  export var common: import("@material-ui/core/colors/common");
  export var red: import("@material-ui/core/colors/red");
  export var pink: import("@material-ui/core/colors/pink");
  export var purple: import("@material-ui/core/colors/purple");
  export var deepPurple: import("@material-ui/core/colors/deepPurple");
  export var indigo: import("@material-ui/core/colors/indigo");
  export var blue: import("@material-ui/core/colors/blue");
  export var lightBlue: import("@material-ui/core/colors/lightBlue");
  export var cyan: import("@material-ui/core/colors/cyan");
  export var teal: import("@material-ui/core/colors/teal");
  export var green: import("@material-ui/core/colors/green");
  export var lightGreen: import("@material-ui/core/colors/lightGreen");
  export var lime: import("@material-ui/core/colors/lime");
  export var yellow: import("@material-ui/core/colors/yellow");
  export var amber: import("@material-ui/core/colors/amber");
  export var orange: import("@material-ui/core/colors/orange");
  export var deepOrange: import("@material-ui/core/colors/deepOrange");
  export var brown: import("@material-ui/core/colors/brown");
  export var grey: import("@material-ui/core/colors/grey");
  export var blueGrey: import("@material-ui/core/colors/blueGrey");
}

// Filename aliases
declare module "@material-ui/core/AppBar/AppBar.js" {
  let __exports: import("@material-ui/core/AppBar/AppBar");
  export = __exports;
}

declare module "@material-ui/core/AppBar/index.js" {
  let __exports: import("@material-ui/core/AppBar");
  export = __exports;
}

declare module "@material-ui/core/Avatar/Avatar.js" {
  let __exports: import("@material-ui/core/Avatar/Avatar");
  export = __exports;
}

declare module "@material-ui/core/Avatar/index.js" {
  let __exports: import("@material-ui/core/Avatar");
  export = __exports;
}

declare module "@material-ui/core/Badge/Badge.js" {
  let __exports: import("@material-ui/core/Badge/Badge");
  export = __exports;
}

declare module "@material-ui/core/Badge/index.js" {
  let __exports: import("@material-ui/core/Badge");
  export = __exports;
}

declare module "@material-ui/core/BottomNavigation/BottomNavigation.js" {
  let __exports: import("@material-ui/core/BottomNavigation/BottomNavigation");
  export = __exports;
}

declare module "@material-ui/core/BottomNavigation/index.js" {
  let __exports: import("@material-ui/core/BottomNavigation");
  export = __exports;
}

declare module "@material-ui/core/BottomNavigationAction/BottomNavigationAction.js" {
  let __exports: import("@material-ui/core/BottomNavigationAction/BottomNavigationAction");
  export = __exports;
}

declare module "@material-ui/core/BottomNavigationAction/index.js" {
  let __exports: import("@material-ui/core/BottomNavigation");
  export = __exports;
}

declare module "@material-ui/core/Button/Button.js" {
  let __exports: import("@material-ui/core/Button/Button");
  export = __exports;
}

declare module "@material-ui/core/Button/index.js" {
  let __exports: import("@material-ui/core/Button");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/ButtonBase.js" {
  let __exports: import("@material-ui/core/ButtonBase/ButtonBase");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/createRippleHandler.js" {
  let __exports: import("@material-ui/core/ButtonBase/createRippleHandler");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/index.js" {
  let __exports: import("@material-ui/core/ButtonBase");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/Ripple.js" {
  let __exports: import("@material-ui/core/ButtonBase/Ripple");
  export = __exports;
}

declare module "@material-ui/core/ButtonBase/TouchRipple.js" {
  let __exports: import("@material-ui/core/ButtonBase/TouchRipple");
  export = __exports;
}

declare module "@material-ui/core/Card/Card.js" {
  let __exports: import("@material-ui/core/Card/Card");
  export = __exports;
}

declare module "@material-ui/core/Card/index.js" {
  let __exports: import("@material-ui/core/Card");
  export = __exports;
}

declare module "@material-ui/core/CardActions/CardActions.js" {
  let __exports: import("@material-ui/core/CardActions/CardActions");
  export = __exports;
}

declare module "@material-ui/core/CardActions/index.js" {
  let __exports: import("@material-ui/core/CardActions");
  export = __exports;
}

declare module "@material-ui/core/CardContent/CardContent.js" {
  let __exports: import("@material-ui/core/CardContent/CardContent");
  export = __exports;
}

declare module "@material-ui/core/CardContent/index.js" {
  let __exports: import("@material-ui/core/CardContent");
  export = __exports;
}

declare module "@material-ui/core/CardHeader/CardHeader.js" {
  let __exports: import("@material-ui/core/CardHeader/CardHeader");
  export = __exports;
}

declare module "@material-ui/core/CardHeader/index.js" {
  let __exports: import("@material-ui/core/CardHeader");
  export = __exports;
}

declare module "@material-ui/core/CardMedia/CardMedia.js" {
  let __exports: import("@material-ui/core/CardMedia/CardMedia");
  export = __exports;
}

declare module "@material-ui/core/CardMedia/index.js" {
  let __exports: import("@material-ui/core/CardMedia");
  export = __exports;
}

declare module "@material-ui/core/Checkbox/Checkbox.js" {
  let __exports: import("@material-ui/core/Checkbox/Checkbox");
  export = __exports;
}

declare module "@material-ui/core/Checkbox/index.js" {
  let __exports: import("@material-ui/core/Checkbox");
  export = __exports;
}

declare module "@material-ui/core/Chip/Chip.js" {
  let __exports: import("@material-ui/core/Chip/Chip");
  export = __exports;
}

declare module "@material-ui/core/Chip/index.js" {
  let __exports: import("@material-ui/core/Chip");
  export = __exports;
}

declare module "@material-ui/core/colors/amber.js" {
  let __exports: import("@material-ui/core/colors/amber");
  export = __exports;
}

declare module "@material-ui/core/colors/blue.js" {
  let __exports: import("@material-ui/core/colors/blue");
  export = __exports;
}

declare module "@material-ui/core/colors/blueGrey.js" {
  let __exports: import("@material-ui/core/colors/blueGrey");
  export = __exports;
}

declare module "@material-ui/core/colors/brown.js" {
  let __exports: import("@material-ui/core/colors/brown");
  export = __exports;
}

declare module "@material-ui/core/colors/common.js" {
  let __exports: import("@material-ui/core/colors/common");
  export = __exports;
}

declare module "@material-ui/core/colors/cyan.js" {
  let __exports: import("@material-ui/core/colors/cyan");
  export = __exports;
}

declare module "@material-ui/core/colors/deepOrange.js" {
  let __exports: import("@material-ui/core/colors/deepOrange");
  export = __exports;
}

declare module "@material-ui/core/colors/deepPurple.js" {
  let __exports: import("@material-ui/core/colors/deepPurple");
  export = __exports;
}

declare module "@material-ui/core/colors/green.js" {
  let __exports: import("@material-ui/core/colors/green");
  export = __exports;
}

declare module "@material-ui/core/colors/grey.js" {
  let __exports: import("@material-ui/core/colors/grey");
  export = __exports;
}

declare module "@material-ui/core/colors/index.js" {
  let __exports: import("@material-ui/core/colors");
  export = __exports;
}

declare module "@material-ui/core/colors/indigo.js" {
  let __exports: import("@material-ui/core/colors/indigo");
  export = __exports;
}

declare module "@material-ui/core/colors/lightBlue.js" {
  let __exports: import("@material-ui/core/colors/lightBlue");
  export = __exports;
}

declare module "@material-ui/core/colors/lightGreen.js" {
  let __exports: import("@material-ui/core/colors/lightGreen");
  export = __exports;
}

declare module "@material-ui/core/colors/lime.js" {
  let __exports: import("@material-ui/core/colors/lime");
  export = __exports;
}

declare module "@material-ui/core/colors/orange.js" {
  let __exports: import("@material-ui/core/colors/orange");
  export = __exports;
}

declare module "@material-ui/core/colors/pink.js" {
  let __exports: import("@material-ui/core/colors/pink");
  export = __exports;
}

declare module "@material-ui/core/colors/purple.js" {
  let __exports: import("@material-ui/core/colors/purple");
  export = __exports;
}

declare module "@material-ui/core/colors/red.js" {
  let __exports: import("@material-ui/core/colors/red");
  export = __exports;
}

declare module "@material-ui/core/colors/teal.js" {
  let __exports: import("@material-ui/core/colors/teal");
  export = __exports;
}

declare module "@material-ui/core/colors/yellow.js" {
  let __exports: import("@material-ui/core/colors/yellow");
  export = __exports;
}

declare module "@material-ui/core/Dialog/Dialog.js" {
  let __exports: import("@material-ui/core/Dialog/Dialog");
  export = __exports;
}

declare module "@material-ui/core/Dialog/index.js" {
  let __exports: import("@material-ui/core/Dialog");
  export = __exports;
}

declare module "@material-ui/core/DialogActions/DialogActions.js" {
  let __exports: import("@material-ui/core/DialogActions/DialogActions");
  export = __exports;
}

declare module "@material-ui/core/DialogActions/index.js" {
  let __exports: import("@material-ui/core/DialogActions");
  export = __exports;
}

declare module "@material-ui/core/DialogContent/DialogContent.js" {
  let __exports: import("@material-ui/core/DialogContent/DialogContent");
  export = __exports;
}

declare module "@material-ui/core/DialogContent/index.js" {
  let __exports: import("@material-ui/core/DialogContent");
  export = __exports;
}

declare module "@material-ui/core/Dialog/DialogContentText.js" {
  let __exports: import("@material-ui/core/DialogContentText/DialogContentText");
  export = __exports;
}

declare module "@material-ui/core/DialogContentText/index.js" {
  let __exports: import("@material-ui/core/DialogContentText");
  export = __exports;
}

declare module "@material-ui/core/Dialog/DialogTitle.js" {
  let __exports: import("@material-ui/core/DialogTitle/DialogTitle");
  export = __exports;
}

declare module "@material-ui/core/DialogTitle/index.js" {
  let __exports: import("@material-ui/core/DialogTitle");
  export = __exports;
}

declare module "@material-ui/core/withMobileDialog/withMobileDialog.js" {
  let __exports: import("@material-ui/core/withMobileDialog/withMobileDialog");
  export = __exports;
}

declare module "@material-ui/core/withMobileDialog/index.js" {
  let __exports: import("@material-ui/core/withMobileDialog");
  export = __exports;
}

declare module "@material-ui/core/Divider/Divider.js" {
  let __exports: import("@material-ui/core/Divider/Divider");
  export = __exports;
}

declare module "@material-ui/core/Divider/index.js" {
  let __exports: import("@material-ui/core/Divider");
  export = __exports;
}

declare module "@material-ui/core/Drawer/Drawer.js" {
  let __exports: import("@material-ui/core/Drawer/Drawer");
  export = __exports;
}

declare module "@material-ui/core/Drawer/index.js" {
  let __exports: import("@material-ui/core/Drawer");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel/ExpansionPanel.js" {
  let __exports: import("@material-ui/core/ExpansionPanel/ExpansionPanel");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel/index.js" {
  let __exports: import("@material-ui/core/ExpansionPanel");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel/ExpansionPanelActions.js" {
  let __exports: import("@material-ui/core/ExpansionPanelActions/ExpansionPanelActions");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanelActions/index.js" {
  let __exports: import("@material-ui/core/ExpansionPanelActions");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel/ExpansionPanelDetails.js" {
  let __exports: import("@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanelDetails/index.js" {
  let __exports: import("@material-ui/core/ExpansionPanelDetails");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanel/ExpansionPanelSummary.js" {
  let __exports: import("@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary");
  export = __exports;
}

declare module "@material-ui/core/ExpansionPanelSummary/index.js" {
  let __exports: import("@material-ui/core/ExpansionPanelSummary");
  export = __exports;
}

declare module "@material-ui/core/FormControl/FormControl.js" {
  let __exports: import("@material-ui/core/FormControl/FormControl");
  export = __exports;
}

declare module "@material-ui/core/FormControl/index.js" {
  let __exports: import("@material-ui/core/FormControl");
  export = __exports;
}

declare module "@material-ui/core/FormControlLabel/FormControlLabel.js" {
  let __exports: import("@material-ui/core/FormControlLabel/FormControlLabel");
  export = __exports;
}

declare module "@material-ui/core/FormControl/index.js" {
  let __exports: import("@material-ui/core/FormControl");
  export = __exports;
}

declare module "@material-ui/core/FormGroup/FormGroup.js" {
  let __exports: import("@material-ui/core/FormGroup/FormGroup");
  export = __exports;
}

declare module "@material-ui/core/FormGroup/index.js" {
  let __exports: import("@material-ui/core/FormGroup");
  export = __exports;
}

declare module "@material-ui/core/FormHelperText/FormHelperText.js" {
  let __exports: import("@material-ui/core/FormHelperText/FormHelperText");
  export = __exports;
}

declare module "@material-ui/core/FormHelperText/index.js" {
  let __exports: import("@material-ui/core/FormHelperText");
  export = __exports;
}

declare module "@material-ui/core/FormLabel/FormLabel.js" {
  let __exports: import("@material-ui/core/FormLabel/FormLabel");
  export = __exports;
}

declare module "@material-ui/core/FormLabel/index.js" {
  let __exports: import("@material-ui/core/FormLabel");
  export = __exports;
}

declare module "@material-ui/core/Grid/Grid.js" {
  let __exports: import("@material-ui/core/Grid/Grid");
  export = __exports;
}

declare module "@material-ui/core/Grid/index.js" {
  let __exports: import("@material-ui/core/Grid");
  export = __exports;
}

declare module "@material-ui/core/GridList/GridList.js" {
  let __exports: import("@material-ui/core/GridList/GridList");
  export = __exports;
}

declare module "@material-ui/core/GridList/index.js" {
  let __exports: import("@material-ui/core/GridList");
  export = __exports;
}

declare module "@material-ui/core/GridListTile/GridListTile.js" {
  let __exports: import("@material-ui/core/GridListTile/GridListTile");
  export = __exports;
}

declare module "@material-ui/core/GridListTile/index.js" {
  let __exports: import("@material-ui/core/GridListTile");
  export = __exports;
}

declare module "@material-ui/core/GridListTileBar/GridListTileBar.js" {
  let __exports: import("@material-ui/core/GridListTileBar/GridListTileBar");
  export = __exports;
}

declare module "@material-ui/core/GridListTileBar/index.js" {
  let __exports: import("@material-ui/core/GridListTileBar");
  export = __exports;
}

declare module "@material-ui/core/Hidden/Hidden.js" {
  let __exports: import("@material-ui/core/Hidden/Hidden");
  export = __exports;
}

declare module "@material-ui/core/Hidden/HiddenCss.js" {
  let __exports: import("@material-ui/core/Hidden/HiddenCss");
  export = __exports;
}

declare module "@material-ui/core/Hidden/HiddenJs.js" {
  let __exports: import("@material-ui/core/Hidden/HiddenJs");
  export = __exports;
}

declare module "@material-ui/core/Hidden/index.js" {
  let __exports: import("@material-ui/core/Hidden");
  export = __exports;
}

declare module "@material-ui/core/Hidden/types.js" {
  let __exports: import("@material-ui/core/Hidden/types");
  export = __exports;
}

declare module "@material-ui/core/Icon/Icon.js" {
  let __exports: import("@material-ui/core/Icon/Icon");
  export = __exports;
}

declare module "@material-ui/core/Icon/index.js" {
  let __exports: import("@material-ui/core/Icon");
  export = __exports;
}

declare module "@material-ui/core/IconButton/IconButton.js" {
  let __exports: import("@material-ui/core/IconButton/IconButton");
  export = __exports;
}

declare module "@material-ui/core/IconButton/index.js" {
  let __exports: import("@material-ui/core/IconButton");
  export = __exports;
}

declare module "@material-ui/core/Input/index.js" {
  let __exports: import("@material-ui/core/Input");
  export = __exports;
}

declare module "@material-ui/core/Input/Input.js" {
  let __exports: import("@material-ui/core/Input/Input");
  export = __exports;
}

declare module "@material-ui/core/InputAdornment/InputAdornment.js" {
  let __exports: import("@material-ui/core/InputAdornment/InputAdornment");
  export = __exports;
}

declare module "@material-ui/core/InputLabel/InputLabel.js" {
  let __exports: import("@material-ui/core/InputLabel/InputLabel");
  export = __exports;
}

declare module "@material-ui/core/Input/Textarea.js" {
  let __exports: import("@material-ui/core/Input/Textarea");
  export = __exports;
}

declare module "@material-ui/core/internal/dom.js" {
  let __exports: import("@material-ui/core/internal/dom");
  export = __exports;
}

declare module "@material-ui/core/Portal/Portal.js" {
  let __exports: import("@material-ui/core/Portal");
  export = __exports;
}

declare module "@material-ui/core/internal/SwitchBase.js" {
  let __exports: import("@material-ui/core/internal/SwitchBase");
  export = __exports;
}

declare module "@material-ui/core/internal/transition.js" {
  let __exports: import("@material-ui/core/internal/transition");
  export = __exports;
}

declare module "@material-ui/core/List/index.js" {
  let __exports: import("@material-ui/core/List");
  export = __exports;
}

declare module "@material-ui/core/List/List.js" {
  let __exports: import("@material-ui/core/List/List");
  export = __exports;
}

declare module "@material-ui/core/ListItem/ListItem.js" {
  let __exports: import("@material-ui/core/ListItem/ListItem");
  export = __exports;
}

declare module "@material-ui/core/ListItem/index.js" {
  let __exports: import("@material-ui/core/ListItem");
  export = __exports;
}

declare module "@material-ui/core/ListItemAvatar/ListItemAvatar.js" {
  let __exports: import("@material-ui/core/ListItemAvatar/ListItemAvatar");
  export = __exports;
}

declare module "@material-ui/core/ListItemAvatar/index.js" {
  let __exports: import("@material-ui/core/ListItemAvatar");
  export = __exports;
}

declare module "@material-ui/core/ListItemIcon/ListItemIcon.js" {
  let __exports: import("@material-ui/core/ListItemIcon/ListItemIcon");
  export = __exports;
}

declare module "@material-ui/core/ListItemIcon/index.js" {
  let __exports: import("@material-ui/core/ListItemIcon");
  export = __exports;
}

declare module "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction.js" {
  let __exports: import("@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction");
  export = __exports;
}

declare module "@material-ui/core/ListItemSecondaryAction/index.js" {
  let __exports: import("@material-ui/core/ListItemSecondaryAction");
  export = __exports;
}

declare module "@material-ui/core/ListItemText/ListItemText.js" {
  let __exports: import("@material-ui/core/ListItemText/ListItemText");
  export = __exports;
}

declare module "@material-ui/core/ListItemText/index.js" {
  let __exports: import("@material-ui/core/ListItemText");
  export = __exports;
}

declare module "@material-ui/core/ListSubheader/ListSubheader.js" {
  let __exports: import("@material-ui/core/ListSubheader/ListSubheader");
  export = __exports;
}

declare module "@material-ui/core/ListSubheader/index.js" {
  let __exports: import("@material-ui/core/ListSubheader");
  export = __exports;
}

declare module "@material-ui/core/Menu/index.js" {
  let __exports: import("@material-ui/core/Menu");
  export = __exports;
}

declare module "@material-ui/core/Menu/Menu.js" {
  let __exports: import("@material-ui/core/Menu/Menu");
  export = __exports;
}

declare module "@material-ui/core/MenuItem/index.js" {
  let __exports: import("@material-ui/core/MenuItem");
  export = __exports;
}

declare module "@material-ui/core/MenuItem/MenuItem.js" {
  let __exports: import("@material-ui/core/MenuItem/MenuItem");
  export = __exports;
}

declare module "@material-ui/core/MenuList/index.js" {
  let __exports: import("@material-ui/core/MenuList");
  export = __exports;
}

declare module "@material-ui/core/MenuList/MenuList.js" {
  let __exports: import("@material-ui/core/MenuList/MenuList");
  export = __exports;
}

declare module "@material-ui/core/MobileStepper/index.js" {
  let __exports: import("@material-ui/core/MobileStepper");
  export = __exports;
}

declare module "@material-ui/core/MobileStepper/MobileStepper.js" {
  let __exports: import("@material-ui/core/MobileStepper/MobileStepper");
  export = __exports;
}

declare module "@material-ui/core/Backdrop/Backdrop.js" {
  let __exports: import("@material-ui/core/Backdrop/Backdrop");
  export = __exports;
}

declare module "@material-ui/core/Backdrop/index.js" {
  let __exports: import("@material-ui/core/Backdrop");
  export = __exports;
}

declare module "@material-ui/core/Modal/index.js" {
  let __exports: import("@material-ui/core/Modal");
  export = __exports;
}

declare module "@material-ui/core/Modal/Modal.js" {
  let __exports: import("@material-ui/core/Modal/Modal");
  export = __exports;
}

declare module "@material-ui/core/Modal/ModalManager.js" {
  let __exports: import("@material-ui/core/Modal/ModalManager");
  export = __exports;
}

declare module "@material-ui/core/NativeSelect/index.js" {
  let __exports: import("@material-ui/core/NativeSelect");
  export = __exports;
}

declare module "@material-ui/core/NativeSelect/NativeSelect.js" {
  let __exports: import("@material-ui/core/NativeSelect/NativeSelect");
  export = __exports;
}

declare module "@material-ui/core/Paper/index.js" {
  let __exports: import("@material-ui/core/Paper");
  export = __exports;
}

declare module "@material-ui/core/Paper/Paper.js" {
  let __exports: import("@material-ui/core/Paper/Paper");
  export = __exports;
}

declare module "@material-ui/core/Popover/index.js" {
  let __exports: import("@material-ui/core/Popover");
  export = __exports;
}

declare module "@material-ui/core/Popover/Popover.js" {
  let __exports: import("@material-ui/core/Popover/Popover");
  export = __exports;
}

declare module "@material-ui/core/CircularProgress/CircularProgress.js" {
  let __exports: import("@material-ui/core/CircularProgress/CircularProgress");
  export = __exports;
}

declare module "@material-ui/core/CircularProgress/index.js" {
  let __exports: import("@material-ui/core/CircularProgress");
  export = __exports;
}

declare module "@material-ui/core/LinearProgress/LinearProgress.js" {
  let __exports: import("@material-ui/core/LinearProgress/LinearProgress");
  export = __exports;
}

declare module "@material-ui/core/LinearProgress/index.js" {
  let __exports: import("@material-ui/core/LinearProgress");
  export = __exports;
}

declare module "@material-ui/core/Radio/index.js" {
  let __exports: import("@material-ui/core/Radio");
  export = __exports;
}

declare module "@material-ui/core/Radio/Radio.js" {
  let __exports: import("@material-ui/core/Radio/Radio");
  export = __exports;
}

declare module "@material-ui/core/RadioGroup/RadioGroup.js" {
  let __exports: import("@material-ui/core/RadioGroup/RadioGroup");
  export = __exports;
}

declare module "@material-ui/core/RadioGroup/index.js" {
  let __exports: import("@material-ui/core/RadioGroup");
  export = __exports;
}

declare module "@material-ui/core/Select/index.js" {
  let __exports: import("@material-ui/core/Select");
  export = __exports;
}

declare module "@material-ui/core/Select/Select.js" {
  let __exports: import("@material-ui/core/Select/Select");
  export = __exports;
}

declare module "@material-ui/core/Select/SelectInput.js" {
  let __exports: import("@material-ui/core/Select/SelectInput");
  export = __exports;
}

declare module "@material-ui/core/Snackbar/index.js" {
  let __exports: import("@material-ui/core/Snackbar");
  export = __exports;
}

declare module "@material-ui/core/Snackbar/Snackbar.js" {
  let __exports: import("@material-ui/core/Snackbar/Snackbar");
  export = __exports;
}

declare module "@material-ui/core/SnackbarContent/index.js" {
  let __exports: import("@material-ui/core/SnackbarContent");
  export = __exports;
}

declare module "@material-ui/core/SnackbarContent/SnackbarContent.js" {
  let __exports: import("@material-ui/core/SnackbarContent/SnackbarContent");
  export = __exports;
}

declare module "@material-ui/core/Step/Step.js" {
  let __exports: import("@material-ui/core/Step/Step");
  export = __exports;
}

declare module "@material-ui/core/Step/index.js" {
  let __exports: import("@material-ui/core/Step");
  export = __exports;
}

declare module "@material-ui/core/StepButton/StepButton.js" {
  let __exports: import("@material-ui/core/StepButton/StepButton");
  export = __exports;
}

declare module "@material-ui/core/StepButton/index.js" {
  let __exports: import("@material-ui/core/StepButton");
  export = __exports;
}

declare module "@material-ui/core/StepConnector/StepConnector.js" {
  let __exports: import("@material-ui/core/StepConnector/StepConnector");
  export = __exports;
}

declare module "@material-ui/core/StepConnector/index.js" {
  let __exports: import("@material-ui/core/StepConnector/StepConnector");
  export = __exports;
}

declare module "@material-ui/core/StepContent/StepContent.js" {
  let __exports: import("@material-ui/core/StepContent/StepContent");
  export = __exports;
}

declare module "@material-ui/core/StepContent/index.js" {
  let __exports: import("@material-ui/core/StepContent");
  export = __exports;
}

declare module "@material-ui/core/StepIcon/StepIcon.js" {
  let __exports: import("@material-ui/core/StepIcon/StepIcon");
  export = __exports;
}

declare module "@material-ui/core/StepIcon/index.js" {
  let __exports: import("@material-ui/core/StepIcon");
  export = __exports;
}

declare module "@material-ui/core/StepLabel/StepLabel.js" {
  let __exports: import("@material-ui/core/StepLabel/StepLabel");
  export = __exports;
}

declare module "@material-ui/core/StepLabel/index.js" {
  let __exports: import("@material-ui/core/StepLabel");
  export = __exports;
}

declare module "@material-ui/core/Stepper/Stepper.js" {
  let __exports: import("@material-ui/core/Stepper/Stepper");
  export = __exports;
}

declare module "@material-ui/core/Stepper/index.js" {
  let __exports: import("@material-ui/core/Stepper");
  export = __exports;
}

declare module "@material-ui/core/StepIcion/StepPositionIcon.js" {
  let __exports: import("@material-ui/core/StepIcion/StepPositionIcon");
  export = __exports;
}

declare module "@material-ui/core/styles/colorManipulator.js" {
  let __exports: import("@material-ui/core/styles/colorManipulator");
  export = __exports;
}

declare module "@material-ui/core/styles/createBreakpoints.js" {
  let __exports: import("@material-ui/core/styles/createBreakpoints");
  export = __exports;
}

declare module "@material-ui/core/styles/createGenerateClassName.js" {
  let __exports: import("@material-ui/core/styles/createGenerateClassName");
  export = __exports;
}

declare module "@material-ui/core/styles/createMixins.js" {
  let __exports: import("@material-ui/core/styles/createMixins");
  export = __exports;
}

declare module "@material-ui/core/styles/createMuiTheme.js" {
  let __exports: import("@material-ui/core/styles/createMuiTheme");
  export = __exports;
}

declare module "@material-ui/core/styles/createPalette.js" {
  let __exports: import("@material-ui/core/styles/createPalette");
  export = __exports;
}

declare module "@material-ui/core/styles/createTypography.js" {
  let __exports: import("@material-ui/core/styles/createTypography");
  export = __exports;
}

declare module "@material-ui/core/styles/getStylesCreator.js" {
  let __exports: import("@material-ui/core/styles/getStylesCreator");
  export = __exports;
}

declare module "@material-ui/core/styles/index.js" {
  let __exports: import("@material-ui/core/styles");
  export = __exports;
}

declare module "@material-ui/core/styles/MuiThemeProvider.js" {
  let __exports: import("@material-ui/core/styles/MuiThemeProvider");
  export = __exports;
}

declare module "@material-ui/core/styles/shadows.js" {
  let __exports: import("@material-ui/core/styles/shadows");
  export = __exports;
}

declare module "@material-ui/core/styles/spacing.js" {
  let __exports: import("@material-ui/core/styles/spacing");
  export = __exports;
}

declare module "@material-ui/core/styles/themeListener.js" {
  let __exports: import("@material-ui/core/styles/themeListener");
  export = __exports;
}

declare module "@material-ui/core/styles/transitions.js" {
  let __exports: import("@material-ui/core/styles/transitions");
  export = __exports;
}

declare module "@material-ui/core/styles/withStyles.js" {
  let __exports: import("@material-ui/core/styles/withStyles");
  export = __exports;
}

declare module "@material-ui/core/styles/withTheme.js" {
  let __exports: import("@material-ui/core/styles/withTheme");
  export = __exports;
}

declare module "@material-ui/core/styles/zIndex.js" {
  let __exports: import("@material-ui/core/styles/zIndex");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/ArrowDownward.js" {
  let __exports: import("@material-ui/core/svg-icons/ArrowDownward");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/ArrowDropDown.js" {
  let __exports: import("@material-ui/core/svg-icons/ArrowDropDown");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/Cancel.js" {
  let __exports: import("@material-ui/core/svg-icons/Cancel");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/CheckBox.js" {
  let __exports: import("@material-ui/core/svg-icons/CheckBox");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/CheckBoxOutlineBlank.js" {
  let __exports: import("@material-ui/core/svg-icons/CheckBoxOutlineBlank");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/CheckCircle.js" {
  let __exports: import("@material-ui/core/svg-icons/CheckCircle");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/IndeterminateCheckBox.js" {
  let __exports: import("@material-ui/core/svg-icons/IndeterminateCheckBox");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/KeyboardArrowLeft.js" {
  let __exports: import("@material-ui/core/svg-icons/KeyboardArrowLeft");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/KeyboardArrowRight.js" {
  let __exports: import("@material-ui/core/svg-icons/KeyboardArrowRight");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/RadioButtonChecked.js" {
  let __exports: import("@material-ui/core/svg-icons/RadioButtonChecked");
  export = __exports;
}

declare module "@material-ui/core/svg-icons/RadioButtonUnchecked.js" {
  let __exports: import("@material-ui/core/svg-icons/RadioButtonUnchecked");
  export = __exports;
}

declare module "@material-ui/core/SvgIcon/index.js" {
  let __exports: import("@material-ui/core/SvgIcon");
  export = __exports;
}

declare module "@material-ui/core/SvgIcon/SvgIcon.js" {
  let __exports: import("@material-ui/core/SvgIcon/SvgIcon");
  export = __exports;
}

declare module "@material-ui/core/Switch/index.js" {
  let __exports: import("@material-ui/core/Switch");
  export = __exports;
}

declare module "@material-ui/core/Switch/Switch.js" {
  let __exports: import("@material-ui/core/Switch/Switch");
  export = __exports;
}

declare module "@material-ui/core/Table/index.js" {
  let __exports: import("@material-ui/core/Table");
  export = __exports;
}

declare module "@material-ui/core/Table/Table.js" {
  let __exports: import("@material-ui/core/Table/Table");
  export = __exports;
}

declare module "@material-ui/core/TableBody/index.js" {
  let __exports: import("@material-ui/core/TableBody");
  export = __exports;
}

declare module "@material-ui/core/TableBody/TableBody.js" {
  let __exports: import("@material-ui/core/TableBody/TableBody");
  export = __exports;
}

declare module "@material-ui/core/TableCell/index.js" {
  let __exports: import("@material-ui/core/TableCell");
  export = __exports;
}

declare module "@material-ui/core/TableCell/TableCell.js" {
  let __exports: import("@material-ui/core/TableCell/TableCell");
  export = __exports;
}

declare module "@material-ui/core/TableFooter/index.js" {
  let __exports: import("@material-ui/core/TableFooter");
  export = __exports;
}

declare module "@material-ui/core/TableFooter/TableFooter.js" {
  let __exports: import("@material-ui/core/TableFooter/TableFooter");
  export = __exports;
}

declare module "@material-ui/core/TableHead/index.js" {
  let __exports: import("@material-ui/core/TableHead");
  export = __exports;
}

declare module "@material-ui/core/TableHead/TableHead.js" {
  let __exports: import("@material-ui/core/TableHead/TableHead");
  export = __exports;
}

declare module "@material-ui/core/TablePagination/index.js" {
  let __exports: import("@material-ui/core/TablePagination");
  export = __exports;
}

declare module "@material-ui/core/TablePagination/TablePagination.js" {
  let __exports: import("@material-ui/core/TablePagination/TablePagination");
  export = __exports;
}

declare module "@material-ui/core/TableRow/index.js" {
  let __exports: import("@material-ui/core/TableRow");
  export = __exports;
}

declare module "@material-ui/core/TableRow/TableRow.js" {
  let __exports: import("@material-ui/core/TableRow/TableRow");
  export = __exports;
}

declare module "@material-ui/core/TableSortLabel/index.js" {
  let __exports: import("@material-ui/core/TableSortLabel");
  export = __exports;
}

declare module "@material-ui/core/Table/TableSortLabel.js" {
  let __exports: import("@material-ui/core/TableSortLabel/TableSortLabel");
  export = __exports;
}

declare module "@material-ui/core/Tab/index.js" {
  let __exports: import("@material-ui/core/Tab");
  export = __exports;
}

declare module "@material-ui/core/Tab/Tab.js" {
  let __exports: import("@material-ui/core/Tab/Tab");
  export = __exports;
}

declare module "@material-ui/core/Tabs/TabIndicator.js" {
  let __exports: import("@material-ui/core/Tabs/TabIndicator");
  export = __exports;
}

declare module "@material-ui/core/Tabs/Tabs.js" {
  let __exports: import("@material-ui/core/Tabs/Tabs");
  export = __exports;
}

declare module "@material-ui/core/Tabs/index.js" {
  let __exports: import("@material-ui/core/Tabs");
  export = __exports;
}

declare module "@material-ui/core/Tabs/TabScrollButton.js" {
  let __exports: import("@material-ui/core/Tabs/TabScrollButton");
  export = __exports;
}

declare module "@material-ui/core/TextField/index.js" {
  let __exports: import("@material-ui/core/TextField");
  export = __exports;
}

declare module "@material-ui/core/TextField/TextField.js" {
  let __exports: import("@material-ui/core/TextField/TextField");
  export = __exports;
}

declare module "@material-ui/core/Toolbar/index.js" {
  let __exports: import("@material-ui/core/Toolbar");
  export = __exports;
}

declare module "@material-ui/core/Toolbar/Toolbar.js" {
  let __exports: import("@material-ui/core/Toolbar/Toolbar");
  export = __exports;
}

declare module "@material-ui/core/Tooltip/index.js" {
  let __exports: import("@material-ui/core/Tooltip");
  export = __exports;
}

declare module "@material-ui/core/Tooltip/Tooltip.js" {
  let __exports: import("@material-ui/core/Tooltip/Tooltip");
  export = __exports;
}

declare module "@material-ui/core/Collapse/index.js" {
  let __exports: import("@material-ui/core/Collapse");
  export = __exports;
}

declare module "@material-ui/core/Collapse/Collapse.js" {
  let __exports: import("@material-ui/core/Collapse/Collapse");
  export = __exports;
}

declare module "@material-ui/core/Fade/index.js" {
  let __exports: import("@material-ui/core/Fade");
  export = __exports;
}

declare module "@material-ui/core/Fade/Fade.js" {
  let __exports: import("@material-ui/core/Fade/Fade");
  export = __exports;
}

declare module "@material-ui/core/Grow/index.js" {
  let __exports: import("@material-ui/core/Grow");
  export = __exports;
}

declare module "@material-ui/core/Grow/Grow.js" {
  let __exports: import("@material-ui/core/Grow/Grow");
  export = __exports;
}

declare module "@material-ui/core/Slide/index.js" {
  let __exports: import("@material-ui/core/Slide");
  export = __exports;
}

declare module "@material-ui/core/Slide/Slide.js" {
  let __exports: import("@material-ui/core/Slide/Slide");
  export = __exports;
}

declare module "@material-ui/core/Typography/index.js" {
  let __exports: import("@material-ui/core/Typography");
  export = __exports;
}

declare module "@material-ui/core/Typography/Typography.js" {
  let __exports: import("@material-ui/core/Typography/Typography");
  export = __exports;
}

declare module "@material-ui/core/utils/addEventListener.js" {
  let __exports: import("@material-ui/core/utils/addEventListener");
  export = __exports;
}

declare module "@material-ui/core/ClickAwayListener/index.js" {
  let __exports: import("@material-ui/core/ClickAwayListener");
  export = __exports;
}

declare module "@material-ui/core/ClickAwayListener/ClickAwayListener.js" {
  let __exports: import("@material-ui/core/ClickAwayListener/ClickAwayListener");
  export = __exports;
}

declare module "@material-ui/core/utils/exactProp.js" {
  let __exports: import("@material-ui/core/utils/exactProp");
  export = __exports;
}

declare module "@material-ui/core/utils/helpers.js" {
  let __exports: import("@material-ui/core/utils/helpers");
  export = __exports;
}

declare module "@material-ui/core/utils/keyboardFocus.js" {
  let __exports: import("@material-ui/core/utils/keyboardFocus");
  export = __exports;
}

declare module "@material-ui/core/utils/manageAriaHidden.js" {
  let __exports: import("@material-ui/core/utils/manageAriaHidden");
  export = __exports;
}

declare module "@material-ui/core/utils/reactHelpers.js" {
  let __exports: import("@material-ui/core/utils/reactHelpers");
  export = __exports;
}

declare module "@material-ui/core/utils/requirePropFactory.js" {
  let __exports: import("@material-ui/core/utils/requirePropFactory");
  export = __exports;
}

declare module "@material-ui/core/withWidth/withWidth.js" {
  let __exports: import("@material-ui/core/withWidth/withWidth");
  export = __exports;
}

declare module "@material-ui/core/withWidth/index.js" {
  let __exports: import("@material-ui/core/withWidth/withWidth");
  export = __exports;
}

declare module "@material-ui/core" {
  export var AppBar: import("@material-ui/core/AppBar/AppBar");
  export var Avatar: import("@material-ui/core/Avatar/Avatar");
  export var Badge: import("@material-ui/core/Badge/Badge");
  export var BottomNavigationAction: import("@material-ui/core/BottomNavigationAction/BottomNavigationAction");
  export var BottomNavigation: import("@material-ui/core/BottomNavigation/BottomNavigation");
  export var Button: import("@material-ui/core/Button/Button");
  export var ButtonBase: import("@material-ui/core/ButtonBase/ButtonBase");
  export var Card: import("@material-ui/core/Card/Card");
  export var CardActions: import("@material-ui/core/CardActions/CardActions");
  export var CardContent: import("@material-ui/core/CardContent/CardContent");
  export var CardHeader: import("@material-ui/core/CardHeader/CardHeader");
  export var CardMedia: import("@material-ui/core/CardMedia/CardMedia");
  export var Checkbox: import("@material-ui/core/Checkbox/Checkbox");
  export var Chip: import("@material-ui/core/Chip/Chip");
  export var ClickAwayListener: import("@material-ui/core/ClickAwayListener/ClickAwayListener");
  export var CssBaseline: import("@material-ui/core/CssBaseline/CssBaseline");
  export var Dialog: import("@material-ui/core/Dialog/Dialog");
  export var DialogActions: import("@material-ui/core/DialogActions/DialogActions");
  export var DialogContent: import("@material-ui/core/DialogContent/DialogContent");
  export var DialogContentText: import("@material-ui/core/DialogContentText/DialogContentText");
  export var DialogTitle: import("@material-ui/core/DialogTitle/DialogTitle");
  export var withMobileDialog: import("@material-ui/core/withMobileDialog/withMobileDialog");
  export var Divider: import("@material-ui/core/Divider/Divider");
  export var Drawer: import("@material-ui/core/Drawer/Drawer");
  export var ExpansionPanel: import("@material-ui/core/ExpansionPanel/ExpansionPanel");
  export var ExpansionPanelActions: import("@material-ui/core/ExpansionPanelActions/ExpansionPanelActions");
  export var ExpansionPanelDetails: import("@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails");
  export var ExpansionPanelSummary: import("@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary");
  export var FormControl: import("@material-ui/core/FormControl/FormControl");
  export var FormGroup: import("@material-ui/core/FormGroup/FormGroup");
  export var FormLabel: import("@material-ui/core/FormLabel/FormLabel");
  export var FormHelperText: import("@material-ui/core/FormHelperText/FormHelperText");
  export var FormControlLabel: import("@material-ui/core/FormControlLabel/FormControlLabel");
  export var Hidden: import("@material-ui/core/Hidden/Hidden");
  export var Icon: import("@material-ui/core/Icon/Icon");
  export var IconButton: import("@material-ui/core/IconButton/IconButton");
  export var Input: import("@material-ui/core/Input/Input");
  export var InputLabel: import("@material-ui/core/InputLabel/InputLabel");
  export var InputAdornment: import("@material-ui/core/InputAdornment/InputAdornment");
  export var Grid: import("@material-ui/core/Grid/Grid");
  export var GridList: import("@material-ui/core/GridList/GridList");
  export var GridListTile: import("@material-ui/core/GridListTile/GridListTile");
  export var GridListTileBar: import("@material-ui/core/GridListTileBar/GridListTileBar");
  export var List: import("@material-ui/core/List/List");
  export var ListItem: import("@material-ui/core/ListItem/ListItem");
  export var ListItemAvatar: import("@material-ui/core/ListItemAvatar/ListItemAvatar");
  export var ListItemIcon: import("@material-ui/core/ListItemIcon/ListItemIcon");
  export var ListItemSecondaryAction: import("@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction");
  export var ListItemText: import("@material-ui/core/ListItemText/ListItemText");
  export var ListSubheader: import("@material-ui/core/ListSubheader/ListSubheader");
  export var Menu: import("@material-ui/core/Menu/Menu");
  export var MenuItem: import("@material-ui/core/MenuItem/MenuItem");
  export var MenuList: import("@material-ui/core/MenuList/MenuList");
  export var MobileStepper: import("@material-ui/core/MobileStepper/MobileStepper");
  export var Modal: import("@material-ui/core/Modal/Modal");
  export var Backdrop: import("@material-ui/core/Backdrop/Backdrop");
  export var ModalManager: import("@material-ui/core/Modal/ModalManager");
  export var NativeSelect: import("@material-ui/core/NativeSelect/NativeSelect");
  export var Paper: import("@material-ui/core/Paper/Paper");
  export var Popover: import("@material-ui/core/Popover/Popover");
  export var Portal: import("@material-ui/core/Portal/Portal");
  export var CircularProgress: import("@material-ui/core/CircularProgress/CircularProgress");
  export var LinearProgress: import("@material-ui/core/LinearProgress/LinearProgress");
  export var Radio: import("@material-ui/core/Radio/Radio");
  export var RadioGroup: import("@material-ui/core/RadioGroup/RadioGroup");
  export var Select: import("@material-ui/core/Select/Select");
  export var Snackbar: import("@material-ui/core/Snackbar/Snackbar");
  export var SnackbarContent: import("@material-ui/core/SnackbarContent/SnackbarContent");
  export var Stepper: import("@material-ui/core/Stepper/Stepper");
  export var Step: import("@material-ui/core/Step/Step");
  export var StepButton: import("@material-ui/core/StepButton/StepButton");
  export var StepIcon: import("@material-ui/core/StepIcon/StepIcon");
  export var StepContent: import("@material-ui/core/StepContent/StepContent");
  export var StepLabel: import("@material-ui/core/StepLabel/StepLabel");
  export var MuiThemeProvider: import("@material-ui/core/styles/MuiThemeProvider");
  export var withStyles: import("@material-ui/core/styles/withStyles");
  export var withTheme: import("@material-ui/core/styles/withTheme");
  export var createMuiTheme: import("@material-ui/core/styles/createMuiTheme");
  export var jssPreset: import("@material-ui/core/styles/jssPreset");
  export var SvgIcon: import("@material-ui/core/SvgIcon/SvgIcon");
  export var SwipeableDrawer: import("@material-ui/core/SwipeableDrawer");
  export var Switch: import("@material-ui/core/Switch/Switch");
  export var Table: import("@material-ui/core/Table/Table");
  export var TableBody: import("@material-ui/core/TableBody/TableBody");
  export var TableCell: import("@material-ui/core/TableCell/TableCell");
  export var TableFooter: import("@material-ui/core/TableFooter/TableFooter");
  export var TableHead: import("@material-ui/core/TableHead/TableHead");
  export var TablePagination: import("@material-ui/core/TablePagination/TablePagination");
  export var TableRow: import("@material-ui/core/TableRow/TableRow");
  export var TableSortLabel: import("@material-ui/core/TableSortLabel/TableSortLabel");
  export var Tabs: import("@material-ui/core/Tabs/Tabs");
  export var Tab: import("@material-ui/core/Tab/Tab");
  export var Typography: import("@material-ui/core/Typography/Typography");
  export var TextField: import("@material-ui/core/TextField/TextField");
  export var Toolbar: import("@material-ui/core/Toolbar/Toolbar");
  export var Tooltip: import("@material-ui/core/Tooltip/Tooltip");
  export var Slide: import("@material-ui/core/Slide/Slide");
  export var Grow: import("@material-ui/core/Grow/Grow");
  export var Fade: import("@material-ui/core/Fade/Fade");
  export var Collapse: import("@material-ui/core/Collapse/Collapse");
  export var Zoom: import("@material-ui/core/Zoom/Zoom");
  export var withWidth: import("@material-ui/core/withWidth/withWidth");
  export var common: import("@material-ui/core/colors/common");
  export var red: import("@material-ui/core/colors/red");
  export var pink: import("@material-ui/core/colors/pink");
  export var purple: import("@material-ui/core/colors/purple");
  export var deepPurple: import("@material-ui/core/colors/deepPurple");
  export var indigo: import("@material-ui/core/colors/indigo");
  export var blue: import("@material-ui/core/colors/blue");
  export var lightBlue: import("@material-ui/core/colors/lightBlue");
  export var cyan: import("@material-ui/core/colors/cyan");
  export var teal: import("@material-ui/core/colors/teal");
  export var green: import("@material-ui/core/colors/green");
  export var lightGreen: import("@material-ui/core/colors/lightGreen");
  export var lime: import("@material-ui/core/colors/lime");
  export var yellow: import("@material-ui/core/colors/yellow");
  export var amber: import("@material-ui/core/colors/amber");
  export var orange: import("@material-ui/core/colors/orange");
  export var deepOrange: import("@material-ui/core/colors/deepOrange");
  export var brown: import("@material-ui/core/colors/brown");
  export var grey: import("@material-ui/core/colors/grey");
  export var blueGrey: import("@material-ui/core/colors/blueGrey");
}
