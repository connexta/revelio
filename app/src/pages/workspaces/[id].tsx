import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const Workspace = dynamic(() => import('../../components/workspace'), {
  loading: () => <LinearProgress />,
})

const WorkspacePage = props => <Workspace {...props} />
WorkspacePage.getInitialProps = () => ({ title: 'Workspace' })

export default () => {
  const router = useRouter()
  const id = router.query['id']
  return <WorkspacePage id={id} />
}
