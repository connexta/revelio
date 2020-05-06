import React from 'react'
import FormLabel from '@material-ui/core/FormLabel'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

export const RadioButton = props => {
  const { label, buttonText, value, onChange } = props
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
      }}
    >
      <FormLabel style={{ marginBottom: '10px' }}>{label}</FormLabel>
      <ButtonGroup style={{ marginBottom: '20px' }}>
        {buttonText.map((item, index) => {
          return item.value === value ? (
            <Button
              variant="contained"
              color="secondary"
              key={index}
              onClick={() => {
                onChange(item.value)
              }}
            >
              {item.label}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              key={index}
              onClick={() => {
                onChange(item.value)
              }}
            >
              {item.label}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}
