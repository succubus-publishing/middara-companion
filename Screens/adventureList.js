import React from 'react'
import { Image, StyleSheet, View, Text, Button, ScrollView, TouchableHighlight, SafeAreaView } from 'react-native'
import FastImage from 'react-native-fast-image'
import Sound from 'react-native-sound'
import MoreInfo from '../Components/moreInfo'
import Header from '../Components/header'
import DarkStatusBar from '../Components/darkStatusBar'
import GreyBar from '../Components/greyBar'

export default class AdventureListScreen extends React.Component {
  static navigationOptions = {
    title: 'AdventureList',
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const version = this.props.navigation.getParam('version', 'novel');

    if(!global.adventures) {
      return (
      <View style={{flex: 1}}>
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030', flexDirection: 'column'}}>
          <Header goBack={() => goBack()} />
          <Image
            style={{
              position: 'absolute',
              top: '6%',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              resizeMode: 'cover',
              height: '100%',
              width: '100%',
            }}
            source={require('../assets/bg.png')}
          />
          <View style={{flex: 13}}>
            <Text style={{ fontFamily: 'Mentor Sans Std', fontSize: 16, color: '#fff',}}>
              Please connect to a network
            </Text>
          </View>
        </SafeAreaView>
      </View>
      )
    }

    return (
      <View style={{flex: 1}}>
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030', flexDirection: 'column'}}>
          <Header goBack={() => goBack()} />
          <GreyBar style={{flex: 3}}>
            <Text style={{
              fontFamily: 'Mentor Sans Std',
              fontSize: 16,
              color: '#fff',
              includeFontPadding: false,
              alignSelf: 'center',
              textAlign: 'center',
              textAlignVertical: 'bottom',
              zIndex: 10,
              margin: 8
            }}>
              {/*(version === 'novel') ? 'FULL VERSION' : 'ABRIDGED VERSION'*/}
              Choose An Adventure
            </Text>
          </GreyBar>
          <Image
            style={{
              position: 'absolute',
              top: '6%',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              resizeMode: 'cover',
              height: '100%',
              width: '100%',
            }}
            source={require('../assets/bg.png')}
          />
          <View style={{flex: 13}}>
            <ScrollView style={{flex: 1}}>
              {global.adventures.map((adventure, index) => 
                <View
                  key={index}
                  style={{
                    padding: 5,
                    paddingBottom: 0,
                  }}
                >
                  <TouchableHighlight
                    style={{flex: 0}}
                    onPress={() => {
                      if(adventure.numChapters) {
                        //console.log(adventure)
                        //console.log(version)
                        global.backgroundMusic.fadeOut()
                        navigate('ChapterList', { adventure: adventure, version: version })
                      }
                    }}
                    underlayColor={'rgba(0,0,0,0)'}
                  >
                    <View style={{flex: 1, alignItems: 'center'}}>
                      {(adventure.builtinImg) ? //TODO: this is a hack to work around FastImage prefetch bug for now
                        (<Image
                          style={{
                            resizeMode: 'contain',
                            height: 120,
                            width: 300
                          }}
                          source={adventure.img}
                        />)
                        :
                        (<FastImage
                          style={{
                            height: 120,
                            width: 300
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                          source={{uri: adventure.uri}}
                        />) }
                      {!adventure.numChapters &&
                      (<View style={{
                        position: 'absolute',
                        height: '100%',
                        width: 300,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Image
                          style={{
                            position: 'absolute',
                            height: '50%',
                            left: '5%',
                            width: 60,
                            resizeMode: 'contain'
                          }}
                          source={require('../assets/adventure/lock.png')}
                        />
                      </View>)}
                      <View style={{position: 'absolute', width: 300, bottom: '8%', alignItems: 'center'}}>
                        <MoreInfo
                          onPress={() => {
                            if(adventure.infoUrl) {
                              global.backgroundMusic.fadeOut()
                              navigate('AdventureInfo', { url: adventure.infoUrl })
                            }
                          }}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2%',
  },
  itemTitle: {
    fontSize: 18,
    alignSelf: 'flex-end'
  },
  itemSubtitle: {
    fontSize: 10,
    alignSelf: 'flex-end'
  },
  itemIcon: {
    width: '25%'
  },
  itemDesc: {
    width: '75%'
  },
});

