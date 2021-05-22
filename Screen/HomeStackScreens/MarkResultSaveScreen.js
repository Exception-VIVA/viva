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
  Platform,
  PermissionsAndroid,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import {showMessage} from 'react-native-flash-message';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const MarkResultSaveScreen = ({route, navigation}) => {
  //get params
  const {s3List, markResults, book_sn, incorrectPbs} = route.params;

  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [incorNoteList, setIncorNoteList] = useState([]);
  const [yesBtnPressed, setYesBtnPressed] = useState(false);
  const [noBtnPressed, setNoBtnPressed] = useState(false);

  const [result, setResult] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [filePath, setFilePath] = useState('');

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const makeIncorNoteList = async (note_list) => {
    var incornoteList = [];

    for (let i = 0; i < note_list.length; i++) {
      incornoteList.push({
        label: note_list[i].note_name,
        value: note_list[i].note_sn,
      });
    }
    return incornoteList;
  };

  //localhost:3001/api/scoring/result/note_list?stu_id=samdol
  const getIncorNotedata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/scoring/result/note_list?' +
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
      throw new Error('unable to get your IncorNotedata');
    }
  };

  const getMultidata = async () => {
    const userId = await getUserid();
    const incornotedata = await getIncorNotedata(userId);
    const incornotelist = await makeIncorNoteList(incornotedata.notes);
    setIncorNoteList(incornotelist);
    setLoading(false);
  };

  //문제집 이름 가져오기
  //localhost:3001/api/scoring/result/workbook_title?workbook_sn=190901
  const getBookTitle = async () => {
    const response = await fetch(
      preURL.preURL +
        '/api/scoring/result/workbook_title?' +
        new URLSearchParams({
          workbook_sn: book_sn,
        }),
      {
        method: 'GET',
      },
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        // console.log('====문제집 이름 get result====');
        // console.log(responseJson.data.title);
        return responseJson.data.title;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your BookTitle');
    }
  };

  //오답노트 문제 넣기
  //localhost:3001/api/scoring/result
  const saveIncornote = (stuId) => {
    var incor_list = '';

    //stu_sn, note_sn
    incor_list = incor_list.concat(stuId, ',', value, incorrectPbs);
    // console.log('===incor_list===');
    // console.log(incor_list); //samdol,7,5588

    var dataToSend = {
      incor_list: incor_list,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(preURL.preURL + '/api/scoring/result', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('✨save in incornote is Successful.');
          showMessage({
            message: '오답노트에 틀린문제가 저장되었습니다.',
            type: 'default',
            duration: 2500,
            // autoHide: false,
          });
        } else {
          console.log('❌save in incornote  is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        console.error(error);
      });
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
    // console.log(pre + URL);
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

  const createPDF = async (source, file_name) => {
    console.log('==file_name===');
    console.log(file_name);
    if (await isPermitted()) {
      const options = {
        html: source,
        fileName: file_name,
        directory: 'Documents',
        base64: true,
      };
      const file = await RNHTMLtoPDF.convert(options);
      // console.log(file.filePath);
      // console.log(file.base64);
      setFilePath(file.filePath);
      setFileURL(file.base64);

      return file.base64;
    }
  };
  const settingHTML = async (
    test_title,
    s3List,
    is_correct,
    pb_code,
    userId,
  ) => {
    const source = `<div>
   <script language="JavaScript"  type="text/javascript">
  
               
        //문자열로 가져오기
        var page_img="${s3List}"        
        const page_img_arr=page_img.split(',');
        page_img_arr.shift();
        
        var is_correct="${is_correct}"        
        const is_correct_arr=is_correct.split(',');
        
        

        var pb_code="${pb_code}"        
        const pb_code_arr=pb_code.split(',');
        
        
        
        document.write("===is_correct_arr===<br>");

        for(var i=0;i<is_correct_arr.length;i++){
          document.write(is_correct_arr[i]+"<br>");
        }
        
        document.write("===pb_code_arr===<br>");

        for(var i=0;i<pb_code_arr.length;i++){
          document.write(pb_code_arr[i]+"<br>");
        }
        
        
        
        
        document.write(\`
        <div style="width:100%; height: 55px; display:flex; align-items: center; justify-content: center" >
        <span style="font-size: 20px"> \`+"${test_title}"+\`</span>
        </div>\`);
         
        
        for(var i=0;i<page_img_arr.length;i++){
          document.write(\`<div style="padding: 10px; width:50%; border-right: 1px dashed black; ">
        <div style="padding-bottom: 10px">
            <span style="font-size: 15px">문제 \`+(i+1)+\`</span>
        </div>

        <div style="padding-bottom: 30px;">\`+
           \` <img src="\`+page_img_arr[i]+\`" style="width: 95%;height: auto; border-radius: 5px; border: 0.5px solid black" />
        </div>


    </div>\` )
         
        }


    </script>
</div>`;

    console.log(source);
    return source;
  };

  const createPdfFull = async (test_title, userId) => {
    var now = new Date();
    now = now.toISOString();
    now = now.substr(0, 10);

    const file_name = test_title + '_' + userId + '_' + now;
    setLoading(true);

    var is_correct = '';
    var pb_code = '';

    for (var i = 0; i < markResults.length; i++) {
      is_correct = is_correct.concat(',', markResults[i].is_correct);
      pb_code = pb_code.concat(',', markResults[i].pb_code);
    }

    is_correct = is_correct.substr(1);
    pb_code = pb_code.substr(1);

    const source = await settingHTML(
      test_title,
      s3List,
      is_correct,
      pb_code,
      userId,
    );
    const URL = await createPDF(source, file_name);
    const what = await shareToFiles(URL);
    setLoading(false);

    showMessage({
      message: '선택한 미니모의고사가 저장되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  const saveFull = async () => {
    if (value == null) {
      alert('오답노트를 선택해주세요');
      return;
    }
    setLoading(true);
    const userId = await getUserid();

    if (yesBtnPressed) {
      //1. 시험지 타이틀 get
      const title = await getBookTitle();
      //2. pdf  full 호출
      const c = await createPdfFull(title, userId);
    }

    //오답노트 저장 (항상)
    const what = await saveIncornote(userId);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getMultidata();
    setLoading(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>채점결과 저장</Text>,
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
      <Loader loading={loading} />
      <View style={styles.topdesc}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>
          틀린문제를 저장할 오답노트를 선택해 주세요{' '}
        </Text>
        <Text style={{fontSize: wp(4), paddingTop: hp(1.5)}}>
          찍었던 시험지와 채점표를 pdf파일로
        </Text>
        <Text style={{fontSize: wp(4), paddingTop: hp(0)}}>
          다운로드할 수도 있어요.
        </Text>
      </View>

      <View style={styles.downcontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold', paddingBottom: 20}}>
          채점결과 pdf 다운로드
        </Text>

        <View style={styles.btnContainer}>
          <View style={{paddingRight: wp(3)}}>
            <TouchableOpacity
              style={yesBtnPressed ? styles.btn : styles.btn_white}
              onPress={() => {
                setYesBtnPressed(true);
                setNoBtnPressed(false);
              }}>
              <Text
                style={yesBtnPressed ? styles.font_white : styles.font_black}>
                YES
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={noBtnPressed ? styles.btn : styles.btn_white}
            onPress={() => {
              setYesBtnPressed(false);
              setNoBtnPressed(true);
            }}>
            <Text style={noBtnPressed ? styles.font_white : styles.font_black}>
              NO
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.notecontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold', paddingBottom: 20}}>
          오답노트
        </Text>

        <DropDownPicker
          open={open}
          value={value}
          items={incorNoteList}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setIncorNoteList}
          placeholder="오답노트를 선택해주세요."
          zIndex={5000}
          maxHeight={200}
        />
      </View>

      <View style={styles.createbtnContainer}>
        <TouchableOpacity
          style={[styles.btn_round]}
          onPress={() => {
            saveFull();
          }}>
          <Text style={{fontSize: wp(4), fontWeight: 'bold', color: 'white'}}>
            저장하기
          </Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
  topdesc: {
    marginTop: hp(5),
    height: hp(10),
    paddingBottom: hp(5),
  },

  notecontainer: {
    marginTop: hp(5),
    height: hp(10),
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingBottom: hp(2),
  },

  downcontainer: {
    marginTop: hp(3),
    height: hp(10),
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingBottom: hp(2),
  },

  btnContainer: {
    flexDirection: 'row',
  },
  btn: {
    height: wp(10),
    width: wp(30),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
  },

  btn_round: {
    height: wp(10),
    width: wp(30),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
  },

  btn_white: {
    height: wp(10),
    width: wp(30),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  font_black: {
    fontSize: wp(4),
    color: 'black',
  },
  font_white: {
    fontSize: wp(4),
    color: 'white',
  },

  createbtnContainer: {
    marginTop: hp(25),
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarkResultSaveScreen;
