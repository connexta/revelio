import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./3d-map'), {
  ssr: false,
})
export default Map
