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
  PermissionsAndroid,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {create} from 'react-native/jest/renderer';

const createincorNoteData = [
  {
    id: '1',
    color: 'red',
    img: 'https://i.ibb.co/vsv7pWR/red.png',
  },
  {
    id: '2',
    color: 'yellow',

    img: 'https://i.ibb.co/qY0Rkky/yello.png',
  },
  {
    id: '3',
    color: 'green',

    img: 'https://i.ibb.co/3mBKH0J/green.png',
  },
  {
    id: '4',
    color: 'blue',

    img: 'https://i.ibb.co/SfLkVp4/blue.png',
  },
  {
    id: '5',
    color: 'indigo',

    img: 'https://i.ibb.co/Nnyn1W6/indigo.png',
  },
  {
    id: '6',
    color: 'purple',

    img: 'https://i.ibb.co/wrxmZSL/purple.png',
  },
];

const IncorNoteScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [incorNoteData, setIncorNoteData] = useState([]);
  const [pbCountdata, setPbCountdata] = useState([]);
  const [currentNotesn, setCurrentNotesn] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTitlebefore, setNoteTitlebefore] = useState('');
  const [colorURL, setColorURL] = useState('https://i.ibb.co/vsv7pWR/red.png');
  const [incorPbData, setIncorPbData] = useState([]); //pdf 생성시 필요한 상세 문제
  const [htmlinput, setHtmlinput] = useState('');

  const delNoterefRBSheet = useRef();
  const updateNoterefRBSheet = useRef();
  const createNoterefRBSheet = useRef();

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const createPDF = async (source) => {
    console.log('createPDF 함수까지 옴');
    if (await isPermitted()) {
      const options = {
        html: source,
        fileName: 'test',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);
      setFilePath(file.filePath);
    }
  };

  const settingHTML = async (value) => {
    const source = `<div>
   <script language="JavaScript">
            // document.write(${value.length}); ///6
            
            
            //아니면 여기서 JS로 배열을 다시..? 근데 안 될듯..
            //여기 오기 pb_img, sol_ans 등 각 배열을 만들어서 인자로 넘기고 여기서 새로운 배열을 생성해서 대입하면 안 ㅗ디나
            
            
            for(var i=0;i<${value.length};i++){
              document.write(${value[0].sol_ans})
            }
            
    </script>
    
    <!--<span>${value[0].sol_ans}</span>
    <span>${value[1].sol_ans}</span>
    <span>${value[2].sol_ans}</span>
    <span>${value[3].sol_ans}</span>
    <span>${value[4].sol_ans}</span>
    <span>${value.length}</span>-->
</div>`;
    return source;
  };

  const getIncorPbdata = async (userId, note_sn) => {
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

  const createPdfFull = async (note_sn) => {
    setLoading(true);
    const userId = await getUserid();
    const incorpbData = await getIncorPbdata(userId, note_sn);
    setIncorPbData(incorpbData);
    const source = await settingHTML(incorpbData);

    const what2 = await createPDF(source);
    setLoading(false);
  };

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getIncorNotedata = async (userId) => {
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
        // console.log('====fetch return result====');
        // console.log(responseJson.data);
        return responseJson.data;
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
    const incornotedata = await getIncorNotedata(userId);
    setIncorNoteData(incornotedata.bookInfo);
    setPbCountdata(incornotedata.pbCount);
    // console.log('==incornote Data!!==');
    // console.log(incorNoteData);
    // console.log('==pbCount Data!!==');
    // console.log(pbCountdata);

    setLoading(false);
  };

  //localhost:3001/api/book-list/incor-note/'삭제할 note_sn'?stu_id=samdol
  const delBook = (stuId, note_sn) => {
    fetch(
      preURL.preURL +
        '/api/book-list/incor-note' +
        '/' +
        note_sn +
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

  const delBookFull = async (note_sn) => {
    setLoading(true);

    const userId = await getUserid();
    const what = await delBook(userId, note_sn);
    const incornotedata = await getIncorNotedata(userId);
    setIncorNoteData(incornotedata.bookInfo);
    setPbCountdata(incornotedata.pbCount);

    setLoading(false);

    showMessage({
      message: '선택한 오답노트가 삭제되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  //localhost:3001/api/book-list/incor-note
  // body : stu_id,note_name,note_photo
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
    setLoading(true);
    const userId = await getUserid();
    const what = await createNote(userId);

    const incornotedata = await getIncorNotedata(userId);
    setIncorNoteData(incornotedata.bookInfo);
    setPbCountdata(incornotedata.pbCount);
    setLoading(false);

    showMessage({
      message: '오답노트가 생성되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  //localhost:3001/api/book-list/incor-note/'삭제할 note_sn'?stu_id=samdol
  //localhost:3001/api/book-list/incor-note/'수정할 note_sn'?stu_id=samdol

  //body : stu_id,note_name,note_photo
  const updateBook = (stuId, note_sn) => {
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

    console.log(preURL.preURL + '/api/book-list/incor-note/' + note_sn);

    fetch(preURL.preURL + '/api/book-list/incor-note/' + note_sn, {
      method: 'PUT',
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
          console.log('update note is Successful.');
        } else {
          console.log('update note is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const updateBookFull = async (note_sn) => {
    setLoading(true);

    const userId = await getUserid();
    const what = await updateBook(userId, note_sn);

    const incornotedata = await getIncorNotedata(userId);
    setIncorNoteData(incornotedata.bookInfo);
    setPbCountdata(incornotedata.pbCount);

    setLoading(false);

    showMessage({
      message: '오답노트가 수정되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  useEffect(() => {
    setLoading(true);
    getMultidata();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>오답노트</Text>,
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
              createNoterefRBSheet.current.open();
            }
          }}>
          <Icon name="add-circle" size={30} style={{paddingRight: 15}} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const resultBookItems = ({item, index}) => {
    return (
      <View style={styles.resultitem_container}>
        <Loader loading={loading} />
        <View style={styles.resultitem_book_container}>
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
        </View>

        <View style={styles.resultitem_info_container}>
          <View style={styles.info_top}>
            <Text style={{fontSize: wp(4.5)}}>{item.note_name}</Text>
          </View>
          <View style={styles.info_mid}>
            <Icon
              name="file-tray-full-outline"
              size={20}
              style={{paddingRight: wp(1), paddingLeft: wp(1)}}
            />
            <Text style={{paddingRight: wp(3)}}>{pbCountdata[index]}문제</Text>
            <Icon style={{paddingRight: wp(1)}} name="time-outline" size={20} />
            <Text style={{paddingRight: wp(3)}}>
              {item.note_date.substring(0, 10)}
            </Text>
          </View>
          <View style={styles.info_bottom}>
            <TouchableOpacity
              style={[styles.btn]}
              onPress={() => {
                {
                  setCurrentNotesn(item.note_sn);
                  delNoterefRBSheet.current.open();
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
            <TouchableOpacity
              style={[styles.btn]}
              onPress={() => {
                {
                  setNoteTitlebefore(item.note_name);
                  setCurrentNotesn(item.note_sn);
                  setColorURL(item.note_photo);
                  setNoteTitle(item.note_name);
                  updateNoterefRBSheet.current.open();
                }
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: wp('3.5'),
                  fontWeight: 'bold',
                }}>
                수정
              </Text>
            </TouchableOpacity>

            {/*Pdf export 버튼*/}
            <TouchableOpacity
              onPress={() => {
                {
                  console.log('click되었음!');
                  createPdfFull(item.note_sn);
                }
              }}>
              <Icon name="download-outline" size={31} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
      <SafeAreaView style={{flex: 1}}>
        <Loader loading={loading} />

        {/*삭제 modal*/}
        <RBSheet
          ref={delNoterefRBSheet}
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
                      delNoterefRBSheet.current.close();
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
                      delBookFull(currentNotesn);
                      delNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text style={{color: 'white'}}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>

        {/*수정 modal*/}
        <RBSheet
          ref={updateNoterefRBSheet}
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
                오답노트 수
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
                placeholder={noteTitlebefore}
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
                      updateNoterefRBSheet.current.close();
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
                      updateBookFull(currentNotesn);
                      updateNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text style={{color: 'white', fontSize: wp(4)}}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>

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
              <View style={styles.btnArea_l}>
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

        <View>
          <FlatList
            style={styles.list}
            horizontal={false}
            data={incorNoteData}
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
    flex: 3.5,
  },
  info_mid: {
    paddingLeft: wp(4),
    paddingBottom: wp(2),
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info_bottom: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: wp(4),
    alignItems: 'center',
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
    marginRight: wp(3),
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

  //color
  red: {backgroundColor: 'rgba(235,87,87,0.5)'},
  orange: {
    backgroundColor: 'rgba(242,153,74,0.5)',
  },
  yellow: {
    backgroundColor: 'rgba(242,201,76,0.5)',
  },
  green: {
    backgroundColor: 'rgba(39,174,96,0.5)',
  },
  blue: {
    backgroundColor: 'rgba(47,128,237,0.5)',
  },
  purple: {
    backgroundColor: 'rgba(155,81,224,0.5)',
  },
});

export default IncorNoteScreen;
