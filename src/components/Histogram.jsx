import React from "react"
import * as d3 from "d3"
import Chart from "../chart/Chart"
import Bars from "../chart/Bars"
import Axis from "../chart/Axis"
import MedianLine from '../chart/MedianLine'

import { useChartDimensions } from "../utils/utils"



const Histogram = ({ data, xAccessor, medianHousehold, }) => {
  
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  const numberOfThresholds = 9

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedHeight])
    .nice(numberOfThresholds)

  const binsGenerator = d3.histogram()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds))

  const bins = binsGenerator(data)

  const yAccessor = d => d.length
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([0 , dimensions.boundedHeight])
    .nice()

  const barPadding = 2

  const xAccessorScaled = d => xScale(d.x0) + barPadding
  const yAccessorScaled = 0
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding
  const heightAccessorScaled = d => yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div className="Histogram" ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={xScale}
        />
        <Bars
          data={bins}
          keyAccessor={keyAccessor}
          yAccessor={xAccessorScaled}
          xAccessor={yAccessorScaled}
          heightAccessor={widthAccessorScaled}
          widthAccessor={heightAccessorScaled}
        />
        <MedianLine 
            data={data}
            x={500}
            y={10}
            width={600}
            height={500}
            bottomMargin={5}
            median={medianHousehold}
            value={d => d.base_salary} />
      </Chart>
    </div>
  )
}

export default Histogram
