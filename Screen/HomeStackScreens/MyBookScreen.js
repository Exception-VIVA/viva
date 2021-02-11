import React, {useState, useEffect, useLayoutEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RNRestart from 'react-native-restart';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const MyBookScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [workbookData, setWorkbookData] = useState([]);
  const [isClick, setIsClick] = useState(false); //to re-render

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getWorkbookdata = async (userId) => {
    const response = await fetch(
      'http://192.168.0.4:3001/api/home/workbook?' +
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
        return responseJson.data.bookInfo;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };

  //assemble multi Apifetch functions
  const getMultidata = async () => {
    const userId = await getUserid();
    const workbookdata = await getWorkbookdata(userId);
    setWorkbookData(workbookdata);
    // setLoading(false);
  };

  const delBookFull = async (workbook_sn) => {
    const userId = await getUserid();
    const what = await delBook(userId, workbook_sn);
    const workbookdata = await getWorkbookdata(userId);
    setWorkbookData(workbookdata);
  };

  //localhost:3001/api/book-list/workbook/'삭제할 workbook_sn'?stu_id=samdol
  const delBook = (stuId, workbook_sn) => {
    console.log('****stuId****');
    console.log(stuId);
    console.log('****workbook_sn****');
    console.log(workbook_sn);

    console.log(
      'http://192.168.0.4:3001/api/book-list/workbook' +
        '/' +
        workbook_sn +
        '?' +
        new URLSearchParams({
          stu_id: stuId,
        }),
    );

    fetch(
      'http://192.168.0.4:3001/api/book-list/workbook' +
        '/' +
        workbook_sn +
        '?' +
        new URLSearchParams({
          stu_id: stuId,
        }),
      {
        method: 'DELETE',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        // setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('deleting book is Successful.');
        } else {
          console.log('deleting book is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    // setLoading(true);
    getMultidata();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>내 문제집</Text>,
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
              navigation.navigate('Search');
            }
          }}>
          <Icon name="add-circle" size={30} style={{paddingRight: 15}} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const resultBookItems = ({item}) => {
    return (
      <View style={styles.resultitem_container}>
        <Loader loading={loading} />
        <View style={styles.resultitem_book_container}>
          <View style={styles.book}>
            <Image source={{uri: item.workbook_photo}} style={styles.bookimg} />
          </View>
        </View>

        <View style={styles.resultitem_info_container}>
          <View style={styles.info_top}>
            <Text style={{fontSize: wp(4.5)}}>{item.workbook_title}</Text>
          </View>
          <View style={styles.info_bottom}>
            <TouchableOpacity
              style={[styles.btn]}
              onPress={() => {
                {
                  delBookFull(item.workbook_sn);
                }
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: wp('4%'),
                  fontWeight: 'bold',
                }}>
                삭제
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const emptyBook = () => {
    return (
      <View style={styles.emptyResult}>
        <Icon
          name="warning-outline"
          size={wp(10)}
          style={{height: hp(8), color: 'grey'}}
        />
        <Text style={{fontSize: wp(4), color: 'grey'}}>
          내 문제집이 존재하지 않습니다.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <View>
          <FlatList
            style={styles.list}
            horizontal={false}
            data={workbookData}
            renderItem={resultBookItems}
            keyExtractor={(item, index) => index.toString()}
            // ListEmptyComponent={emptyBook()}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },

  resultitem_container: {
    flex: 1,
    flexDirection: 'row',
    height: hp(25),
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    padding: wp(7),

    ...Platform.select({
      android: {
        width: '100%',
        height: hp(27),
      },
    }),
  },
  resultitem_book_container: {
    flex: 1,
  },
  resultitem_info_container: {
    flex: 2,
    flexDirection: 'column',
  },
  info_top: {
    paddingLeft: wp(4),
    flex: 5,
  },
  info_bottom: {
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  book: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 5,
    shadowColor: '#000',

    elevation: 7,

    ...Platform.select({
      ios: {
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.15,
        shadowRadius: 9.51,
      },
      android: {
        overflow: 'visible',
      },
    }),
  },
  bookimg: {
    resizeMode: 'cover',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
      },
      android: {
        width: '100%',
        height: hp(20),
      },
    }),
  },
  btn: {
    width: wp(25),
    height: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  grey: {
    backgroundColor: '#C1C2CA',
  },

  emptyResult: {
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyBookScreen;
