import React from 'react'
import { View, StatusBar, Platform } from 'react-native'

export default class DarkStatusBar extends React.Component {
  render() {
    const height = Platform.OS === 'ios' ? 20 : 0
    return (
      <View style={{backgroundColor: '#303030', height: height}}>
        <StatusBar
          barStyle = 'light-content'
          hidden = {false}
        />
      </View>
    )
  }
}

