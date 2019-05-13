import { StyleSheet, Dimensions } from 'react-native';

const { width: winWidth, height: winHeight } = Dimensions.get('window');  // using ES6 object destructuring

export default StyleSheet.create({
    preview: {
        height: winHeight,
        width: winWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    alignCenter: {  // this sill horizontally and vertically center all of an element's children
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomToolbar: {    // makes our entire toolbar full width of our device screen and positions it at the bottom of the screen
        width: winWidth,
        position: 'absolute',
        height: 100,
        bottom: 0,
    },
    captureBtn: {   // circular button with white border by default
        width: 60,
        height: 60,
        borderWidth: 2,
        borderRadius: 60,
        borderColor: "#FFFFFF",
    },
    captureBtnActive: {
        // makes the button a bit larger in size when the user taps on the button and by making it bigger,
        // we can make sure that the entire button isn't covered by user's finger
        width: 80,
        height: 80,
    },
    // captureBtnInternal: {
    //     // renders a red circle inside the capture button to indicate that the camera is either recording a video or taking a picture
    //     width: 76,
    //     height: 76,
    //     borderWidth: 2,
    //     borderRadius: 76,
    //     backgroundColor: "red",
    //     borderColor: "transparent",
    // },
    // galleryContainer: { 
    //     bottom: 100 
    // },
    // galleryImageContainer: { 
    //     width: 75, 
    //     height: 75, 
    //     marginRight: 5 
    // },
    // galleryImage: { 
    //     width: 75, 
    //     height: 75 
    // },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    urlModalWrapper: {
        backgroundColor: '#FFFFFF',
        height: 175,
        width: 200,
        borderRadius: 10,
    },
    badRespModalWrapper: {
        backgroundColor: '#FFFFFF',
        height: 125,
        width: 150,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    closeButton: {
        height: 40,
        width: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f5f7',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    closeButtonUrlModal: {
        height: 40,
        width: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f5f7',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    urlModalTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    spacer: {
        height: 10,
        width: 200,
        backgroundColor: '#FFFFFF',
    },
    spacerBadResp: {
        height: 17.5,
        width: 150,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    urlItem: {
        width: 200,
        color: '#000000',
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center'
    },
});