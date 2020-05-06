import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const ResultForms = dynamic(() => import('../components/result-forms'), {
  loading: () => <LinearProgress />,
})

const ResultFormsPage = () => <ResultForms />

ResultFormsPage.getInitialProps = () => ({ title: 'Result Forms' })

export default ResultFormsPage
