import React from 'react';
import { View, Text } from 'react-native';
import { Camera, Permissions } from 'expo';
import Toolbar from './toolbar.component';
import RNTextDetector from 'react-native-text-detector';

import Environment from '../config/environment';
import Gallery from './gallery.component';

import styles from './styles';

export default class CameraPage extends React.Component {
    camera = null;   // will hold reference to actual camera component

    state = {
        captures: [],  // stores all photos/videos captured thru camera
        // setting flash to be turned off by default
        flashMode: Camera.Constants.FlashMode.off,
        capturing: null,
        // start the back camera by default
        cameraType: Camera.Constants.Type.back,
        hasCameraPermission: null,   // to access device camera, user needs to permit access
    };

    // updates state with values passed into these functions
    setFlashMode = (flashMode) => this.setState({ flashMode }); 
    setCameraType = (cameraType) => this.setState({ cameraType });

    // sets capturing state to true, func will be called everytime capture btn is pressed
    handleCaptureIn = () => this.setState({ capturing: true});

    // attempts to stop recording video if 'capturing' is set to 'true', using the stopRecording() method
    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };

    // uses takePictureAsync() of the camera component to take photo, add returned data to captures[], set 'capturing' to 'false'
    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        this.setState({ capturing: false, captures: [photoData, ...this.state.captures] })
    };

    // uses recordAsync() of camera component to tell camera to start recording video, called from Toolbar component
    // save returned data in captures[] using ES6 array spreading
    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
    };


    // using componentDidMount() lifecycle to request permissions from user
    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);      // Expo provides the Permissions module
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);      // askAsync returns an obj w/ 'status' property set to 'granted' if user accepts the request
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

        this.setState({ hasCameraPermission });
    };

    detectText = async () => {
        try {
          const options = {
            quality: 0.8,
            base64: true,
            skipProcessing: true,
          };
          const uri = await this.camera.takePictureAsync(options);
        //   const visionResp = await RNTextDetector.detectFromUri(uri);
          console.log('visionResp', visionResp);
        } catch (e) {
          console.warn(e);
        }
    };

    // helper function that detects url (does not detect urls beginning w/ "www.")
    urlify = async (text) => {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        // return text.replace(urlRegex, function(url) {
        //     return '<a href="' + url + '">' + url + '</a>';
        // });
        return text.match(urlRegex);
    }

    submitToGoogle = async () => {
        try {
            this.setState({ uploading: true });
            // let { image } = this.state;
            const options = {
                quality: 0.8,
                base64: true,
                skipProcessing: true,
            };
            const uri = await this.camera.takePictureAsync(options);
            // console.log(uri.base64);
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: 'TEXT_DETECTION', maxResults: 5 }
                        ],
                        image: {
                            content: uri.base64
                        }
                    }
                ]
            });
            let response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=' +
                    Environment['GOOGLE_CLOUD_VISION_API_KEY'],
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body
                }
            );
            let responseJson = await response.json();
            // console.log(responseJson);
            let responseParsed = JSON.parse(JSON.stringify(responseJson));
            // console.log(responseParsed.responses[0].fullTextAnnotation.text);
            let text = responseParsed.responses[0].fullTextAnnotation.text;
            this.urlify(text).then((result) => {
                console.log(result[0]);
            });
            this.setState({
                googleResponse: responseJson,
                uploading: false
            });
        } catch (error) {
            console.log(error);
        }
    };
    

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;   // why gotta do this? why can't just access this.state.____

        if (hasCameraPermission === null) {
            return <View />;  // user has not denied or accepted permissions
        } else if (hasCameraPermission === false) {
            // user has denied any permissions
            return <Text>Access to camera has been denied.</Text>;
        }

        // if reached here, user has accepted all permissions
        return (
            // React.Fragment allows rendering multiple elmts w/o a wrapper component b/c 
            // React does not normally allow rendering multiple children w/o a parent wrapper
            <React.Fragment>  
                <View>
                    <Camera type={cameraType}
                            flashMode={flashMode}
                            style={styles.preview} 
                            ref={camera => this.camera = camera}/>
                </View>

                {captures.length > 0 && <Gallery captures={captures}/>}

                <Toolbar 
                    capturing={capturing}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={this.setFlashMode}
                    setCameraType={this.setCameraType}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    onLongCapture={this.handleLongCapture}
                    onShortCapture={this.submitToGoogle}
                />
            </React.Fragment>
        );
    };
};