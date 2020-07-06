import React, {useState, useEffect} from 'react';
import * as d3 from "d3"
import _ from 'lodash';
import {loadAllData} from './cleaning/PreDataHandling';
import {countyValue} from './cleaning/PostDataHandling';
import './App.css';
import './style.css'
import Preloader from './components/Preloader'
import CountyMap from './components/CountyMap'
import Histogram from './components/Histogram.jsx'
import {Title, Description} from './components/Copy'

import Controls from "./components/Controls"

function App() {
  const [datasets, setDatasets] = useState({
      techSalaries: [],
      medianIncomes: [],
      countyNames: [],
      usTopoJson: null,
      USstateNames: null,
      medianIncomesByUSState: {},
      medianIncomesByCounty: {},
  });
  const [salariesFilter, setSalariesFilter] = useState(() => () => true);
  const [filteredBy, setFilteredBy] = useState({
      USstate: "*",
      year: "*",
      jobTitle: "*",
  });

  const {
      techSalaries,
      medianIncomes,
      countyNames,
      usTopoJson,
      USstateNames,
      medianIncomesByCounty,
      medianIncomesByUSState,
  } = datasets;

  async function loadData() {
      const datasets = await loadAllData();
      setDatasets(datasets);
  }

  function updateDataFilter(filter, filteredBy) {
      setFilteredBy(filteredBy);
      setSalariesFilter(() => filter);
  }

  useEffect(() => {
      loadData();
  }, []);

  const salaryAccessor = d => d.base_salary
  const filteredSalaries = techSalaries.filter(salariesFilter),
      filteredSalariesMap = _.groupBy(filteredSalaries, "countyID"),
      countyValues = countyNames
          .map((county) => countyValue(county, filteredSalariesMap, medianIncomes))
          .filter((d) => !_.isNull(d));

  if (techSalaries.length < 1) {
      return <Preloader />;
  } else {
      let zoom = null,
          medianHousehold = medianIncomesByUSState["US"][0].medianIncome;

      if (filteredBy.USstate !== "*") {
          zoom = filteredBy.USstate;
          medianHousehold = d3.mean(
              medianIncomesByUSState[zoom],
              (d) => d.medianIncome
          );
      }

      return (
        <div className="App">
        <div className="Header">
          <Title 
            filteredSalaries={filteredSalaries} 
            filteredBy={filteredBy} 
          />
          <Description
            data={filteredSalaries}
            allData={techSalaries}
            filteredBy={filteredBy}
            medianIncomesByCounty={medianIncomesByCounty}
          />
        </div>
        <div className="Chart-area">
          <CountyMap 
            usTopoJson={usTopoJson}
            USstateNames={USstateNames}
            values={countyValues}
            zoom={zoom}    
          />
          <Histogram 
            data={filteredSalaries}
            xAccessor={salaryAccessor}
            medianHousehold={medianHousehold}
          />
          <Controls 
            data={techSalaries}
            updateDataFilter={updateDataFilter}
          />
        </div>
      </div>
      );
  }
}

export default App;
