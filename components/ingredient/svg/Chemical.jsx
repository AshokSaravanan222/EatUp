import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { COLORS } from "../../../constants"

function SvgComponent(props) {
  return (
    <Svg
      fill={COLORS.tertiary}
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M21.406 4.086l-4.5-2a1 1 0 00-.812 0L12 3.905 7.906 2.086a1 1 0 00-.812 0l-4.5 2A1 1 0 002 5v6a1 1 0 00.594.914L6.5 13.65v4.869l-2.125 1.7a1 1 0 001.25 1.562l2.025-1.62C11.6 21.887 11.6 22 12 22c.377 0 .223-.037 4.35-1.839l2.025 1.62a1 1 0 001.25-1.562l-2.125-1.7V13.65l3.906-1.736A1 1 0 0022 11V5a1 1 0 00-.594-.914zM4 5.649L7.5 4.1 11 5.649v4.7l-3.5 1.556L4 10.351zm8 14.256l-3.5-1.554v-4.7L12 12.1l3.5 1.555v4.7zm8-9.554l-3.5 1.554L13 10.35v-4.7l3.5-1.55L20 5.649z" />
    </Svg>
  )
}

export default SvgComponent
