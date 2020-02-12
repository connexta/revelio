const { storiesOf } = require('./@storybook/react')
import React, { useState } from 'react'
import QuerySchedule from './query-schedule'
const stories = storiesOf('Query Schedule', module)

const defaultSchedule = {
  scheduleType: 'standing',
  scheduleUnit: 'days',
  scheduleAmount: 1,
  userId: 'admin@admin',
  scheduleStart: 12141241242,
  scheduleEnd: 1312424214,
}

stories.add('Basic', () => {
  const [schedule, setSchedule] = useState<any>(defaultSchedule)
  return (
    <QuerySchedule
      onChange={newSchedule => setSchedule(newSchedule)}
      schedule={schedule}
    />
  )
})
