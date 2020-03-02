import * as React from 'react'
import { useState } from 'react'
import Box from '@material-ui/core/Box'
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  KeyboardTimePickerProps,
  KeyboardTimePicker,
} from '@material-ui/pickers'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
type QuerySchedule = {
  userId?: string // user e-mail
  scheduleAmount?: number | null
  scheduleUnit?:
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'days'
    | 'weeks'
    | 'months'
    | 'years'
  scheduleType?: 'off' | 'scheduled' | 'standing'
  scheduleStart?: number | null // ISO number date
  scheduleEnd?: number | null // ISO number date
  deliveryIds?: string[] | null
  useDeliveryTime?: boolean
  deliveryTime?: number | null // ISO number date - only present if useDeliveryTime is true
}

type QueryScheduleProps = {
  schedule: QuerySchedule
  onChange: (newSchedule: QuerySchedule) => void
}

const DatePicker = (props: KeyboardDatePickerProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>()

  return (
    <KeyboardDatePicker
      {...props}
      onChange={(date, value) => {
        if (date === null || !date.isValid()) {
          props.onChange(null)
        } else if (date.isValid()) {
          props.onChange(date)
        }
        setInputValue(value || undefined)
      }}
      inputValue={inputValue}
    />
  )
}

const TimePicker = (props: KeyboardTimePickerProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>()

  return (
    <KeyboardTimePicker
      {...props}
      onChange={(date, value) => {
        if (date === null || !date.isValid()) {
          props.onChange(null)
        } else if (date.isValid()) {
          props.onChange(date)
        }
        setInputValue(value || undefined)
      }}
      inputValue={inputValue}
    />
  )
}

