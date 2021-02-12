import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage, hideMessage} from 'react-native-flash-message';

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
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const MyBookScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const [loading, setLoading] = useState(false);
  const [workbookData, setWorkbookData] = useState([]);
  const [isClick, setIsClick] = useState(false); //to re-render
  const [currentWorkbooksn, setCurrentWorkbooksn] = useState('');
  const refRBSheet = useRef();

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getWorkbookdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/workbook?' +
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

    showMessage({
      message: '선택한 문제집이 삭제되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  //localhost:3001/api/book-list/workbook/'삭제할 workbook_sn'?stu_id=samdol
  const delBook = (stuId, workbook_sn) => {
    // console.log('****stuId****');
    // console.log(stuId);
    // console.log('****workbook_sn****');
    // console.log(workbook_sn);
    //
    // console.log(
    //   'http://192.168.123.113:3001/api/book-list/workbook' +
    //     '/' +
    //     workbook_sn +
    //     '?' +
    //     new URLSearchParams({
    //       stu_id: stuId,
    //     }),
    // );

    fetch(
      preURL.preURL +
        '/api/book-list/workbook' +
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
                  setCurrentWorkbooksn(item.workbook_sn);
                  refRBSheet.current.open();
                }
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: wp('3.5'),
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        {/*취소/삭제 버튼 modal*/}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          height={hp(22)}
          animationType={'fade'}
          openDuration={30}
          closeDuration={0}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(41, 41, 41, 0.5)',
            },
            container: {
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
          }}>
          <View style={styles.container}>
            <View style={styles.txtArea}>
              <Text style={{fontWeight: 'bold', fontSize: wp(4)}}>
                선택한 문제집을 삭제하시겠어요?
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <View style={styles.btnArea_l}>
                <TouchableOpacity
                  style={styles.delbtnoutline}
                  onPress={() => {
                    {
                      refRBSheet.current.close();
                    }
                  }}>
                  <Text>취소</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.btnArea_r}>
                <TouchableOpacity
                  style={styles.delbtn}
                  onPress={() => {
                    {
                      delBookFull(currentWorkbooksn);
                      refRBSheet.current.close();
                    }
                  }}>
                  <Text style={{color: 'white'}}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>

        <View>
          <FlatList
            style={styles.list}
            horizontal={false}
            data={workbookData}
            renderItem={resultBookItems}
            keyExtractor={(item, index) => index.toString()}
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
    flex: 1.5,
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
    width: wp(22),
    height: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  delbtnoutline: {
    margin: wp(6),
    marginRight: wp(2),
    width: wp(33),
    height: hp(5),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  delbtn: {
    margin: wp(6),
    marginLeft: wp(2),
    width: wp(33),
    height: hp(5),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
  },
  grey: {
    backgroundColor: '#C1C2CA',
  },

  emptyResult: {
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(1.5),

    ...Platform.select({
      ios: {
        paddingBottom: hp(4.5),
      },
    }),
  },
  btnArea_l: {
    // backgroundColor: 'orange',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  btnArea_r: {
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // marginRight: wp(10),
  },

  txtArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(2.5),
    ...Platform.select({
      ios: {
        paddingTop: hp(1),
      },
    }),
  },
});

export default MyBookScreen;
