import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const SimpleSearch = dynamic(() => import('../components/simple-search'), {
  loading: () => <LinearProgress />,
})

const SimpleSearchPage = () => <SimpleSearch />
SimpleSearchPage.getInitialProps = () => ({ title: 'Simple Search' })

export default SimpleSearchPage
