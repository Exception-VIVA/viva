import React, {useState, createRef, useEffect, useLayoutEffect} from 'react';

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
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import AutoHeightImage from 'react-native-auto-height-image';

import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';

import Swiper from 'react-native-swiper';

const IncorNoteReadScreen = ({route, navigation}) => {
  const {note_sn, note_name} = route.params;

  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [incorPbData, setIncorPbData] = useState([]);

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getIncorPbdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/incor-note-content?' +
        new URLSearchParams({
          stu_id: userId,
          note_sn: note_sn,
        }),
      {
        method: 'GET',
      },
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        // console.log('====fetch return result====');
        console.log(responseJson.data.pb_info);
        return responseJson.data.pb_info;
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
      headerTitle: () => <Text style={styles.ft_title}>{note_name}</Text>,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            {
              navigation.replace('Home');
            }
          }}>
          <Icon
            name="chevron-back-outline"
            size={33}
            style={{paddingLeft: 10}}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          // style={{paddingRight: 20}}
          onPress={() => {
            {
              //삭제가 필요한데
            }
          }}>
          <Icon name="trash-outline" size={30} style={{paddingRight: 15}} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const incorPbItems = ({item, index}) => {
    return (
      <View nestedScrollEnabled={true} style={styles.item_container}>
        <View style={styles.item_title}>
          <Text style={styles.ft_title2}>문제</Text>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          contentInset={{top: 0}}
          style={styles.pb_container}>
          <AutoHeightImage
            source={{uri: item.pb_img}}
            width={wp(92)}
            style={styles.pb_img}
          />
        </ScrollView>

        <View style={styles.item_title}>
          <Text style={styles.ft_title2}>답</Text>
        </View>

        <View style={styles.ans_container}>
          <Text style={{fontSize: wp(5)}}>{item.sol_ans}</Text>
        </View>

        <View style={styles.item_title}>
          <Text style={styles.ft_title2}>풀이</Text>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          contentInset={{top: 0}}
          style={styles.pb_container}>
          <AutoHeightImage
            source={{uri: item.sol_img}}
            width={wp(92)}
            style={styles.pb_img}
          />
        </ScrollView>

        <View style={styles.page_indicatorContainer}>
          <View style={styles.page_indicator}>
            <Text style={styles.ft_pageIC}>
              {index + 1} / {incorPbData.length}
            </Text>
          </View>
        </View>
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
          문제가 존재하지 않습니다.
        </Text>
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
        data={incorPbData}
        renderItem={incorPbItems}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={emptyPb}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexGrow: 0,
    backgroundColor: 'white',
    paddingTop: wp(4),
  },

  item_container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    // flexGrow: 0,
  },

  item_title: {
    paddingLeft: wp(4),
    paddingRight: wp(4),
    marginBottom: hp(1),
    height: hp(3),
    justifyContent: 'center',
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
  pb_img: {
    paddingTop: hp(1),
    // resizeMode: 'contain',
    // width: wp(84),
    // height: '100%',
    // justifyContent: 'flex-start',
  },

  ans_container: {
    justifyContent: 'center',
    paddingLeft: wp(3),
    marginRight: wp(4),
    marginLeft: wp(4),
    marginBottom: hp(2),
    width: wp(92),
    height: hp(5),
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
  ft_title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  ft_title2: {
    fontSize: wp('4.5'),
    fontWeight: 'bold',
  },
  ft_pageIC: {
    color: 'white',
    fontSize: wp(4),
  },

  emptyResult: {
    width: wp(100),
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IncorNoteReadScreen;
