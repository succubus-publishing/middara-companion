import React from 'react'
import { View, StatusBar, Platform } from 'react-native'

export default class BlueBar extends React.Component {
  render() {
    return (
      <View style={this.props.style, {
        backgroundColor: 'rgba(1, 93, 110, 0.5)',
        zIndex: 4,
      }}>
          {this.props.children}
      </View>
      //b49971
      //2e7776
    )
  }
}

