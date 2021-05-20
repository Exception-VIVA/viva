import React, {useState, createRef, useLayoutEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const TestReadEachScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <Text style={styles.title}>미니 모의고사 문제보기</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            {
              navigation.goBack();
            }
          }}>
          <Icon
            name="chevron-back-outline"
            size={33}
            style={{paddingLeft: 10}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>this is TestReadScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topArea: {
    flex: 1,
    paddingTop: wp(2),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Text: {
    fontSize: wp('4%'),
    paddingBottom: wp('1%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },
});

export default TestReadEachScreen;
