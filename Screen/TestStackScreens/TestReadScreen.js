import React, {useState, createRef, useLayoutEffect, useEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import AutoHeightImage from 'react-native-auto-height-image';

const TestReadScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [incorPbData, setIncorPbData] = useState([]);

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  //미니모의고사 가져오기
  //localhost:3001/api/test/list?stu_id=samdol
  const getIncorPbdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/test/list?' +
        new URLSearchParams({
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        // console.log('====fetch return result====');
        // console.log(responseJson);
        return responseJson.data.test_list;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };

  const getIncorPbdataFull = async () => {
    setLoading(true);
    const userId = await getUserid();
    const incorpbData = await getIncorPbdata(userId);

    setIncorPbData(incorpbData);
    setLoading(false);
  };

  useEffect(() => {
    getIncorPbdataFull();
  }, []);

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

  const incorPbItems = ({item}) => {
    return (
      <View style={styles.resultitem_container}>
        <Loader loading={loading} />

        <View style={styles.resultitem_title}>
          <Text style={{fontSize: wp(4.5)}}>{item.test_title}</Text>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                // setDelPbindex(index);
                // delNoterefRBSheet.current.open();
              }
            }}>
            <Icon name="file-tray-full-outline" size={25} />
          </TouchableOpacity>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                // setDelPbindex(index);
                // delNoterefRBSheet.current.open();
              }
            }}>
            <Icon name="trash-outline" size={25} />
          </TouchableOpacity>
        </View>

        {/*<View style={styles.info_bottom}>*/}
        {/*  <TouchableOpacity*/}
        {/*    style={[styles.btn]}*/}
        {/*    onPress={() => {*/}
        {/*      {*/}
        {/*        setCurrentWorkbooksn(item.workbook_sn);*/}
        {/*        refRBSheet.current.open();*/}
        {/*      }*/}
        {/*    }}>*/}
        {/*    <Text*/}
        {/*      style={{*/}
        {/*        color: 'white',*/}
        {/*        fontSize: wp('3.5'),*/}
        {/*        fontWeight: 'bold',*/}
        {/*      }}>*/}
        {/*      삭제*/}
        {/*    </Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
      </View>
    );
  };

  const emptyPb = () => {
    return (
      <View style={styles.emptyResult}>
        <Icon
          name="warning-outline"
          size={wp(10)}
          style={{height: hp(8), color: 'grey'}}
        />
        <Text style={{fontSize: wp(4), color: 'grey'}}>
          생성된 미니모의고사가 없습니다.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          horizontal={false}
          data={incorPbData}
          renderItem={incorPbItems}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={emptyPb}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },

  emptyResult: {
    width: wp(100),
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    // flexGrow: 0,
  },
  resultitem_container: {
    flex: 1,
    flexDirection: 'row',
    height: hp(9),
    width: wp(100),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    paddingLeft: wp(10),
    paddingRight: wp(10),

    ...Platform.select({
      android: {
        width: '100%',
        height: hp(27),
      },
    }),
  },
  resultitem_title: {
    width: wp(63),
  },
  btn_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(10),
    marginLeft: 2,
  },
});

export default TestReadScreen;
