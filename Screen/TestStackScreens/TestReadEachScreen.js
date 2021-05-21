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
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import AutoHeightImage from 'react-native-auto-height-image';

const TestReadEachScreen = ({route, navigation}) => {
  const {test_sn, test_title} = route.params;

  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [testpbdata, setTestpbdata] = useState([]); //각각 미니모의고사 안의 문제

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  //각 미니모의고사 안 문제
  //localhost:3001/api/test/list/download?test_sn=18&stu_id=samdol
  const getTestPbdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/test/list/download?' +
        new URLSearchParams({
          test_sn: test_sn,
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        console.log('====fetch return result====');
        console.log(responseJson.data.pbs_img);
        return responseJson.data.pbs_img;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };

  const getTestPbdataFull = async () => {
    setLoading(true);
    const userId = await getUserid();
    const testpbdata = await getTestPbdata(userId);
    setTestpbdata(testpbdata);
    setLoading(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>{test_title}</Text>,
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

  useEffect(() => {
    getTestPbdataFull();
  }, []);

  useEffect(() => {
    console.log('🦶🏻🦶🏻🦶🏻🦶🏻test pb data🦶🏻🦶🏻🦶🏻🦶🏻');
    console.log(testpbdata);
  }, [testpbdata]);

  const testPbItems = ({item, index}) => {
    return (
      <View nestedScrollEnabled={true} style={styles.item_container}>
        <View style={styles.item_title_pb}>
          <Text style={styles.ft_title2}>문제 {index + 1}</Text>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          contentInset={{top: 0}}
          style={styles.pb_container}>
          <AutoHeightImage source={{uri: item.pb_img}} width={wp(90)} />
        </ScrollView>

        <View style={styles.page_indicatorContainer}>
          <View style={styles.page_indicator}>
            <Text style={styles.ft_pageIC}>
              {index + 1} / {testpbdata.length}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />

      <FlatList
        style={styles.list}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        data={testpbdata}
        renderItem={testPbItems}
        keyExtractor={(item, index) => index.toString()}
      />
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
    paddingTop: wp(10),
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  item_title_pb: {
    flexDirection: 'row',
    paddingLeft: wp(4),
    paddingRight: wp(4),
    marginBottom: hp(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item_container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    // flexGrow: 0,
  },
  ft_title2: {
    fontSize: wp('4.5'),
    fontWeight: 'bold',
  },
  pb_container: {
    marginRight: wp(4),
    marginLeft: wp(4),
    marginBottom: hp(2),
    paddingTop: hp(1),
    width: wp(92),
    height: hp(25),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,0.3)',
  },

  page_indicatorContainer: {
    flex: 1.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  page_indicator: {
    backgroundColor: 'black',
    width: wp(20),
    height: wp(7),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ft_pageIC: {
    color: 'white',
    fontSize: wp(4),
  },
});

export default TestReadEachScreen;
