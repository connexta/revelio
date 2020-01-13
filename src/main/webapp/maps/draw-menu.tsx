import * as React from 'react'
import { Box, Button } from '@material-ui/core'
import { ToggleButton } from '@material-ui/lab'
import {
  BboxIcon,
  CircleIcon,
  LineIcon,
  PolygonIcon,
  PointIcon,
  EditCoordinatesIcon,
} from './icons'
import { shapes, geometry, menu, drawing } from 'geospatialdraw'

type Props = React.HTMLProps<HTMLDivElement> & {
  toolbox: drawing.DrawingToolbox
  shape: shapes.Shape | null
  isActive: boolean
  showCoordinateEditor?: boolean
  saveAndContinue?: boolean
  title?: string
  geometry: geometry.GeometryJSON | null
  toggleCoordinateEditor?: () => void
  onCancel: () => void
  onOk: () => void
  onSetShape: (shape: shapes.Shape) => void
  onUpdate: (geo: geometry.GeometryJSON) => void
  disabledShapes?: shapes.Shape[]
  defaultGeoProperties?: object
  iconColor?: string
}

const invisibleContainer = {
  display: 'none',
}
const backgroundContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  paddingBottom: 1,
}
const TitleContainer: React.SFC = props => (
  <Box
    display="flex"
    flexDirection="grow"
    flexGrow={1}
    flexShrink={1}
    height="100%"
    {...props}
  />
)
const ControlsGroup: React.SFC = props => (
  <Box
    height="100%"
    padding={0}
    margin={0}
    display="flex"
    flexDirection="row"
    alignItems="right"
    flex="0 0 auto"
    {...props}
  />
)
const shapeContainer = {
  height: '100%',
  display: 'flex',
}
const toolsContainer = {
  height: '100%',
  display: 'flex',
}
const Title: React.SFC = props => (
  <Box
    fontWeight="bold"
    alignSelf="center"
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    flex="0 1 auto"
    {...props}
  />
)
const TitleLabel: React.SFC = props => (
  <Box
    paddingLeft={1}
    paddingRight={0.5}
    alignSelf="center"
    flex="0 0 auto"
    {...props}
  />
)

const DrawingMenu: React.SFC<Props> = ({
  toolbox,
  shape,
  isActive,
  geometry,
  onCancel,
  onOk,
  onSetShape,
  onUpdate,
  title,
  saveAndContinue,
  showCoordinateEditor,
  toggleCoordinateEditor,
  disabledShapes,
  defaultGeoProperties,
  iconColor = '#FFFFFF',
  ...rest
}) => {
  menu.useDrawingMenu({
    toolbox,
    shape,
    isActive,
    geometry,
    onUpdate,
    showCoordinateEditor,
    defaultGeoProperties,
  })
  const renderShapeButton = (renderedShape: shapes.Shape, icon: any) => {
    return disabledShapes && disabledShapes.includes(renderedShape) ? null : (
      <ToggleButton
        radioGroup="shape"
        selected={shape === renderedShape}
        onClick={() => onSetShape(renderedShape)}
        value={renderedShape}
        title={`Draw ${renderedShape}`}
      >
        {icon}
      </ToggleButton>
    )
  }
  const backgroundStyle = isActive ? backgroundContainer : invisibleContainer
  const acceptEditButton = saveAndContinue ? 'Next' : 'Apply'
  const acceptEditAlt = saveAndContinue
    ? 'Save And Continue Drawing'
    : 'Accept Edit'
  return (
    <Box style={backgroundStyle} {...rest}>
      <TitleContainer>
        {title === undefined ? null : (
          <React.Fragment>
            <TitleLabel>Editing Shape:</TitleLabel>
            <Title>{title}</Title>
          </React.Fragment>
        )}
      </TitleContainer>
      <ControlsGroup>
        <Box style={shapeContainer}>
          {renderShapeButton(shapes.LINE, <LineIcon color={iconColor} />)}
          {renderShapeButton(shapes.POLYGON, <PolygonIcon color={iconColor} />)}
          {renderShapeButton(
            shapes.BOUNDING_BOX,
            <BboxIcon color={iconColor} />
          )}
          {renderShapeButton(
            shapes.POINT_RADIUS,
            <CircleIcon color={iconColor} />
          )}
          {renderShapeButton(shapes.POINT, <PointIcon color={iconColor} />)}
        </Box>
        {showCoordinateEditor === undefined ||
        toggleCoordinateEditor === undefined ? null : (
          <Box style={toolsContainer}>
            <ToggleButton
              selected={showCoordinateEditor}
              onClick={toggleCoordinateEditor}
              title="Edit Coordinates"
            >
              <EditCoordinatesIcon color={iconColor} />
            </ToggleButton>
          </Box>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          title="Cancel Edit"
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={onOk}
          title={acceptEditAlt}
        >
          {acceptEditButton}
        </Button>
      </ControlsGroup>
    </Box>
  )
}

export default DrawingMenu
