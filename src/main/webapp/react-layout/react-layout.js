import React, { Fragment, useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import GoldenLayout from 'golden-layout'

import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'

const Layout = props => {
  const container = useRef(null)
  const [regions, setRegions] = useState([])
  const { config, components, onChange } = props

  useEffect(
    () => {
      if (container.current === null) {
        return
      }
      const layout = new GoldenLayout(config, container.current)

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

      return () => layout.destroy()
    },
    [config, components, container, onChange, setRegions]
  )

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

export default Layout
