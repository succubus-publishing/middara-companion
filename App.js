import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { createAppContainer, createStackNavigator } from 'react-navigation'

import TitleScreen from './Screens/title'
import VersionScreen from './Screens/version'
import AdventureListScreen from './Screens/adventureList'
import ChapterListScreen from  './Screens/chapterList'
import SceneListScreen from  './Screens/sceneList'
import AdventureInfoScreen from './Screens/adventureInfo'

const AppNavigator = createStackNavigator({
	Title: TitleScreen,
  Version: VersionScreen,
  AdventureList: AdventureListScreen,
  AdventureInfo: AdventureInfoScreen,
  ChapterList: ChapterListScreen,
  SceneList: SceneListScreen
},
{
  headerMode: 'none'
})

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
	margin: '10%',
  },
})
