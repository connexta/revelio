import React from 'react'
import { storiesOf } from '../../@storybook/react'
const stories = storiesOf('LogIn', module)
import LogIn from './login'
import LogInModal from './loginModal'

stories.add('Login Form', () => {
  return <LogIn label="Login" logIn={() => {}} />
})

stories.add('Login modal', () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <button
        onClick={() => {
          setOpen(true)
        }}
      >
        Open Modal
      </button>
      <LogInModal
        label="Log In"
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  )
})
