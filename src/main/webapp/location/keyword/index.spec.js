import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow, mount } from 'enzyme'

configure({ adapter: new Adapter() })

import { expect } from 'chai'
import { geometry, shapes } from 'geospatialdraw'
import React, { useState } from 'react'
import Keyword from '.'

const makeKeywordWithMockQueries = inspector => ({ value, ...rest }) => {
  const [featureLoading, setFeatureLoading] = useState(false)
  const [featureData, setFeatureData] = useState(value)
  const useFeatureQuery = () => ({
    fetch: () => {
      setFeatureLoading(true)
      inspector.respondToFeatureQuery = () => {
        setFeatureLoading(false)
        setFeatureData({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-77.3811, 42.5304],
                [-77.1811, 42.5304],
                [-77.1811, 42.7304],
                [-77.3811, 42.7304],
                [-77.3811, 42.5304],
              ],
            ],
          },
          properties: {},
          id: 'Italy Valley Cemetery',
        })
      }
    },
    data: featureData,
    loading: featureLoading,
    error: false,
  })
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const useSuggestionQuery = () => ({
    fetch: () => {
      inspector.a = true
      setSuggestionLoading(true)
      inspector.respondToSuggestionQuery = () => {
        setSuggestionLoading(false)
        setSuggestions([
          {
            id: '1dc06d71-dc20-44d5-b211-de33816071c1',
            name: 'Italy',
          },
          {
            id: 'c0ab17cc-cc60-4a15-9860-3915aa9f0afb',
            name: 'Italy Valley Cemetery',
          },
          {
            id: 'cff9dea4-2e5e-4c03-9f5b-45495c638e78',
            name: 'Italy Hill Cemetery',
          },
          {
            id: '19e138c6-03df-47ea-a657-17b5cd2932df',
            name: 'Italy Post Office',
          },
          {
            id: '9573742f-dd27-4f25-ac83-25250269f469',
            name: 'Italy Police Department',
          },
          {
            id: 'cdbcd443-c987-489e-9e01-da21e82bc9a3',
            name: 'Italy Naples Church',
          },
          {
            id: '0816671b-4ce5-45c9-a045-8f83451bcbd5',
            name: 'Italy Division',
          },
          {
            id: 'd0ef5f36-681a-4cb6-90cc-1f344e594100',
            name: 'Italy Mine',
          },
          {
            id: '07f74c89-a7b2-4bf9-87fa-22d7d21a6ef4',
            name: 'Italy Mine',
          },
          {
            id: '75b3f19c-0872-466c-ad89-c051e832362e',
            name: 'Italy Hollow Cemetery',
          },
        ])
      }
    },
    data: suggestions,
    loading: suggestionLoading,
    error: false,
  })
  return (
    <Keyword
      useFeatureQuery={useFeatureQuery}
      useSuggestionQuery={useSuggestionQuery}
      value={value}
      {...rest}
    />
  )
}

describe('<Keyword />', () => {
  it('render', () => {
    const wrapper = shallow(
      <Keyword
        value={geometry.makeEmptyGeometry('keyword', shapes.POLYGON)}
        onChange={() => {}}
      />
    )
    expect(wrapper.exists()).to.equal(true)
  })
  describe('ajax', () => {
    const inspector = {
      respondToFeatureQuery: () => {},
      respondToSuggestionQuery: () => {},
    }
    let changes
    let wrapper
    let presentation
    const onChange = value => {
      wrapper.setProps({ value })
      changes.push(JSON.parse(JSON.stringify(value)))
    }
    beforeEach(() => {
      changes = []
      const value = geometry.makeEmptyGeometry('keyword', shapes.POLYGON)
      const KeywordWithMockQueries = makeKeywordWithMockQueries(inspector)
      wrapper = mount(
        <KeywordWithMockQueries
          minimumInputLength={5}
          value={value}
          onChange={onChange}
        />
      )
      presentation = () => {
        wrapper.update()
        return wrapper.find('Keyword')
      }
    })
    it('AJAX is only triggered after minimumInputLength reached', () => {
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('onOpen')()
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('getSuggestions')('1')
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('getSuggestions')('12')
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('getSuggestions')('123')
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('getSuggestions')('1234')
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('getSuggestions')('12345')
      expect(presentation().prop('loading')).to.equal(true)
    })
    it('closing suggestions without selecting one restores current selection text', () => {
      expect(changes.length).to.equal(0)
      expect(presentation().prop('value').properties.keyword).to.equal('')
      presentation().prop('onOpen')()
      presentation().prop('getGeoFeature')({ name: 'test', id: 'test-id' })
      presentation().prop('onClose')()
      inspector.respondToFeatureQuery()
      expect(changes.length).to.equal(1)

      presentation().prop('onOpen')()
      presentation().prop('getSuggestions')('1234567890')
      expect(presentation().prop('value').properties.keyword).to.equal(
        '1234567890'
      )
      inspector.respondToFeatureQuery()
      presentation().prop('onClose')()
      expect(changes.length).to.equal(1)
      expect(presentation().prop('value').properties.keyword).to.equal('test')
    })
    it('searching for suggestions shows loading indicator', () => {
      presentation().prop('onOpen')()
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('getSuggestions')('12345')
      expect(presentation().prop('loading')).to.equal(true)
      inspector.respondToSuggestionQuery()
      expect(presentation().prop('loading')).to.equal(false)
    })
    it('retrieving feature shows loading indicator', () => {
      expect(presentation().prop('loading')).to.equal(false)
      presentation().prop('onOpen')()
      presentation().prop('getGeoFeature')({ name: 'test', id: 'test-id' })
      presentation().prop('onClose')()
      expect(presentation().prop('loading')).to.equal(true)
      inspector.respondToFeatureQuery()
      expect(presentation().prop('loading')).to.equal(false)
    })
    describe('onChange', () => {
      it('onChange is only triggered when result is selected', () => {
        presentation().prop('onOpen')()
        expect(changes.length).to.equal(0)
        presentation().prop('getSuggestions')('1234567890')
        expect(changes.length).to.equal(0)
        presentation().prop('getGeoFeature')({ name: 'test', id: 'test-id' })
        presentation().prop('onClose')()
        inspector.respondToFeatureQuery()
        expect(changes.length).to.equal(1)

        expect(changes[0].properties.keyword).to.equal('test')
        expect(changes[0].properties.keywordId).to.equal('test-id')
      })
      it('changing buffer propagates onChange event & preserves keyword properties', () => {
        presentation().prop('onOpen')()
        presentation().prop('getSuggestions')('1234567890')
        inspector.respondToSuggestionQuery()
        presentation().prop('getGeoFeature')({ name: 'test', id: 'test-id' })
        presentation().prop('onClose')()
        inspector.respondToFeatureQuery()
        const value = wrapper.prop('value')
        presentation().prop('onChange')({
          ...value,
          properties: {
            ...value.properties,
            buffer: {
              width: 50,
              unit: geometry.MILES,
            },
          },
        })
        expect(changes.length).to.equal(2)
        expect(changes[0].properties.keyword).to.equal('test')
        expect(changes[0].properties.keywordId).to.equal('test-id')
        expect(changes[0].properties.buffer.width).to.equal(0)
        expect(changes[0].properties.buffer.unit).to.equal(geometry.METERS)
        expect(changes[1].properties.keyword).to.equal('test')
        expect(changes[1].properties.keywordId).to.equal('test-id')
        expect(changes[1].properties.buffer.width).to.equal(50)
        expect(changes[1].properties.buffer.unit).to.equal(geometry.MILES)
      })
    })
  })
})
