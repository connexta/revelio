import React, { Fragment, useRef, useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'

import GoldenLayout from 'golden-layout'

import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'

const Context = React.createContext()

const useLayout = () => {
  const value = useContext(Context)

  const [layout, setLayout] = value

  return { layout, setLayout }
}

export const Provider = ({ children }) => {
  const value = useState(null)

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const AddConfig = ({ children, config }) => {
  const { layout } = useLayout()

  const onClick = () => {
    if (layout === null) {
      return
    }

    if (layout.root.contentItems.length > 0) {
      layout.root.contentItems[0].addChild(config)
    } else {
      layout.root.addChild(config)
    }
  }

  return <div onClick={onClick}>{children}</div>
}

export const DragSource = ({ children, config }) => {
  const source = useRef(null)

  const { layout } = useLayout()

  useEffect(
    () => {
      if (source === null) {
        return
      }

      if (layout === null) {
        return
      }

      layout.createDragSource(source.current, config)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source, layout]
  )

  return <div ref={source}>{children}</div>
}

export const Layout = props => {
  const container = useRef(null)
  const [regions, setRegions] = useState([])
  const { setLayout } = useLayout()
  const { config, components, onChange } = props

  useEffect(() => {
    if (container.current === null) {
      return
    }

    const layout = new GoldenLayout(config, container.current)

    setLayout(layout)

    const onResize = () => {
      layout.updateSize()
    }

    window.addEventListener('resize', onResize)

    layout.on('initialised', () => {
      layout.unbind('initialised')
      setTimeout(() => {
        layout.on('stateChanged', () => {
          onChange(layout.toConfig())
        })
      }, 0)
    })

    // cleanup local state when items removed from golden layout
    layout.on('itemDestroyed', component => {
      if (!component.container) {
        return
      }
      const el = component.container.getElement().get(0)
      setRegions(regions => {
        return regions.filter(region => {
          return region.el !== el
        })
      })
    })

    Object.keys(components).forEach(key => {
      layout.registerComponent(key, container => {
        const el = container.getElement().get(0)
        setRegions(regions => {
          return regions.concat({ el, key })
        })
      })
    })

    layout.init()

    return () => {
      layout.destroy()
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      <div style={{ height: '100%', width: '100%' }} ref={container} />
      {regions.map(region => {
        const { key, el } = region
        const Component = components[key]
        return ReactDOM.createPortal(<Component />, el)
      })}
    </Fragment>
  )
}
