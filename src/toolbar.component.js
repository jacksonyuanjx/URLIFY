// component that holds the action buttons for the camera
// this is a 'functional component' -- the component is defined as a function
import React from 'react';
import { Camera } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import { View, TouchableOpacity } from 'react-native';

import styles from './styles';

// Camera.Constants obj contains a # of key-value pairs to access various modes/settings of camera component
// FlashMode is for camera flash; Type is for front/back camera
const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;  // using obj destructuring to assign to more MEANINGFUL names


export default ({ 
    capturing = false, 
    cameraType = CameraTypes.back, 
    flashMode = CameraFlashModes.off, 
    setFlashMode, setCameraType, 
    onShortCapture,
    // onCaptureIn, onCaptureOut, onLongCapture, detectText,
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

