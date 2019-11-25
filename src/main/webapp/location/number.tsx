import * as React from 'react'
import TextField from '@material-ui/core/TextField'
import { coordinates as coordinateEditor } from 'geospatialdraw'

export type MaterialUIInputProps = {
  autoComplete?: string
  autoFocus?: boolean
  color?: 'primary' | 'secondary'
  children?: React.ReactNode
  defaultValue?: unknown
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  helperText?: React.ReactNode
  id?: string
  InputLabelProps?: any
  inputRef?: React.Ref<any>
  label?: React.ReactNode
  margin?: any
  multiline?: boolean
  name?: string
  placeholder?: string
  required?: boolean
  rows?: string | number
  rowsMax?: string | number
  select?: boolean
  SelectProps?: any
  type?: string
  InputProps?: any
  inputProps?: any
  style?: any
}

type Props = MaterialUIInputProps &
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
      value={text}
      error={number === null}
      helperText={number === null ? 'invalid value' : ''}
      onChange={({ target: { value: textValue } }: ChangeEvent) =>
        setText(textValue)
      }
      onBlur={() => {
        setText(formattedText)
        if (number !== null) {
          onChange(number)
        }
      }}
      {...rest}
    />
  )
}

export default NumberInput
