import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import Inspector from '../inspector'
import Thumbnail from '../../thumbnail/thumbnail'

const GalleryItem = props => {
  const { title, thumbnail } = props
  return (
    <Card>
      <CardActionArea
        onClick={props.onClick}
        style={{ height: '100%', padding: 10 }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Thumbnail src={thumbnail} style={{ maxHeight: '300px' }} />
          </div>
          <Typography style={{ fontSize: 14, marginTop: 10 }}>
            {title}
          </Typography>
        </div>
      </CardActionArea>
    </Card>
  )
}

export default props => {
  const [selected, setSelected] = React.useState(null)

  const results = props.results.filter(
    result => result.metacard.attributes.thumbnail !== undefined
  )

  return (
    <React.Fragment>
      {selected && (
        <Dialog open onClose={() => setSelected(null)}>
          <Inspector
            results={results.filter(
              result => result.metacard.attributes.id === selected
            )}
          />
        </Dialog>
      )}

      <div
        style={{
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridGap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // 'auto-fit' not IE11 compatible
            msGridColumns: 'repeat(3, 1fr)',
          }}
        >
          {results
            .filter(item => item.metacard.attributes.thumbnail)
            .map(result => {
              const { id, title, thumbnail } = result.metacard.attributes
              return (
                <GalleryItem
                  key={id}
                  title={title}
                  thumbnail={thumbnail}
                  onClick={() => setSelected(id)}
                />
              )
            })}
        </div>
      </div>
    </React.Fragment>
  )
}