const ScheduleSection = (props: QueryScheduleProps) => {
  const schedule = props.schedule || {}

  if (schedule.scheduleType === 'scheduled') {
    return (
      <DatePicker
        fullWidth
        label="Runs on"
        disableToolbar
        variant="inline"
        format="MM/DD/YYYY"
        margin="normal"
        value={schedule.scheduleStart ? new Date(schedule.scheduleStart) : null}
        onChange={date => {
          if (date === null) {
            props.onChange({ ...schedule, scheduleStart: null })
          } else {
            props.onChange({ ...schedule, scheduleStart: date.valueOf() })
          }
        }}
      />
    )
  }

  if (schedule.scheduleType === 'standing') {
    return (
      <React.Fragment>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box>
            <Typography color="textPrimary">Repeats every</Typography>
          </Box>
          <TextField
            type="number"
            onChange={event => {
              props.onChange({
                ...schedule,
                scheduleAmount:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }}
            value={schedule.scheduleAmount}
            variant="outlined"
            style={{ width: 75, marginLeft: 20 }}
          />
          <Select
            style={{ marginLeft: 20 }}
            value={schedule.scheduleUnit}
            onChange={event => {
              props.onChange({
                ...schedule,
                scheduleUnit: event.target.value as any,
              })
            }}
            variant="outlined"
          >
            <MenuItem value="seconds">Seconds</MenuItem>
            <MenuItem value="minutes">Minutes</MenuItem>
            <MenuItem value="hours">Hours</MenuItem>
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="weeks">Weeks</MenuItem>
            <MenuItem value="months">Months</MenuItem>
          </Select>
        </Box>
        <Box display="flex" flexDirection="column">
          <DatePicker
            fullWidth
            label="Runs on"
            disableToolbar
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            value={
              schedule.scheduleStart ? new Date(schedule.scheduleStart) : null
            }
            onChange={date => {
              if (date === null) {
                props.onChange({ ...schedule, scheduleStart: null })
              } else {
                props.onChange({ ...schedule, scheduleStart: date.valueOf() })
              }
            }}
          />
          <DatePicker
            fullWidth
            label="Ends on"
            disableToolbar
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            value={schedule.scheduleEnd ? new Date(schedule.scheduleEnd) : null}
            onChange={date => {
              if (date === null) {
                props.onChange({ ...schedule, scheduleEnd: null })
              } else {
                props.onChange({ ...schedule, scheduleEnd: date.valueOf() })
              }
            }}
          />
        </Box>
      </React.Fragment>
    )
  }

  return null
}

//TODO: integrate with user prefs to use default value
const DeliveryMethodSection = (props: QueryScheduleProps) => {
  const schedule = props.schedule || {}

  return (
    <Box>
      <FormControl style={{ marginTop: 20 }}>
        <FormLabel>Submit Orders</FormLabel>
        <ButtonGroup
          color="primary"
          variant="contained"
          style={{ width: 'fit-content' }}
        >
          <Button
            onClick={() => props.onChange({ ...schedule, deliveryIds: null })}
            disabled={schedule.deliveryIds == undefined}
          >
            <Typography color="textPrimary">Off</Typography>
          </Button>
          <Button
            onClick={() =>
              props.onChange({
                ...schedule,
                deliveryIds: schedule.deliveryIds || [],
                useDeliveryTime: false,
              })
            }
            disabled={
              schedule.deliveryIds != undefined && !schedule.useDeliveryTime
            }
          >
            <Typography color="textPrimary">Immediately</Typography>
          </Button>
          <Button
            onClick={() => {
              props.onChange({
                ...schedule,
                deliveryIds: schedule.deliveryIds || [],
                useDeliveryTime: true,
              })
            }}
            disabled={Boolean(schedule.deliveryIds && schedule.useDeliveryTime)}
          >
            <Typography color="textPrimary">At a Scheduled Time</Typography>
          </Button>
        </ButtonGroup>
      </FormControl>
      {schedule.deliveryIds && (
        <Box style={{ marginTop: 20 }}>
          <FormControl fullWidth>
            <FormLabel>Delivery Methods</FormLabel>
            <Select
              fullWidth
              multiple
              value={schedule.deliveryIds}
              onChange={event => {
                props.onChange({
                  ...schedule,
                  deliveryIds: event.target.value as string[],
                })
              }}
              variant="outlined"
              renderValue={(selected: string[]) => selected.join(', ')}
            >
              <MenuItem value="The only Delivery Method">
                The only Delivery Method
              </MenuItem>
            </Select>
          </FormControl>
          {schedule.useDeliveryTime && (
            <TimePicker
              fullWidth
              label="Deliver at"
              variant="inline"
              margin="normal"
              value={
                schedule.deliveryTime ? new Date(schedule.deliveryTime) : null
              }
              onChange={date => {
                if (date === null) {
                  props.onChange({ ...schedule, deliveryTime: null })
                } else {
                  props.onChange({ ...schedule, deliveryTime: date.valueOf() })
                }
              }}
            />
          )}
        </Box>
      )}
    </Box>
  )
}

const QuerySchedule = (props: QueryScheduleProps) => {
  const schedule = props.schedule

  return (
    <Box display="flex" flexDirection="column">
      <FormControl>
        <FormLabel>Schedule</FormLabel>
        <ButtonGroup
          color="primary"
          variant="contained"
          style={{ width: 'fit-content' }}
        >
          <Button
            onClick={() => props.onChange({ ...schedule, scheduleType: 'off' })}
            disabled={!schedule.scheduleType || schedule.scheduleType === 'off'}
          >
            <Typography color="textPrimary">Off</Typography>
          </Button>
          <Button
            onClick={() =>
              props.onChange({ ...schedule, scheduleType: 'scheduled' })
            }
            disabled={schedule.scheduleType === 'scheduled'}
          >
            <Typography color="textPrimary">Once</Typography>
          </Button>
          <Button
            onClick={() =>
              props.onChange({
                ...schedule,
                scheduleType: 'standing',
                scheduleUnit: 'weeks',
                scheduleAmount: 1,
              })
            }
            disabled={schedule.scheduleType === 'standing'}
          >
            <Typography color="textPrimary">Periodically</Typography>
          </Button>
        </ButtonGroup>
      </FormControl>
      {schedule.scheduleType &&
        schedule.scheduleType !== 'off' && (
          <Box style={{ marginTop: 20, marginLeft: 15 }}>
            <ScheduleSection {...props} />
            <DeliveryMethodSection {...props} />
          </Box>
        )}
    </Box>
  )
}

export default QuerySchedule
