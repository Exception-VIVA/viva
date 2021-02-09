import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/dist/Ionicons';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import HomeScreen from './Screen/HomeStackScreens/HomeScreen';
import SearchScreen from './Screen/HomeStackScreens/SearchScreen';
import SearchResultScreen from './Screen/HomeStackScreens/SearchResultScreen';
import MyBookScreen from './Screen/HomeStackScreens/MyBookScreen';
import AcademyBookScreen from './Screen/HomeStackScreens/AcademyBookScreen';
import IncorNoteScreen from './Screen/HomeStackScreens/IncorNoteScreen';
import IncorNoteReadScreen from './Screen/HomeStackScreens/IncorNoteReadScreen';
import MarkScreen from './Screen/HomeStackScreens/MarkScreen';
import MarkResultScreen from './Screen/HomeStackScreens/MarkResultScreen';
import MarkResultSaveScreen from './Screen/HomeStackScreens/MarkResultSaveScreen';

import TestCreateScreen from './Screen/TestStackScreens/TestCreateScreen';
import TestReadScreen from './Screen/TestStackScreens/TestReadScreen';
import ProfileScreen from './Screen/SettingStackScreens/ProfileScreen';
import ProfileEditScreen from './Screen/SettingStackScreens/ProfileEditScreen';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Stack = createStackNavigator();
const TestStack = createStackNavigator();
const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();
const Tab = createBottomTabNavigator();

//뒤로 가기 버튼 Image 컴포넌트
function BackBtn() {
  return (
    <Image
      source={require('./src/back-btn.png')}
      style={{marginLeft: 10, width: 22, height: 22}}
    />
  );
}

function LogoTitle() {
  return (
    <Image
      style={{width: 50, height: 50}}
      source={require('./src/viva-header-logo.png')}
    />
  );
}

//nested navigator(tab)에서 각 스크린의 헤더이름을 찾아주기 위해
function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? 'HomeStack';
}

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <HomeStack.Screen
        name="Home"
        options={({navigation, route}) => ({
          headerTitle: '',
          headerRight: () => (
            <TouchableOpacity
              style={{paddingRight: 20}}
              onPress={() => navigation.navigate('Search')}>
              <Icon name="search-outline" size={25} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <Image
              style={{width: wp(33), height: hp(3.5), resizeMode: 'contain'}}
              source={require('./src/viva-header-logo.png')}
            />
          ),
        })}
        component={HomeScreen}
      />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="SearchResult" component={SearchResultScreen} />
      <HomeStack.Screen name="MyBook" component={MyBookScreen} />
      <HomeStack.Screen name="AcademyBook" component={AcademyBookScreen} />
      <HomeStack.Screen name="IncorNote" component={IncorNoteScreen} />
      <HomeStack.Screen name="IncorNoteRead" component={IncorNoteReadScreen} />
      <HomeStack.Screen name="Mark" component={MarkScreen} />
      <HomeStack.Screen name="MarkResult" component={MarkResultScreen} />
      <HomeStack.Screen
        name="MarkResultSave"
        component={MarkResultSaveScreen}
      />
    </Stack.Navigator>
  );
};

const SettingStackScreen = () => {
  return (
    <Stack.Navigator>
      <SettingStack.Screen name="Profile" component={ProfileScreen} />
      <SettingStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
};

const TestStackScreen = () => {
  return (
    <Stack.Navigator>
      <TestStack.Screen name="TestCreate" component={TestCreateScreen} />
      <TestStack.Screen name="TestRead" component={TestReadScreen} />
    </Stack.Navigator>
  );
};

const MainTabScreen = ({navigation, route}) => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'TestStack') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SettingStack') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'lightgray',
        showLabel: false,
      }}>
      <Tab.Screen name="TestStack" component={TestStackScreen} />
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="SettingStack" component={SettingStackScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator for Login and Register and Logout Screen
const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackImage: BackBtn,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackImage: BackBtn,
        }}
      />
    </Stack.Navigator>
  );
};

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTab"
          // options={({route}) => ({
          //   headerTitle: getHeaderTitle(route),
          // })}
          component={MainTabScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
