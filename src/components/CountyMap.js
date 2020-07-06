import React from 'react'
import * as d3 from 'd3'
import { useChartDimensions } from "../utils/utils"
import Chart from "../chart/Chart"
import * as topojson from 'topojson'
import _ from 'lodash'


const ChoroplethColors = _.reverse([
    "rgb(247,251,255)",
    "rgb(222,235,247)",
    "rgb(198,219,239)",
    "rgb(158,202,225)",
    "rgb(107,174,214)",
    "rgb(66,146,198)",
    "rgb(33,113,181)",
    "rgb(8,81,156)",
    "rgb(8,48,107)",
])
const BlankColor = "rgb(240,240,240)"

const County = ({ geoPath, feature, zoom, key, quantize, value }) => {
    let color = BlankColor
    if (value) {
      color = ChoroplethColors[quantize(value)]
    }
    return (
      <path d={geoPath(feature)} style={{ fill: color }} title={feature.id} />
    )
}

const CountyMap = ({ usTopoJson, USstateNames, zoom, values }) => {

        const [ref, dimensions] = useChartDimensions()
        const projection = d3.geoAlbersUsa()
            .scale(1280)
            .translate([dimensions.boundedWidth / 2, dimensions.boundedHeight / 2])
            .scale(dimensions.boundedWidth * 1.3)
        const geoPath = d3.geoPath().projection(projection)
        const quantize = d3.scaleQuantize().range(d3.range(9))

        if (zoom && usTopoJson) {
            const us = usTopoJson,
                USstatePaths = topojson.feature(us, us.objects.states).features,
                id = _.find(USstateNames, { code: zoom }).id
            projection.scale(dimensions.width * 4.5)
            const centroid = geoPath.centroid(_.find(USstatePaths, { id: id })),
                translate = projection.translate()
            projection.translate([
                translate[0] - centroid[0] + dimensions.boundedWidth / 2,
                translate[1] - centroid[1] + dimensions.boundedHeight / 2,
            ])
        }
        if (values) {
            quantize.domain([
                d3.quantile(values, 0.15, (d) => d.value),
                d3.quantile(values, 0.85, (d) => d.value),
            ])
        }

        if (!usTopoJson) {
            return null;
        } else {
            const us = usTopoJson,
            USstatesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b),
            counties = topojson.feature(us, us.objects.counties).features
            const countyValueMap = _.fromPairs(values.map((d) => [d.countyID, d.value]))

          return (
            <div className="Map" ref={ref}>
              <Chart dimensions={dimensions}>
                    {counties.map((feature) => (
                      <County
                        geoPath={geoPath}
                        feature={feature}
                        zoom={zoom}
                        key={feature.id}
                        quantize={quantize}
                        value={countyValueMap[feature.id]}
                      />
                    ))}
                    <path
                      d={geoPath(USstatesMesh)}
                      style={{
                        fill: "none",
                        stroke: "#fff",
                        strokeLinejoin: "round",
                      }}
                    />
              </Chart>
            </div>
            
          )
        }
    }


export default CountyMap;