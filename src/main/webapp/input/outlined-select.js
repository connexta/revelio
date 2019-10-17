import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select from '@material-ui/core/Select'
import React from 'react'

const OutlinedSelect = (props = {}) => {
  const { value, onChange, label } = props
  const inputLabel = React.useRef(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  return (
    <React.Fragment>
      <InputLabel ref={inputLabel}>{label}</InputLabel>
      <Select
        input={<OutlinedInput labelWidth={labelWidth} />}
        value={value}
        onChange={onChange}
      >
        {props.children}
      </Select>
    </React.Fragment>
  )
}

export default OutlinedSelect
