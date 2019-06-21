import React from 'react'
import { SafeAreaView, View, WebView } from 'react-native'
import Header from '../Components/header'
import DarkStatusBar from '../Components/darkStatusBar'

export default class AdventureInfoScreen extends React.Component {
  static navigationOptions = {
    title: 'AdventureInfo',
  }

  componentDidMount() {
    this.props.navigation.addListener('willBlur', payload => {
      if(payload.action.type === "Navigation/BACK") {
        global.backgroundMusic.fadeIn()
      }
    })
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const url = this.props.navigation.getParam('url', null)
    return (
      <View style={{flex: 1}}>
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030'}}>
          <Header goBack={() => goBack()} />
          <View style={{flex: 13}}>
            <WebView
              source={{uri: url}}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}


