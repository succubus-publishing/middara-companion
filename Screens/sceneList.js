import React from 'react'
import { Platform, Image, FlatList, View, Text, ScrollView, Slider, TouchableHighlight, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import KeepAwake from 'react-native-keep-awake'
import Sound from 'react-native-sound'
import Time from '../Components/time'
import Header from '../Components/header'
import Button from '../Components/button'
import DarkStatusBar from '../Components/darkStatusBar'
import BlueBar from '../Components/blueBar'
import GreyBar from '../Components/greyBar'

export default class SceneListScreen extends React.Component {
  constructor(props) {
    super(props)

    this.soundCache = []

    this.state = {
      currentScene: null,
      sliderValue: null,
      seconds: 0,
      playing: false,
      sceneLength: null,
      sceneList: null
    }

  }

  static navigationOptions = {
    title: 'SceneList',
  }

  componentDidMount() {
    KeepAwake.activate()
    this.props.navigation.addListener('willBlur', payload => {
      KeepAwake.deactivate()
      if(this.sound) {
        this.sound.stop()
        this.sound.release()
      }
      this.soundCache.map(entry => {
        entry.sound.stop()
        entry.sound.release()
      })
    })

    const version = this.props.navigation.getParam('version', 'novel')
    const adventure = this.props.navigation.getParam('adventure', {});
    const chapter = this.props.navigation.getParam('chapter', {});
    const sceneList = (version=='novel' ? adventure.full : adventure.abridged)[chapter-1]
    this.setState({
      sceneList: sceneList
    })
    this.baseUrl = 'https://middara-bc364.firebaseapp.com/adventures/'
      + adventure.directory + '/chapter-' + this._pad(chapter, 2)
      + (version==='novel' ? '/full/' : '/abridged/')


    this._prefetch(sceneList[0], false)
    this._prefetch(sceneList[1], false)
    this._prefetch(sceneList[2], false)
  }

  _prefetch(scene, shouldPlay) {
    for (var i=0, len = this.soundCache.length; i<len; i++) {
      if(this.soundCache[i].key === scene.key) return
    }

    if(shouldPlay) {
      if(this.sound) this.sound.stop()
      if(this.interval) clearInterval(this.interval)

      this.setState({
        currentScene: scene,
        sliderValue: null,
        seconds: 0,
        sceneLength: null,
        playing: false
      })
    }

    const sound = new Sound(this.baseUrl + scene.fileName, null, (error, sound) => {
      //console.log('loaded sound')
      //console.log(sound)
      if(error) {
        console.log('Failed to prefetch audio ', error)
        return
      }
      const entry = this.soundCache.find(x => x.key === scene.key)
      entry.loaded = true
      //console.log(entry)
      if(entry.shouldPlay) this._playSound(entry.sound, scene)
    }, {loadSync: true})

    this.soundCache.push({
      key: scene.key,
      sound: sound,
      loaded: false,
      shouldPlay: shouldPlay
    })

    if(this.soundCache.length > 5) {
      this.soundCache[0].sound.release()
      this.soundCache.splice(0, 1)
    }
  }

  _setInterval(sound) {
    if(this.interval) clearInterval(this.interval)
    this.interval = setInterval(() => {
      sound.getCurrentTime((seconds, playing) => {
        this.setState({
          seconds: Math.round(seconds)
        })
      })
    }, 250)
  }

  _playSound(sound, scene) {
    if(this.sound) {
      this.sound.stop()
    }

    console.log('_playSound')
    console.log(sound)
    console.log(scene)

    this.setState({
      currentScene: scene,
      seconds: 0
    })

    this._setInterval(sound)
    sound.play((success) => {
      clearInterval(this.interval)
      if(!success) {
        console.log('Playback failed')
      }
    })

    this.sound = sound

    this.setState({
      sceneLength: sound.getDuration(),
      playing: true
    })
  }

  _play(scene) {
    const cacheEntry = this.soundCache.find(x => x.key === scene.key)
    if(!cacheEntry) {
      this._prefetch(scene, true)
      return
    }
    if(!cacheEntry.loaded) {
      if(this.sound) this.sound.stop()
      if(this.interval) clearInterval(this.interval)

      this.setState({
        currentScene: scene,
        sliderValue: null,
        seconds: 0,
        sceneLength: null,
        playing: false
      })
      cacheEntry.shouldPlay = true
      return
    }

    this._playSound(cacheEntry.sound, scene)
  }

  async _rewind(val) {
    if(!this.sound) return

    this.sound.getCurrentTime((seconds, playing) => {
      this.sound.setCurrentTime(Math.max(0, seconds-10))
      this.setState({
        seconds: Math.max(0, val-10)
      })
    })
  }

  _skip(val) {
    if(!this.sound) return

    this.sound.getCurrentTime((seconds, playing) => {
      this.sound.setCurrentTime(Math.min(this.sound.getDuration(), seconds+10))
      this.setState({
        seconds: Math.min(this.sound.getDuration(), val+10)
      })
    })
  }

  _sliderComplete(val) {
    if(this.sound) {
      this.setState({
        sliderValue: null,
        seconds: val
      })

      this.sound.setCurrentTime(val)
    }
  }

  _sliderChange(val) {
    if(this.sound) {
      this.setState({
        sliderValue: val
      })
    }
  }

  _playPause(playing) {
    if(!this.sound) return

    if(playing) {
      this.sound.pause()
      clearInterval(this.interval)
    } else {
      this._setInterval(this.sound)
      this.sound.play((success) => {
        clearInterval(this.interval)
      })
    }
    this.setState({
      playing: playing ? false : true
    })
  }

  _pad(num, size) {
    var s = num+""
    while (s.length < size) {s = "0" + s};
    return s
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const version = this.props.navigation.getParam('version', 'novel')
    const adventure = this.props.navigation.getParam('adventure', {});
    const chapter = this.props.navigation.getParam('chapter', {});
    const baseUrl = 'https://middara-bc364.firebaseapp.com/adventures/'
      + adventure.directory + '/chapter-' + this._pad(chapter, 2)
      + (version==='novel' ? '/full/' : '/abridged/')

    return (
      <View style={{flex: 1}}>
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030'}}>
          <Header goBack={() => goBack()} />
          <GreyBar style={{flex: 3}}>
            <Text style={{
              fontFamily: 'Mentor Sans Std',
              fontSize: 14,
              color: '#fff',
              includeFontPadding: false,
              alignSelf: 'center',
              textAlign: 'center',
              textAlignVertical: 'bottom',
              zIndex: 10,
              margin: 4
            }}>
              {adventure.title}
            </Text>
          </GreyBar>
          <BlueBar style={{flex: 3}}>
            <Text style={{
              color: '#fff',
              fontFamily: 'Cinzel-Bold',
              fontSize: 16,
              zIndex: 10,
              alignSelf: 'center',
              margin: 8
            }}>
              Choose A Scene
            </Text>
          </BlueBar>
          <Image
            style={{
              position: 'absolute',
              top: '6%',
              alignSelf: 'flex-end',
              resizeMode: 'cover',
              justifyContent: 'flex-end',
              height: '100%',
              width: '100%',
            }}
            source={require('../assets/bg.png')}
          />
          <View style={{flex: 13, justifyContent: 'space-between'}}>
            <FlatList
              data={this.state.sceneList}
              keyExtractor={item => item.key.toString()}
              renderItem={({item}) => {
                return (
                <View>
                  <Button
                    style={{width: '100%', height: 60, justifyContent: 'center'}}
                    onPress={() => { 
                      this._play(item)
                      if(item.key+1 < this.state.sceneList.length)
                        this._prefetch(this.state.sceneList[item.key+1], false)
                      if(item.key+2 < this.state.sceneList.length)
                        this._prefetch(this.state.sceneList[item.key+2], false)
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Mentor Sans Std',
                      fontSize: 16,
                      color: '#5a3719',
                      top: Platform.OS === 'ios' ? '15%' : 0
                    }}>
                      {(item.key+1) + ' - ' + item.title}
                    </Text>
                  </Button>
                </View>
              )}}
            />
            <View style={{backgroundColor: '#555'}}>
              <View style={{}}>
                {this.state.currentScene &&
                  <Text style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontFamily: 'Mentor Sans Std',
                    fontSize: 12,
                    margin: 12,
                    marginBottom: 0
                  }}>
                    Currently playing: {this.state.currentScene.title}
                  </Text>
                }
                <View style={{backgroundColor: '#f9f9f9', margin: 12, padding: 8, borderRadius: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 6}}>
                      <Slider
                        minimumValue={0}
                        maximumValue={this.state.sceneLength}
                        value={this.state.sliderValue || this.state.seconds}
                        onSlidingComplete={val => { this._sliderComplete(val)}}
                        onValueChange={val => {this._sliderChange(val)}}
                      />
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={{flex: 1, margin: 6, justifyContent: 'center'}}>
                      <Time
                        seconds={this.state.sliderValue ? this.state.sliderValue : this.state.seconds}
                        style={{textAlign: 'center'}}
                      />
                    </View>
                    <TouchableHighlight
                      onPress={() => {
                        this._rewind(this.state.seconds)
                      }}
                      underlayColor='rgba(0,0,0,0)'
                      style={{margin: 6}}
                    >
                      <MaterialIcons name='replay-10' size={32} color='#666'/>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this._playPause(this.state.playing)
                      }}
                      underlayColor='rgba(0,0,0,0)'
                      style={{margin: 6}}
                    >
                      <Ionicons name={this.state.playing ? 'md-pause' : 'md-play'} size={32} color='#666'/>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this._skip(this.state.seconds)
                      }}
                      underlayColor='rgba(0,0,0,0)'
                      style={{margin: 6}}
                    >
                      <MaterialIcons name='forward-10' size={32} color='#666'/>
                    </TouchableHighlight>
                    <View style={{flex: 1, margin: 6, justifyContent: 'center'}}>
                      <Time seconds={this.state.sceneLength} style={{textAlign: 'center'}} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
