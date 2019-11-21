import * as React from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { coordinates as coordinateEditor } from 'geospatialdraw'

type Props = TextFieldProps &
  coordinateEditor.NumericConstraints & {
    /** Numeric value */
    value: number
    /** Called on change */
    onChange: (value: number) => void
  }

type ChangeEvent = React.ChangeEvent<HTMLInputElement>

const NumberInput: React.SFC<Props> = ({
  value,
  onChange,
  maxValue,
  minValue,
  decimalPlaces,
  ...rest
}) => {
  const [
    number,
    text,
    setText,
    formattedText,
  ] = coordinateEditor.useNumberInput(value, {
    maxValue,
    minValue,
    decimalPlaces,
  })
  return (
    <TextField
      fullWidth
      value={text}
      error={number === null}
      helperText={number === null ? 'invalid value' : ''}
      onChange={({ target: { value: textValue } }: ChangeEvent) => {
        const number = setText(textValue)
        if (number !== null) {
          onChange(number)
        }
      }}
      onBlur={() => {
        setText(formattedText)
      }}
      {...rest}
    />
  )
}

export default NumberInput
