import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Filter({ heading, config, handleChange, value: valueProp }) {
  const [value, setValue] = React.useState(valueProp);
  config.sort()
  
  return (
    <div style={{width: '250px'}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{heading}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Age"
          multiple
          onChange={(event) => {
            const value = event.target.value
            setValue(value);
            handleChange(value, heading, config)
          }}
        >
          {config.map((conf, key) => {
            return (<MenuItem key={key} value={conf}>{conf}</MenuItem>)
          })}

        </Select>
      </FormControl>
    </div>
  )
}
