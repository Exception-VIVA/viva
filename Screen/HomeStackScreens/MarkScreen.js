import {PropTypes} from 'prop-types';
import React, {PureComponent, useEffect} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Scanner, {
  Filters,
  RectangleOverlay,
} from 'react-native-rectangle-scanner';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import preURL from '../../preURL/preURL';

export default class MarkScreen extends PureComponent {
  static propTypes = {
    cameraIsOn: PropTypes.bool,
    onLayout: PropTypes.func,
    onSkip: PropTypes.func,
    onCancel: PropTypes.func,
    onPictureTaken: PropTypes.func,
    onPictureProcessed: PropTypes.func,
    hideSkip: PropTypes.bool,
    initialFilterId: PropTypes.number,
    onFilterIdChange: PropTypes.func,
  };

  static defaultProps = {
    cameraIsOn: undefined,
    onLayout: () => {},
    onSkip: () => {},
    onCancel: () => {},
    onPictureTaken: () => {},
    onPictureProcessed: () => {},
    onFilterIdChange: () => {},
    hideSkip: false,
    initialFilterId: Filters.PLATFORM_DEFAULT_FILTER_ID,
  };

  constructor(props) {
    super(props);
    this.state = {
      flashEnabled: false,
      showScannerView: false,
      didLoadInitialLayout: false,
      filterId: props.initialFilterId || Filters.PLATFORM_DEFAULT_FILTER_ID,
      detectedRectangle: false,
      isMultiTasking: false,
      loadingCamera: true,
      processingImage: false,
      takingPicture: false,
      feedbackState: false,
      overlayFlashOpacity: new Animated.Value(0),
      device: {
        initialized: false,
        hasCamera: false,
        permissionToUseCamera: false,
        flashIsAvailable: false,
        previewHeightPercent: 1,
        previewWidthPercent: 1,
      },
      book_sn: this.props.route.params.currentBooksn,
      currentImage: '',
      preparedImgages: [],
      isScanned: false,
    };

    this.camera = React.createRef();
    this.imageProcessorTimeout = null;
  }

