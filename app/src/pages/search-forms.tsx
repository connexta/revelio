import dynamic from 'next/dynamic'
import LinearProgress from '@material-ui/core/LinearProgress'

const SearchForms = dynamic(() => import('../components/search-forms'), {
  loading: () => <LinearProgress />,
})

const SearchFormsPage = () => <SearchForms />

SearchFormsPage.getInitialProps = () => ({ title: 'Search Forms' })

export default SearchFormsPage
