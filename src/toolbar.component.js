// component that holds the action buttons for the camera
// this is a 'functional component' -- the component is defined as a function
import React from 'react';
import { Camera } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import styles from './styles';

// Camera.Constants obj contains a # of key-value pairs to access various modes/settings of camera component
// FlashMode is for camera flash; Type is for front/back camera
const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;  // using obj destructuring to assign to more MEANINGFUL names



export default ({ 
    capturing = false, 
    cameraType = CameraTypes.back, 
    flashMode = CameraFlashModes.off, 
    setFlashMode, setCameraType, 
    onCaptureIn, onCaptureOut, onLongCapture, onShortCapture, detectText,
}) => (
    <Grid style={styles.bottomToolbar}>
        <Row>
            <Col style={styles.alignCenter}>
                <TouchableOpacity onPress={() => setFlashMode( 
                    flashMode === CameraFlashModes.on ? CameraFlashModes.off : CameraFlashModes.on 
                )}>
                    <Ionicons
                        name={flashMode == CameraFlashModes.on ? "md-flash" : 'md-flash-off'}
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
            <Col size={2} style={styles.alignCenter}>
                {/* 4 events account for recording video (press & hold) and taking photos */}
                {/* <TouchableWithoutFeedback
                    onPressIn={onCaptureIn}
                    onPressOut={onCaptureOut}
                    onLongPress={onLongCapture}
                    onPress={onShortCapture}>

                    <View style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
                        {capturing && <View style={styles.captureBtnInternal} />}
                    </View>
                </TouchableWithoutFeedback> */}
                <TouchableOpacity onPress={onShortCapture}>
                    <View style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
                        {capturing && <View style={styles.captureBtnInternal} />}
                    </View>
                </TouchableOpacity>
            </Col>
            <Col style={styles.alignCenter}>
                <TouchableOpacity onPress={() => setCameraType(
                    cameraType === CameraTypes.back ? CameraTypes.front : CameraTypes.back
                )}>
                    <Ionicons
                        name="md-reverse-camera"
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
        </Row>
    </Grid>
);


// takePicture = async camera => {
//     this.setState({
//       loading: true
//     });
//     try {
//       const data = await camera.takePictureAsync(PICTURE_OPTIONS);
//       if (!data.uri) {
//         throw "OTHER";
//       }
//       this.setState(
//         {
//           image: data.uri
//         },
//         () => {
//           console.log(data.uri);
//           this.processImage(data.uri, {
//             height: data.height,
//             width: data.width
//           });
//         }
//       );
//     } catch (e) {
//       console.warn(e);
//       this.reset(e);
//     }
//   };

//   /**
//    * processImage
//    *
//    * Responsible for getting image from react native camera and
//    * starting image processing.
//    *
//    * @param {string} uri              Path for the image to be processed
//    * @param {object} imageProperties  Other properties of image to be processed
//    * @memberof App
//    * @author Zain Sajjad
//    */
//   processImage = async (uri, imageProperties) => {
//     const visionResp = await RNTextDetector.detectFromUri(uri);
//     console.log(visionResp);
//     if (!(visionResp && visionResp.length > 0)) {
//       throw "UNMATCHED";
//     }
//     this.setState({
//       visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
//     });
//   };

//   /**
//    * mapVisionRespToScreen
//    *
//    * Converts RNTextDetectors response in representable form for
//    * device's screen in accordance with the dimensions of image
//    * used to processing.
//    *
//    * @param {array}  visionResp       Response from RNTextDetector
//    * @param {object} imageProperties  Other properties of image to be processed
//    * @memberof App
//    */
//   mapVisionRespToScreen = (visionResp, imageProperties) => {
//     const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
//     const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;

//     return visionResp.map(item => {
//       return {
//         ...item,
//         position: {
//           width: item.bounding.width * IMAGE_TO_SCREEN_X,
//           left: item.bounding.left * IMAGE_TO_SCREEN_X,
//           height: item.bounding.height * IMAGE_TO_SCREEN_Y,
//           top: item.bounding.top * IMAGE_TO_SCREEN_Y
//         }
//       };
//     });
//   };




