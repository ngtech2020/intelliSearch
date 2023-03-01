import './App.css';
import * as React from 'react';
import FilterWraper from './components/FilterWraper';
import DataTable from './components/DataTable';
import { Card } from '@mui/material';
import { TABLE_DATA } from './data/data';

function App() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(TABLE_DATA.length);
  const columns = Object.keys(TABLE_DATA[0]) ?? [];
  const [filterStack, setFilterStack] = React.useState([]);
  const [filterConfig, setFilterConfig] = React.useState(setFilterConfigData(TABLE_DATA, true));
  const [appliedFilters, setAppliedFilters] = React.useState(getAppliedFilters());


  function setFilterConfigData(data, isReturn = false) {
    const config = {};
    const filerColumns = columns.slice(1);
    filerColumns.forEach(column => {
      config[column] = {
        options: [],
        value: []
      }
    })
    data && data.length && data.forEach(item => {
      for (const key in item) {
        if (filerColumns.indexOf(key) >= 0 && config[key].options.indexOf(item[key]) < 0) {
          config[key].options.push(item[key]);
          config[key].value.push(item[key]);
        }
      }
    })
    if (isReturn) {
      return config
    }
    const currentFilter = filterStack[filterStack.length - 1];
    if (currentFilter) {
      config[currentFilter.filter].options = [...currentFilter.options]
      config[currentFilter.filter].value = [...currentFilter.value]
    }
    setFilterConfig(config);
  }

  function getAppliedFilters(configData = null) {
    const data = filterConfig || configData;
    let filters = {}
    for (let key in data) {
      filters[key] = [...data[key].value]
    }
    return filters
  }

  function filterTableData() {
    const filerColumns = columns.slice(1);
    let filterData = TABLE_DATA.filter(dataRow => {
      let include = true;

      for (let key in dataRow) {
        if (filerColumns.indexOf(key) >= 0 && appliedFilters[key].indexOf(dataRow[key]) < 0) {
          include = false;
        }
      }
      return include;
    });
    return filterData
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  };

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function checkForAddition(value, filter) {
    if (!filterStack.length) {
      return false
    }
    const lastConfigofFilter = filterStack.findLast(val => val.filter === filter)
    if (!lastConfigofFilter) {
      return false
    }
    if (lastConfigofFilter.value.length > value.length) {
      return false
    }
    return true;
  }

  function handleFilterChange(value, filter, config) {
    setAppliedFilters(appliedFilters => ({ ...appliedFilters, [filter]: value }))
    let isAddOptionValue = checkForAddition(value, filter);
    if (!isAddOptionValue) {
      setFilterStack(filterStack => ([...filterStack, { filter, options: config, value }]))
    } else {
      filterStack.pop();
      setFilterStack(filterStack)
    }
    setPage(0);
  }

  React.useEffect(() => {
    const filteredData = filterTableData();
    setFilterConfigData(filteredData);
    setRows(filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    setDataCount(filteredData.length);
  }, [page, rowsPerPage, appliedFilters]);

  return (
    <div className="App">
      <Card className='card' variant="outlined">
        <FilterWraper filters={columns.slice(1)} filterConfig={filterConfig} handleChange={handleFilterChange}></FilterWraper>
        <DataTable columns={columns} rows={rows} page={page} rowsPerPage={rowsPerPage} dataCount={dataCount} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage}></DataTable>
      </Card>
    </div>
  );
}

export default App;
