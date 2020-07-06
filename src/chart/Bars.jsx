import React from "react"
import * as d3 from 'd3'
import { callAccessor } from "../utils/utils";

const Bars = ({ data, keyAccessor, xAccessor, yAccessor, widthAccessor, heightAccessor, ...props }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <rect {...props}
        className="Bars__rect"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
      />
    ))}
  </React.Fragment>
)


export default Bars

