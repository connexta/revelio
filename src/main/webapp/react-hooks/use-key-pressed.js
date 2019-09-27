import { useEffect, useState } from 'react'

const useKeyPressed = aKey => {
  const [pressed, setPressed] = useState(false)

  const onDown = ({ key }) => {
    if (key === aKey) {
      setPressed(true)
    }
  }

  const onUp = ({ key }) => {
    if (key === aKey) {
      setPressed(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onDown)
    document.addEventListener('keyup', onUp)
    return () => {
      document.removeEventListener('keydown', onDown)
      document.removeEventListener('keyup', onUp)
    }
  }, [])

  return pressed
}

export default useKeyPressed
