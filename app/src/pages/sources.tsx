import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const Sources = dynamic(() => import('../components/sources-info'), {
  loading: () => <LinearProgress />,
})
const SourcesPage = () => <Sources />

SourcesPage.getInitialProps = () => ({ title: 'Sources' })

export default SourcesPage
