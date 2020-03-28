import React from 'react'
import FormLabel from '@material-ui/core/FormLabel'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

export const RadioButton = props => {
  const { label, buttonText, defaultButton, onChange } = props
  const [selectedButton, setSelectedButton] = React.useState(defaultButton)
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
          return index === selectedButton ? (
            <Button
              variant="contained"
              color="secondary"
              key={index}
              onClick={() => {
                setSelectedButton(item.index)
                onChange(item.index)
              }}
            >
              {item.text}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              key={index}
              onClick={() => {
                setSelectedButton(item.index)
                onChange(item.index)
              }}
            >
              {item.text}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}