  componentDidMount() {
    if (this.state.didLoadInitialLayout && !this.state.isMultiTasking) {
      this.turnOnCamera();
    }

    this.props.navigation.setOptions({
      headerTitleAlign: 'left',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            {
              this.props.navigation.replace('Home');
            }
          }}>
          <Icon
            name="chevron-back-outline"
            size={33}
            style={{paddingLeft: 10}}
            color="white"
          />
        </TouchableOpacity>
      ),
    });
  }

  componentDidUpdate() {
    if (this.state.didLoadInitialLayout) {
      if (this.state.isMultiTasking) {
        return this.turnOffCamera(true);
      }
      if (this.state.device.initialized) {
        if (!this.state.device.hasCamera) {
          return this.turnOffCamera();
        }
        if (!this.state.device.permissionToUseCamera) {
          return this.turnOffCamera();
        }
      }

      if (this.props.cameraIsOn === true && !this.state.showScannerView) {
        return this.turnOnCamera();
      }

      if (this.props.cameraIsOn === false && this.state.showScannerView) {
        return this.turnOffCamera(true);
      }

      if (this.props.cameraIsOn === undefined) {
        return this.turnOnCamera();
      }
    }

    return null;
  }

  componentWillUnmount() {
    clearTimeout(this.imageProcessorTimeout);
  }

  postImages = async () => {
    const fd = new FormData();
    // console.log('==postimage filedata==');
    // console.log(filedata);

    this.state.preparedImgages.forEach((image) =>
      fd.append('mark', {
        name: image,
        uri: image,
        type: 'image/jpeg',
      }),
    );

    console.log('====fd===');
    console.log(fd);

    await axios
      .post('http://192.168.0.3:3001' + '/api/paper-upload/', fd, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const response = res.data;
        console.log(response.data.files);
        console.log('The paper images is successfully uploaded');
        // setUserPhoto(response.data.file.location);
        // updateProfile(response.data.file.location);
      })

      .catch((err) => {
        console.log('에러...');
        console.error(err);
      });
  };

  // Called after the device gets setup. This lets you know some platform specifics
  // like if the device has a camera or flash, or even if you have permission to use the
  // camera. It also includes the aspect ratio correction of the preview
  onDeviceSetup = (deviceDetails) => {
    const {
      hasCamera,
      permissionToUseCamera,
      flashIsAvailable,
      previewHeightPercent,
      previewWidthPercent,
    } = deviceDetails;
    this.setState({
      loadingCamera: false,
      device: {
        initialized: true,
        hasCamera,
        permissionToUseCamera,
        flashIsAvailable,
        previewHeightPercent: previewHeightPercent || 1,
        previewWidthPercent: previewWidthPercent || 1,
      },
    });
  };

  // Determine why the camera is disabled.
  getCameraDisabledMessage() {
    if (this.state.isMultiTasking) {
      return 'Camera is not allowed in multi tasking mode.';
    }

    const {device} = this.state;
    if (device.initialized) {
      if (!device.hasCamera) {
        return 'Could not find a camera on the device.';
      }
      if (!device.permissionToUseCamera) {
        return 'Permission to use camera has not been granted.';
      }
    }
    return 'Failed to set up the camera.';
  }

  // On some android devices, the aspect ratio of the preview is different than
  // the screen size. This leads to distorted camera previews. This allows for correcting that.
  getPreviewSize() {
    const dimensions = Dimensions.get('window');
    // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
    const heightMargin =
      ((1 - this.state.device.previewHeightPercent) * dimensions.height) / 2;
    const widthMargin =
      ((1 - this.state.device.previewWidthPercent) * dimensions.width) / 2;
    if (dimensions.height > dimensions.width) {
      // Portrait
      return {
        height: this.state.device.previewHeightPercent,
        width: this.state.device.previewWidthPercent,
        marginTop: heightMargin,
        marginLeft: widthMargin,
      };
    }

    // Landscape
    return {
      width: this.state.device.previewHeightPercent,
      height: this.state.device.previewWidthPercent,
      marginTop: widthMargin,
      marginLeft: heightMargin,
    };
  }

  // Capture the current frame/rectangle. Triggers the flash animation and shows a
  // loading/processing state. Will not take another picture if already taking a picture.
  capture = () => {
    if (this.state.takingPicture) {
      return;
    }
    if (this.state.processingImage) {
      return;
    }
    this.setState({takingPicture: true, processingImage: true});
    this.camera.current.capture();
    this.triggerSnapAnimation();

    // If capture failed, allow for additional captures
    this.imageProcessorTimeout = setTimeout(() => {
      if (this.state.takingPicture) {
        this.setState({takingPicture: false});
      }
    }, 100);
  };

  // The picture was captured but still needs to be processed.
  onPictureTaken = (event) => {
    this.setState({takingPicture: false});
    this.props.onPictureTaken(event);
  };

  // The picture was taken and cached. You can now go on to using it.
  onPictureProcessed = ({croppedImage, initialImage}) => {
    // this.props.onPictureProcessed(event);

    this.setState({
      takingPicture: false,
      processingImage: false,
      showScannerView: this.props.cameraIsOn || false,
      feedbackState: true,
      currentImage: croppedImage,
    });

    console.log('===initialImage===');
    console.log(initialImage);
    console.log('===croppedImage===');
    console.log(croppedImage);
  };

  // Flashes the screen on capture
  triggerSnapAnimation() {
    Animated.sequence([
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: true, // <-- Add this
      }),
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true, // <-- Add this
      }),
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0.6,
        delay: 100,
        duration: 120,
        useNativeDriver: true, // <-- Add this
      }),
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true, // <-- Add this
      }),
    ]).start();
  }

  // Hides the camera view. If the camera view was shown and onDeviceSetup was called,
  // but no camera was found, it will not uninitialize the camera state.
  turnOffCamera(shouldUninitializeCamera = false) {
    if (shouldUninitializeCamera && this.state.device.initialized) {
      this.setState(({device}) => ({
        showScannerView: false,
        device: {...device, initialized: false},
      }));
    } else if (this.state.showScannerView) {
      this.setState({showScannerView: false});
    }
  }

  // Will show the camera view which will setup the camera and start it.
  // Expect the onDeviceSetup callback to be called
  turnOnCamera() {
    if (!this.state.showScannerView) {
      this.setState({
        showScannerView: true,
        loadingCamera: true,
      });
    }
  }

  // Renders the camera controls. This will show controls on the side for large tablet screens
  // or on the bottom for phones. (For small tablets it will adjust the view a little bit).
  renderCameraControls() {
    const dimensions = Dimensions.get('window');
    const aspectRatio = dimensions.height / dimensions.width;
    const isPhone = aspectRatio > 1.6;
    const cameraIsDisabled =
      this.state.takingPicture || this.state.processingImage;
    const disabledStyle = {opacity: cameraIsDisabled ? 0.8 : 1};
    if (!isPhone) {
      if (dimensions.height < 500) {
        return (
          <View style={styles.buttonContainer}>
            <View style={[styles.cameraOutline, disabledStyle]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraButton}
                onPress={this.capture}
              />
            </View>
          </View>
        );
      }
      return (
        <View style={styles.buttonContainer}>
          <View style={[styles.cameraOutline, disabledStyle]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cameraButton}
              onPress={this.capture}
            />
          </View>
        </View>
      );
    }

    return (
      <>
        <View style={styles.buttonBottomContainer}>
          <View style={{flex: 1, backgroundColor: 'green'}} />

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.cameraOutline, disabledStyle]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraButton}
                onPress={this.capture}
              />
            </View>
          </View>

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            {this.state.isScanned && (
              <TouchableOpacity
                style={styles.completebtn}
                onPress={() => {
                  {
                    this.postImages();
                  }
                }}>
                <Text style={{color: 'black', fontSize: wp(4.5)}}>완료</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </>
    );
  }

  // Renders the camera controls or a loading/processing state
  renderCameraOverlay() {
    let loadingState = null;
    if (this.state.loadingCamera) {
      loadingState = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
    } else if (this.state.processingImage) {
      loadingState = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#333333" size="large" />
              <Text style={{color: '#333333', fontSize: 30, marginTop: 10}}>
                Processing
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <>
        {loadingState}
        <SafeAreaView style={[styles.overlay]}>
          {this.renderCameraControls()}
        </SafeAreaView>
      </>
    );
  }

  feedback = (option) => {
    if (option == 1) {
      //다시 찍기
      this.setState({
        feedbackState: false,
      });
    } else {
      //사용하ㄱㅣ
      this.setState({
        feedbackState: false,
        preparedImgages: [
          ...this.state.preparedImgages,
          'file://' + this.state.currentImage,
        ],
        isScanned: true,
      });

      console.log('====this.state.preparedImgages===');
      console.log(this.state.preparedImgages);
    }
  };

  feedbackOverlay() {
    if (this.state.feedbackState) {
      return (
        <>
          <SafeAreaView style={[styles.overlay, {backgroundColor: 'white'}]}>
            <View
              style={{
                height: hp(10),
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: hp(3),
              }}>
              <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>
                📄 스캔 결과
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ScrollView
                style={{
                  height: hp(65),
                  // justifyContent: 'center',
                  // alignItems: 'center',
                }}>
                <AutoHeightImage
                  source={{
                    uri: this.state.currentImage,
                  }}
                  style={styles.feedbackImg}
                  width={wp(90)}
                />
              </ScrollView>
            </View>

            {/*버튼*/}
            <View
              style={{
                height: hp(15),
                paddingTop: hp(7),
              }}>
              <View style={styles.btnContainer}>
                <View style={styles.btnArea_l}>
                  <TouchableOpacity
                    style={styles.delbtnoutline}
                    onPress={() => {
                      {
                        this.feedback(1);
                      }
                    }}>
                    <Text>다시찍기</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.btnArea_r}>
                  <TouchableOpacity
                    style={styles.delbtn}
                    onPress={() => {
                      {
                        this.feedback(2);
                      }
                    }}>
                    <Text style={{color: 'white'}}>사용하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      );
    }
  }

  // Renders either the camera view, a loading state, or an error message
  // letting the user know why camera use is not allowed
  renderCameraView() {
    if (this.state.showScannerView) {
      const previewSize = this.getPreviewSize();
      let rectangleOverlay = null;
      if (!this.state.loadingCamera && !this.state.processingImage) {
        rectangleOverlay = (
          <RectangleOverlay
            detectedRectangle={this.state.detectedRectangle}
            previewRatio={previewSize}
            backgroundColor="rgba(105,144,247, 0.2)"
            borderColor="rgb(105,144,247)"
            borderWidth={4}
          />
        );
      }
      // NOTE: I set the background color on here because for some reason the view doesn't line up correctly otherwise. It's a weird quirk I noticed.
      return (
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            position: 'relative',
            marginTop: previewSize.marginTop,
            marginLeft: previewSize.marginLeft,
            height: `${previewSize.height * 100}%`,
            width: `${previewSize.width * 100}%`,
          }}>
          <Scanner
            onPictureTaken={this.onPictureTaken}
            onPictureProcessed={this.onPictureProcessed}
            enableTorch={this.state.flashEnabled}
            filterId={2}
            ref={this.camera}
            capturedQuality={0.6}
            onRectangleDetected={({detectedRectangle}) =>
              this.setState({detectedRectangle})
            }
            onDeviceSetup={this.onDeviceSetup}
            // onTorchChanged={({enabled}) =>
            //   this.setState({flashEnabled: enabled})
            // }
            style={styles.scanner}
          />
          {rectangleOverlay}
          <Animated.View
            style={{
              ...styles.overlay,
              backgroundColor: 'white',
              opacity: this.state.overlayFlashOpacity,
            }}
          />
          {this.renderCameraOverlay()}
          {this.feedbackOverlay()}
        </View>
      );
    }

    let message = null;
    if (this.state.loadingCamera) {
      message = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
    } else {
      message = (
        <Text style={styles.cameraNotAvailableText}>
          {this.getCameraDisabledMessage()}
        </Text>
      );
    }

    return <View style={styles.cameraNotAvailableContainer}>{message}</View>;
  }

  render() {
    return (
      <View
        style={styles.container}
        onLayout={(event) => {
          // This is used to detect multi tasking mode on iOS/iPad
          // Camera use is not allowed
          this.props.onLayout(event);
          if (this.state.didLoadInitialLayout && Platform.OS === 'ios') {
            const screenWidth = Dimensions.get('screen').width;
            const isMultiTasking =
              Math.round(event.nativeEvent.layout.width) <
              Math.round(screenWidth);
            if (isMultiTasking) {
              this.setState({isMultiTasking: true, loadingCamera: false});
            } else {
              this.setState({isMultiTasking: false});
            }
          } else {
            this.setState({didLoadInitialLayout: true});
          }
        }}>
        {this.renderCameraView()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonActionGroup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonBottomContainer: {
    alignItems: 'center',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 25,
    position: 'absolute',
    right: 25,
    // backgroundColor: 'yellow',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    bottom: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 25,
    top: 25,
  },
  buttonGroup: {
    backgroundColor: '#00000080',
    borderRadius: 17,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 22,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
  buttonTopContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
    top: 40,
  },
  cameraButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
    margin: 3,
  },
  cameraNotAvailableContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  cameraNotAvailableText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  cameraOutline: {
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  flashControl: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    margin: 8,
    paddingTop: 7,
    width: 50,
  },
  loadingCameraMessage: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(220, 220, 220, 0.7)',
    borderRadius: 16,
    height: 140,
    justifyContent: 'center',
    width: 200,
  },
  scanner: {
    flex: 1,
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
    width: wp(42),
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
    width: wp(42),
    height: hp(5),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
  },

  completebtn: {
    margin: wp(5),
    width: wp(15),
    height: hp(3.5),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
