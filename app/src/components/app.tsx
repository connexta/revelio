import React, { useState } from 'react'
import Head from 'next/head'
import { ThemeProvider } from '../theme'
import Drawer from '@material-ui/core/Drawer'
import NavBar, { NavigationBarContext } from './nav-bar'
import NavMenu from './nav-menu'
import { useTheme } from '@material-ui/core/styles'
import { SelectionProvider } from '../react-hooks/use-selection-interface'
import { DrawProvider } from '../react-hooks/use-draw-interface'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import LoginModal from '../components/login/loginModal'

type Props = {
  children: React.ReactNode
  title?: string
}

const Container = props => {
  const { palette } = useTheme()
  return (
    <div
      style={{
        color: palette.text.primary,
        background: palette.background.default,
        minHeight: '100vh',
      }}
    >
      {props.children}
    </div>
  )
}

export default (props: Props) => {
  const [navOpen, setNavOpen] = useState(false)
  const [navBarLeftRef, setNavBarLeftRef] = React.useState(null)
  return (
    <React.Fragment>
      <Head>
        <title>{props.title}</title>
      </Head>
      <ThemeProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SelectionProvider>
            <DrawProvider>
              <Container>
                <Drawer
                  anchor="left"
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                >
                  <NavMenu onSelect={() => setNavOpen(false)} />
                </Drawer>
                <NavigationBarContext.Provider value={navBarLeftRef}>
                  <NavBar
                    title={props.title}
                    onMenuOpen={() => setNavOpen(true)}
                    navBarLeftRef={el => setNavBarLeftRef(el)}
                  />
                  <div
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 64px)',
                    }}
                  >
                    {props.children}
                    <LoginModal />
                  </div>
                </NavigationBarContext.Provider>
              </Container>
            </DrawProvider>
          </SelectionProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}
