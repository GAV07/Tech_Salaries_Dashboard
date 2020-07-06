import * as d3 from 'd3'


export const countyValue = (county, techSalariesMap, medianIncomes) => {
    const medianHousehold = medianIncomes[county.id],
          salaries = techSalariesMap[county.name]

    if (!medianHousehold || !salaries) {
      return null
    }
    const median = d3.median(salaries, (d) => d.base_salary)
    return {
      countyID: county.id,
      value: median - medianHousehold.medianIncome,
    }
}

