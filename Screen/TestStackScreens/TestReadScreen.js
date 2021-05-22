import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';

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
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const TestReadScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [testListData, setTestListData] = useState([]); //미니모의고사 리스트
  const [testpbdata, setTestpbdata] = useState([]); //각각 미니모의고사 안의 문제
  const [curTestindex, setCurTestindex] = useState([]);

  const [result, setResult] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [filePath, setFilePath] = useState('');

  const delNoterefRBSheet = useRef();

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  //미니모의고사 가져오기
  //localhost:3001/api/test/list?stu_id=samdol
  const getTestListdata = async (userId) => {
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

  const getTestListdataFull = async () => {
    setLoading(true);
    const userId = await getUserid();
    const testListdata = await getTestListdata(userId);

    setTestListData(testListdata);
    setLoading(false);
  };

  // Delete test
  //localhost:3001/api/test/list/'삭제할 미니모의고사 sn'?stu_id=samdol
  const delTest = (stuId, test_sn) => {
    fetch(
      preURL.preURL +
        '/api/test/list' +
        '/' +
        test_sn +
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
          console.log('deleting test is Successful.');
        } else {
          console.log('deleting test is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });
  };

  const delTestFull = async (test_sn) => {
    setLoading(true);

    const userId = await getUserid();
    const what = await delTest(userId, test_sn);
    const testListdata = await getTestListdata(userId);
    setTestListData(testListdata);

    setLoading(false);

    showMessage({
      message: '선택한 오답노트가 삭제되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  //각 미니모의고사 안 문제
  //localhost:3001/api/test/list/download?test_sn=18&stu_id=samdol
  const getTestPbdata = async (userId, test_sn) => {
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

  const shareToFiles = async (URL) => {
    const pre = 'data:application/pdf;base64,';
    console.log(pre + URL);
    const shareOptions = {
      title: 'Share file',
      url: pre + URL, // base64 with mimeType or path to local file
    };

    // If you want, you can use a try catch, to parse
    // the share response. If the user cancels, etc.
    try {
      const ShareResponse = await Share.open(shareOptions);
      setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error =>', error);
      // setResult('error: '.concat(getErrorString(error)));
    }
  };

  const createPDF = async (source) => {
    console.log('createPDF 함수까지 옴');
    if (await isPermitted()) {
      const options = {
        html: source,
        fileName: 'test',
        directory: 'Documents',
        base64: true,
      };
      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);
      console.log(file.base64);
      setFilePath(file.filePath);
      setFileURL(file.base64);

      return file.base64;
    }
  };

  const settingHTML = async (pb_img_Arr, test_title) => {
    const source = `<div>
   <script language="JavaScript"  type="text/javascript">
  
               
        //문자열로 가져오기
        var pb_img="${pb_img_Arr}"
        
        
        //1. pb_img_arr
        //.png, 기준으로 자른 후 마지막 빼고는 뒤에 .png다 붙여주기
        var png=".png"
        var pb_img_arr=pb_img.split(".png,");
        
        for(var i=0;i<pb_img_arr.length-1;i++){
          pb_img_arr[i]=pb_img_arr[i].concat(png);
        }
        
        //  document.write("===pb_img_arr===<br>");
        //
        // for(var i=0;i<pb_img_arr.length;i++){
        //   document.write(pb_img_arr[i]+"<br>");
        // }
        //
        
        document.write(\`
        <div style="width:100%; height: 55px; display:flex; align-items: center; justify-content: center" >
        <span style="font-size: 20px"> \`+"${test_title}"+\`</span>
        </div>\`);
         
        
        for(var i=0;i<pb_img_arr.length;i++){
          document.write(\`<div style="padding: 10px; width:50%; border-right: 1px dashed black; ">
        <div style="padding-bottom: 10px">
            <span style="font-size: 15px">문제 \`+(i+1)+\`</span>
        </div>

        <div style="padding-bottom: 30px;">\`+
           \` <img src="\`+pb_img_arr[i]+\`" style="width: 95%;height: auto; border-radius: 5px; border: 0.5px solid black" />
        </div>


    </div>\` )
         
        }


    </script>
</div>`;

    console.log(source);
    return source;
  };

  const createPdfFull = async (test_sn, test_title) => {
    setLoading(true);
    const userId = await getUserid();
    const testpbdata = await getTestPbdata(userId, test_sn);
    setTestpbdata(testpbdata);

    //배열 나눠주기
    const pb_img_Arr = new Array();

    for (var i = 0; i < testpbdata.length; i++) {
      pb_img_Arr.push(testpbdata[i].pb_img);
    }

    const source = await settingHTML(pb_img_Arr, test_title);
    const URL = await createPDF(source);
    const what = await shareToFiles(URL);
    setLoading(false);

    showMessage({
      message: '선택한 미니모의고사가 저장되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  useEffect(() => {
    getTestListdataFull();
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
        <View style={styles.resultitem_title}>
          <TouchableOpacity
            onPress={() => {
              {
                navigation.navigate('TestReadEach', {
                  test_sn: item.test_sn,
                  test_title: item.test_title,
                });
              }
            }}>
            <Text style={{fontSize: wp(4.5)}}>{item.test_title}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                createPdfFull(item.test_sn, item.test_title);
              }
            }}>
            <Icon name="download-outline" size={25} />
          </TouchableOpacity>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                setCurTestindex(item.test_sn);
                delNoterefRBSheet.current.open();
              }
            }}>
            <Icon name="trash-outline" size={25} />
          </TouchableOpacity>
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
          생성된 미니모의고사가 없습니다.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        {/*<Loader loading={loading} />*/}

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
                선택한 미니모의고사를 삭제하시겠어요?
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
                      delTestFull(curTestindex);
                      delNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text style={{color: 'white'}}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>

        <FlatList
          horizontal={false}
          data={testListData}
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
    fontSize: wp('5'),
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
});

export default TestReadScreen;
