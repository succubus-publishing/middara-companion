import React from 'react'
import { Image, View, TouchableHighlight, StyleSheet } from 'react-native'

export default class MoreInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false
    }
  }

  render () {
    return (
      <TouchableHighlight
        style={{flex: 1, width: 220, left: '10%'}}
        onPress={this.props.onPress}
        underlayColor={'rgba(0,0,0,0)'}
        onHideUnderlay={() => {this.setState({pressed: false})}}
        onShowUnderlay={() => {this.setState({pressed: true})}}
      >
        {this.state.pressed ?
        (<Image
          style={{
            resizeMode: 'contain',
            height: 20,
            width: 220,
          }}
          source={require('../assets/adventure/more-info-pressed.png')}
        />)
        :
        (<Image
          style={{
            resizeMode: 'contain',
            height: 20,
            width: 220,
          }}
          source={require('../assets/adventure/more-info.png')}
        />)}
      </TouchableHighlight>
    )
  }
}

