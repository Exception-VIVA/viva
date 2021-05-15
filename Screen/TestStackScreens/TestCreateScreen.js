import React, {
  useState,
  createRe,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/dist/Ionicons';

const TestCreateScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <Text style={styles.title}>미니 모의고사 생성하기</Text>
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
      <View style={styles.topdesc}>
        <Text style={{fontSize: wp(4), fontWeight: 'bold'}}>
          난이도와 오답노트를 선택해주세요
        </Text>
        <Text style={{fontSize: wp(3.5), paddingTop: hp(1.5)}}>
          나의 오답노트를 기반으로,
        </Text>
        <Text style={{fontSize: wp(3.5), paddingTop: hp(0.5)}}>
          나만의 맞춤 미니 모의고사를 제공받을 수 있어요!
        </Text>
      </View>

      <View style={styles.levelcontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>난이도</Text>

        <View style={styles.btnContainer}>
          <View style={{height: 40, marginTop: hp(1)}}>
            <TouchableOpacity style={styles.btn}>
              <Text>상</Text>
            </TouchableOpacity>
          </View>

          <View style={{height: 40, marginTop: hp(1)}}>
            <TouchableOpacity style={styles.btn}>
              <Text>중</Text>
            </TouchableOpacity>
          </View>

          <View style={{height: 40, marginTop: hp(1)}}>
            <TouchableOpacity style={styles.btn}>
              <Text>하</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.notecontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>오답노트</Text>
      </View>

      <View style={styles.notecontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>
          미니모의고사 이름
        </Text>
      </View>
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
    // justifyContent: 'center',
  },

  title: {
    fontSize: wp(4),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
  topdesc: {
    justifyContent: 'center',
    marginTop: hp(3),
    height: hp(10),
    // backgroundColor: 'lightgrey',
  },
  levelcontainer: {
    justifyContent: 'space-around',
    marginTop: hp(3),
    height: hp(10),
    // backgroundColor: 'lightgrey',
  },
  btn: {
    flex: 1,
    width: wp(25),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '50%',
  },
  notecontainer: {
    justifyContent: 'space-around',
    marginTop: hp(3),
    height: hp(15),
    backgroundColor: 'lightgrey',
  },
});

export default TestCreateScreen;
