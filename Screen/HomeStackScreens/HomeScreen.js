import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';

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
import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';

const createincorNoteData = [
  {
    id: '1',
    color: 'red',
    img: 'https://i.postimg.cc/nhhVVbqN/red.png',
  },
  {
    id: '2',
    color: 'yellow',

    img: 'https://i.postimg.cc/JzYrG6q0/yello.png',
  },
  {
    id: '3',
    color: 'green',

    img: 'https://i.postimg.cc/9FVFSq0m/green.png',
  },
  {
    id: '4',
    color: 'blue',

    img: 'https://i.postimg.cc/mZ7g8Sbp/blue.png',
  },
  {
    id: '5',
    color: 'indigo',

    img: 'https://i.postimg.cc/7LCx73sV/indigo.png',
  },
  {
    id: '6',
    color: 'purple',

    img: 'https://i.postimg.cc/m2w2G21Q/purple.png',
  },
];

const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    getMultidata();
    // Put Your Code Here Which You Want To Refresh or Reload on Coming Back to This Screen.
  }, [isFocused]);

  const preURL = require('../../preURL/preURL');

  const [userData, setUserData] = useState([]);
  const [workbookData, setWorkbookData] = useState([]);
  const [acabookData, setAcabookData] = useState([]);
  const [incornoteData, setIncornoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState([]);
  const [stuId, setStuId] = useState('');

  const [noteTitle, setNoteTitle] = useState('');
  const [colorURL, setColorURL] = useState('https://i.ibb.co/vsv7pWR/red.png');

  const refRBSheet = useRef();
  const createNoterefRBSheet = useRef();
  const minitestSheet = useRef();

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getUserdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home?' +
        new URLSearchParams({
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );

    if (response.status === 200) {
      const responseJson = await response.json();
      return responseJson.data.retrievedUser;
    } else {
      throw new Error('unable to get your User');
    }
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

  const getAcabookdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/academy?' +
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
  const getIncornotedata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/incor-note?' +
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
    }
  };

  //assemble multi Apifetch functions
  const getMultidata = async () => {
    const userId = await getUserid();
    setStuId(userId);
    const userdata = await getUserdata(userId);
    setUserData(userdata);

    const workbookdata = await getWorkbookdata(userId);
    setWorkbookData(workbookdata);

    const acabookdata = await getAcabookdata(userId);
    setAcabookData(acabookdata);
    await getIncornotedata(userId);
    const incornotedata = await getIncornotedata(userId);
    setIncornoteData(incornotedata);
    setLoading(false);

    return incornotedata;
  };
  const createNote = (stuId) => {
    var dataToSend = {
      stu_id: stuId,
      note_name: noteTitle,
      note_photo: colorURL,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(preURL.preURL + '/api/book-list/incor-note', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('create note is Successful.');
        } else {
          console.log('create note is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const createNoteFull = async () => {
    const userId = await getUserid();
    const what = await createNote(userId);

    showMessage({
      message: '오답노트가 생성되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });

    const whatt = getMultidata();
  };

  useEffect(() => {
    setLoading(true);
    getMultidata();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setLoading(true);
  //     getMultidata();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{paddingRight: 20}}
          onPress={() => {
            {
              navigation.navigate('Search', {
                stu_id: stuId,
              });
            }
          }}>
          <Icon name="search-outline" size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const workbookItems = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          // console.log(userData);
          setCurrentBook(item);
          refRBSheet.current.open();
        }}>
        <Image source={{uri: item.workbook_photo}} style={styles.bookimg} />
      </TouchableOpacity>
    );
  };

  const academyItems = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          // console.log(userData);
          setCurrentBook(item);
          refRBSheet.current.open();
        }}>
        <Image source={{uri: item.workbook_photo}} style={styles.bookimg} />
      </TouchableOpacity>
    );
  };

  const incornoteItems = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          {
            navigation.navigate('IncorNoteRead', {
              note_sn: item.note_sn,
              note_name: item.note_name,
            });
          }
        }}>
        <Image source={{uri: item.note_photo}} style={styles.bookimg} />
      </TouchableOpacity>
    );
  };

  const plusBook = () => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          {
            navigation.navigate('Search', {
              stu_id: stuId,
            });
          }
        }}>
        <Image
          source={require('../../src/plus-book.png')}
          style={styles.bookimg}
        />
      </TouchableOpacity>
    );
  };

  const plusNote = () => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          {
            createNoterefRBSheet.current.open();
          }
        }}>
        <Image
          source={require('../../src/plus-book.png')}
          style={styles.bookimg}
        />
      </TouchableOpacity>
    );
  };

  //오답노트 생성 modal flatList item
  const createincornoteItems = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.incor_book,
            {borderWidth: colorURL === item.img ? 2 : 0},
          ]}
          onPress={() => {
            {
              setColorURL(item.img);
            }
          }}>
          <Image source={{uri: item.img}} style={styles.incor_bookimg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.container_profile}>
        <View style={styles.container_profileimg}>
          <Image source={{uri: userData.stu_photo}} style={styles.profileimg} />
        </View>
        <View style={styles.container_profiletxt}>
          <View style={styles.profiletxt_name}>
            <Text style={{fontSize: wp('4.5'), fontWeight: 'bold'}}>
              {userData.stu_nick}
            </Text>
          </View>

          <View style={styles.profiletxt_grade}>
            {userData != [] && (
              <Text style={{fontSize: wp('4'), color: 'grey'}}>
                고등학교 {userData.stu_grade}학년
              </Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}}>
        {/*내 문제집*/}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={hp(28)}
          animationType={'fade'}
          openDuration={30}
          closeDuration={30}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(41, 41, 41, 0.5)',
            },
            container: {
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={styles.container}>
            <View style={styles.txtArea}>
              <Text style={{fontWeight: 'bold', fontSize: wp(4)}}>
                {currentBook.workbook_title}
              </Text>
            </View>
            <View style={styles.btnArea}>
              <TouchableOpacity
                style={styles.btnoutline}
                onPress={() => {
                  {
                    console.log('===currentBook.workbook_sn===');
                    console.log(currentBook.workbook_sn);
                    navigation.navigate('Mark', {
                      currentBooksn: currentBook.workbook_sn,
                    });

                    refRBSheet.current.close();
                  }
                }}>
                <Text>채점하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnArea}>
              <TouchableOpacity style={styles.btn}>
                <Text style={{color: 'white'}}>상세보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={styles.titleText}>내 문제집</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('MyBook', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(workbookData)}
            renderItem={workbookItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusBook()}
          />
        </View>

        {/*학원 문제집*/}
        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={styles.titleText}>학원 문제집</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('AcademyBook', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(acabookData)}
            renderItem={academyItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusBook()}
          />
        </View>

        {/*오답노트*/}

        {/*생성 modal*/}
        <RBSheet
          ref={createNoterefRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          height={hp(60)}
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
          <View style={styles.incor_container}>
            <View style={[styles.incor_titleArea]}>
              <Text style={{fontWeight: 'bold', fontSize: wp(4.5)}}>
                오답노트 생성
              </Text>
            </View>
            <View style={[styles.incor_txtArea]}>
              <Text style={{fontSize: wp(4.5)}}>이름</Text>
            </View>
            <View style={[styles.incor_inputArea]}>
              <TextInput
                autoFocus={true}
                blurOnSubmit={false}
                enablesReturnKeyAutomatically={true}
                selectionColor={'black'}
                style={styles.searchInput}
                clearButtonMode={'while-editing'}
                placeholder={'오답노트 이름을 입력해주세요'}
                onChangeText={(noteTitle) => setNoteTitle(noteTitle)}
              />
            </View>
            <View style={[styles.incor_txtArea]}>
              <Text style={{fontSize: wp(4.5)}}>표지선택</Text>
            </View>

            <View style={[styles.incor_noteContainer]}>
              <FlatList
                style={styles.list}
                horizontal={true}
                data={createincorNoteData}
                renderItem={createincornoteItems}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={[styles.incor_btnContainer]}>
              <View style={styles.incor_btnArea_l}>
                <TouchableOpacity
                  style={styles.incor_delbtnoutline}
                  onPress={() => {
                    {
                      createNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text style={{fontSize: wp(4)}}>취소</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.incor_btnArea_r}>
                <TouchableOpacity
                  style={styles.incor_delbtn}
                  onPress={() => {
                    {
                      createNoteFull();
                      createNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text style={{color: 'white', fontSize: wp(4)}}>생성</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>

        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={styles.titleText}>오답노트</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('IncorNote', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(incornoteData)}
            renderItem={incornoteItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusNote()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    // paddingLeft: wp(7),
    // paddingRight: wp(7),
  },
  container_profile: {
    // flex: 0.15,
    height: hp(10),
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  container_profileimg: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(1),
  },
  profileimg: {
    resizeMode: 'cover',
    width: wp(15),
    height: wp(15),
    borderRadius: 400,
    borderColor: '#E0E0E0',
  },

  container_profiletxt: {
    flexDirection: 'column',
    flex: 4,
    paddingLeft: wp(2),
  },

  profiletxt_name: {
    justifyContent: 'center',
    flex: 1,
    // backgroundColor: 'pink',
    paddingTop: hp(2),
  },
  profiletxt_grade: {
    justifyContent: 'center',
    flex: 1,
    paddingBottom: hp(2),
  },

  container_book: {
    // flex: 3,
    height: hp(22),
    borderBottomColor: '#E0E0E0',
  },
  container_bookheader: {
    width: wp(100),
    flexDirection: 'row',
    height: hp(6),
    justifyContent: 'space-between',
  },

  container_bookctgtitle: {
    width: wp(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: wp(7),
  },

  container_bookbtn: {
    paddingRight: wp(1),
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  first: {
    backgroundColor: 'lightgoldenrodyellow',
  },
  second: {
    backgroundColor: 'lightgrey',
  },
  third: {
    backgroundColor: 'lightpink',
  },

  book: {
    flex: 1,
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 5,
    shadowColor: '#000',

    elevation: 7,

    ...Platform.select({
      ios: {
        margin: wp(3),
        marginBottom: wp(5),
        overflow: 'visible',
        width: wp(32),
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
        margin: wp(3),
        width: wp(29),
      },
    }),
  },
  bookimg: {
    resizeMode: 'cover',
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.13,
    shadowRadius: 8,

    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },

  list: {
    paddingLeft: wp(3),
    paddingRight: wp(3),
  },

  titleText: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  txtArea: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnArea: {
    flex: 1,
    // height: hp(7),
    // backgroundColor: 'orange',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },

  btn: {
    margin: wp(6),
    marginTop: 0,
    flex: 1,
    width: wp(75),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btnoutline: {
    margin: wp(6),
    marginBottom: 0,
    flex: 1,
    width: wp(75),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },

  //오답노트 MOdal

  incor_container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  incor_titleArea: {
    marginTop: wp(4),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: hp(2.5),
    // ...Platform.select({
    //   ios: {
    //     paddingTop: hp(1),
    //   },
    // }),
  },
  incor_txtArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: wp(10),

    // paddingTop: hp(2.5),
    // ...Platform.select({
    //   ios: {
    //     paddingTop: hp(1),
    //   },
    // }),
  },
  incor_inputArea: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: wp(10),
    paddingRight: wp(10),
  },

  searchInput: {
    fontSize: wp(4.5),
    borderBottomWidth: 1,
    width: '100%',
    ...Platform.select({
      ios: {
        height: wp(8),
      },
      android: {},
    }),
  },

  incor_noteContainer: {
    paddingLeft: wp(10),
    // paddingRight: wp(10),
    paddingBottom: wp(4),
    flex: 4.5,
  },

  incor_btnContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(1),

    ...Platform.select({
      ios: {
        paddingBottom: hp(2.5),
      },
    }),
  },

  incor_btnArea_l: {
    // backgroundColor: 'orange',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  incor_btnArea_r: {
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // marginRight: wp(10),
  },

  incor_delbtnoutline: {
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
  incor_delbtn: {
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

  incor_book: {
    width: wp(37),
    height: wp(50),
    marginRight: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 5,

    ...Platform.select({
      android: {
        width: wp(30),
        height: wp(40),
      },
    }),
  },

  incor_bookimg: {
    resizeMode: 'cover',
    // borderRadius: 5,
    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },
  emptyResult: {
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default HomeScreen;
