import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const Workspaces = dynamic(() => import('../components/workspaces'), {
  loading: () => <LinearProgress />,
})

const WorkspacesPage = () => <Workspaces />

WorkspacesPage.getInitialProps = () => ({ title: 'Workspaces' })

export default WorkspacesPage
