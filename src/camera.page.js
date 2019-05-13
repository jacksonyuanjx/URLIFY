import React from 'react';
import { View, Text } from 'react-native';
import { Camera, Permissions } from 'expo';
import Toolbar from './toolbar.component';

import Environment from '../config/environment';  // Vision API key is stored here
import Gallery from './gallery.component';

// importing modals
import Loader from './loader.component';
import UrlModal from './url_modal.component';
import BadRespModal from './badResp_modal.component';

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
        badResponseReceived: false,
        responseReceived: false,
        loading: false,
        responseUrls: [],
        activeUrl: null
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

    async componentWillMount() {
        console.log("componentWillMount()!!!");
    }

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

    // helper function that detects url according to RFC 1738 spec.
    // Regex from here: https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
    urlify = async (text) => {
        var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
        // return text.replace(urlRegex, function(url) {
        //     return '<a href="' + url + '">' + url + '</a>';
        // });
        return text.match(urlRegex);
    }

    closeModal = async () => {
        this.setState({responseReceived: false, badResponseReceived: false});
    }

    handleUrlBtnPress = async (url) => {
        console.log(url);
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

            // set loader modal visibility to true
            this.setState({loading: true});

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
            try {
                let text = responseParsed.responses[0].fullTextAnnotation.text;
                this.urlify(text).then((result) => {
                    if (result != null) {
                        console.log(result);
                        // iterate through result and present in modal, set responseReceived to 'true'
                        this.setState({responseUrls: result, responseReceived: true});
                    } else {
                        console.log("no match detected!");
                        // set badResponseReceived to 'true'
                        this.setState({badResponseReceived: true});
                    }
                });
            } catch(err) {
                // will often be caught here if picture is too blurry and API response produces undefined 'text' key in JSON
                // console.log(err);
                console.log("response has undefined text field");
                this.setState({badResponseReceived: true});
            }
            this.setState({loading: false});
            this.setState({
                googleResponse: responseJson,
                uploading: false
            });
        } catch (error) {
            console.log(error);
        }
    };
    

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures, responseUrls } = this.state;   // why gotta do this? why can't just access this.state.____

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

                <Loader loading={this.state.loading} />
                <BadRespModal badResponseReceived={this.state.badResponseReceived}  
                              onCloseModal={this.closeModal} />
                <UrlModal responseReceived={this.state.responseReceived} 
                          responseUrls={this.state.responseUrls} 
                          onCloseModal={this.closeModal} 
                          onUrlBtnPress={this.handleUrlBtnPress.bind(this)} />

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