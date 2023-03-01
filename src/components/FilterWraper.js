import React from 'react'
import '../App.css';
import Filter from './Filter'

export default function FilterWraper({ filters, filterConfig, handleChange }) {
  return (
    <div className='fl-row'>
      {filters.map((filter, key) => {
        return (
          <div key={`filter_${key}`} className='fl-colums'>
            <Filter heading={filter} config={filterConfig[filter].options} handleChange={handleChange} value={filterConfig[filter].value}></Filter>
          </div>
        )
      })}
    </div>
  )
}
