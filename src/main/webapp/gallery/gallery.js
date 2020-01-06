import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Inspector } from '../inspector'

const GalleryItem = props => {
  const { title, thumbnail } = props
  return (
    <Card
      style={{
        margin: 20,
        cursor: 'pointer',
      }}
    >
      <CardActionArea onClick={props.onClick}>
        <div
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={`data:image/jpeg;base64,${thumbnail}`} />
          <Typography>{title}</Typography>
        </div>
      </CardActionArea>
    </Card>
  )
}

export default props => {
  const [selected, setSelected] = React.useState(null)

  const results = props.results.filter(
    result => result.metacard.properties.thumbnail !== undefined
  )

  return (
    <React.Fragment>
      {selected && (
        <Dialog open onClose={() => setSelected(null)}>
          <Inspector
            results={results.filter(
              result => result.metacard.properties.id === selected
            )}
          />
        </Dialog>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {results.map(result => {
          const { id, title, thumbnail } = result.metacard.properties

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
    </React.Fragment>
  )
}
