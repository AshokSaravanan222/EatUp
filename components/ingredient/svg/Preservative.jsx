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
      <Path d="M10 4a1 1 0 010-2h4a1 1 0 010 2zM7.586 9.414l1.828-1.828A2 2 0 0010 6.172V5h4v1.172a2 2 0 00.586 1.414l1.828 1.828A2 2 0 0117 10.828V21a1 1 0 01-1 1H8a1 1 0 01-1-1V10.828a2 2 0 01.586-1.414zM9 19.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5h-5a.5.5 0 00-.5.5z" />
    </Svg>
  )
}

export default SvgComponent
