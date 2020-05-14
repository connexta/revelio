import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const About = dynamic(() => import('../components/about'), {
  loading: () => <LinearProgress />,
})

const AboutPage = () => <About />

AboutPage.getInitialProps = () => ({ title: 'About' })

export default AboutPage
