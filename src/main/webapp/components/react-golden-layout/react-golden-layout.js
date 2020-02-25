import React, { Fragment, useRef, useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import { makeStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles(theme => {
  const { typography, palette } = theme

  const background = palette.background.default
  const text = palette.text.secondary
  const primary = palette.primary.main
  const { fontFamily } = typography

  const root = height => {
    return {
      '& .lm_content': {
        background,
        border: `1px solid ${palette.divider}`,
      },
      '& .lm_splitter:hover': {
        background: palette.divider,
      },
      '& .lm_goldenlayout': {
        background,
      },
      '& .lm_header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        '& .lm_controls': {
          position: 'static',
          marginRight: height / 2,
        },

        '& .lm_tabs': {
          height: '100%',
          position: 'static',

          '& .lm_title': {
            fontFamily,
            color: text,
            marginRight: height / 2,
            fontSize: height / 3,
          },

          '& .lm_tab': {
            height: 'calc(100% - 2px)',
            background,
            padding: '0 20px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'none',
          },

          '& .lm_tab.lm_active ': {
            borderBottom: `2px solid ${primary}`,
            '& .lm_title': {
              color: primary,
            },
          },

          '& .lm_close_tab': {
            position: 'static !important',
          },
        },
      },
    }
  }

  return { root }
})

export const Layout = props => {
  const container = useRef(null)
  const [regions, setRegions] = useState([])
  const { setLayout } = useLayout()
  const { config, components, onChange } = props
  /* eslint-disable no-unused-vars */
  const [dimensions, setDimensions] = useState(null)
  /* eslint-enable no-unused-vars */
  const height = 48
  const { root } = useStyles(height)

  useEffect(() => {
    if (container.current === null) {
      return
    }

    const layout = new GoldenLayout(
      {
        settings: {
          showPopoutIcon: false,
          responsiveMode: 'none',
        },
        dimensions: {
          headerHeight: height,
          dragProxyWidth: 300,
          dragProxyHeight: 200,
        },
        labels: {
          close: 'close',
          maximise: 'maximize',
          minimise: 'minimize',
          popout: 'open in new window',
          popin: 'pop in',
          tabDropdown: 'additional tabs',
        },
        ...config,
      },
      container.current
    )

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
    const updateContainerSize = () => {
      if (container.current) {
        const width = container.current.offsetWidth
        const height = container.current.offsetHeight
        setDimensions({ width, height })
      }
    }
    layout.on('componentCreated', component => {
      if (component.container) {
        component.container.on('resize', updateContainerSize)
      }
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
      <div
        className={root}
        style={{ height: '100%', width: '100%' }}
        ref={container}
      />
      {regions.map(region => {
        const { key, el } = region
        const Component = components[key]
        return ReactDOM.createPortal(<Component />, el)
      })}
    </Fragment>
  )
}
