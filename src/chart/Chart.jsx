import React, { createContext, useContext } from "react"

import "./Chart.css"

const ChartContext = createContext()
export const useChartDimensions = () => useContext(ChartContext)

const Chart = ({ dimensions, title, children }) => (
  <ChartContext.Provider value={dimensions}>
    <svg className="Chart" width={dimensions.width} height={dimensions.height}>
      <text 
        className="Title"
        transform={`translate(${dimensions.boundedWidth / 2}, 30)`}
        >{title}</text>
      <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        { children }
      </g>
    </svg>
  </ChartContext.Provider>
)

export default Chart
