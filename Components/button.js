import React from 'react'
import { Image, View, TouchableHighlight, StyleSheet } from 'react-native'

export default class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false
    }
  }

  render () {
    return (
      <TouchableHighlight
        style={this.props.style}
        underlayColor='rgba(0,0,0,0)'
        onPress={this.props.onPress}
        onHideUnderlay={() => {this.setState({pressed: false})}}
        onShowUnderlay={() => {this.setState({pressed: true})}}
      >
        <View style={this.props.style, {justifyContent: 'center'}}>
          {this.state.pressed ? 
            (<Image
              style={{
                position: 'absolute',
                alignSelf: 'center',
                resizeMode: 'contain',
                width: this.props.style.width,
                height: this.props.style.height
              }}
              source={require('../assets/blank-button-pressed.png')}
            />)
            :
            (<Image
              style={{
                position: 'absolute',
                resizeMode: 'contain',
                alignSelf: 'center',
                width: this.props.style.width,
                height: this.props.style.height
              }}
              source={require('../assets/blank-button.png')}
            />)
          }
          <View style={{alignSelf: 'center'}}>
            {this.props.children}
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

