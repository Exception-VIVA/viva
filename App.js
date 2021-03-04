import React, {useLayoutEffect} from 'react';
import FlashMessage from 'react-native-flash-message';

import {Image, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';

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

import BackBtn from './Screen/Components/BackBtn';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const TestStack = createStackNavigator();
const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();
const Tab = createBottomTabNavigator();

//뒤로 가기 버튼 Image 컴포넌트
// function BackBtn() {
//   return (
//     <Image
//       source={require('./src/back-btn.png')}
//       style={{marginLeft: 10, width: 22, height: 22}}
//     />
//   );
// }

const HomeStackScreen = ({navigation, route}) => {
  const getrouteName = async () => {
    const routeName = await getFocusedRouteNameFromRoute(route);
    // console.log('==routeName==');
    // console.log(routeName);

    if (routeName === 'Home' || routeName === undefined) {
      navigation.setOptions({tabBarVisible: true});
    } else {
      navigation.setOptions({tabBarVisible: false});
    }
    return routeName;
  };

  useLayoutEffect(() => {
    const routeName = getrouteName();
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <HomeStack.Screen
        name="Home"
        options={({navigation, route}) => ({
          headerTitle: '',
          headerLeft: () => (
            <Image
              style={{width: wp(33), height: hp(3.5), resizeMode: 'contain'}}
              source={require('./src/viva-header-logo.png')}
            />
          ),
          tabBarVisible: true,
        })}
        component={HomeScreen}
      />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="SearchResult" component={SearchResultScreen} />
      <HomeStack.Screen name="MyBook" component={MyBookScreen} />
      <HomeStack.Screen name="AcademyBook" component={AcademyBookScreen} />
      <HomeStack.Screen name="IncorNote" component={IncorNoteScreen} />
      <HomeStack.Screen name="IncorNoteRead" component={IncorNoteReadScreen} />
      <HomeStack.Screen
        name="Mark"
        component={MarkScreen}
        options={({navigation, route}) => ({
          headerTransparent: true,
          headerTitle: '',
        })}
      />
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
      <SettingStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation, route}) => ({
          // headerTransparent: true,
        })}
      />
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
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
