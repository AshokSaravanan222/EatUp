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
      <Path d="M20 12.426C20 16.539 17.493 22 14.4 22a4.285 4.285 0 01-1.6-.316 2.118 2.118 0 00-1.592 0A4.285 4.285 0 019.6 22C6.507 22 4 16.539 4 12.426s2.507-7.109 5.6-7.109a4.271 4.271 0 011.588.321A4.643 4.643 0 0116 2a1 1 0 010 2 2.685 2.685 0 00-2.629 1.457 4.158 4.158 0 011.029-.14c3.093 0 5.6 2.997 5.6 7.109z" />
    </Svg>
  )
}

export default SvgComponent
