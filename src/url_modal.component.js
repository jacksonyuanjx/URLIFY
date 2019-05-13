import React from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView, Linking } from 'react-native';

import styles from './styles';

const UrlModal = props => {
    const { responseReceived, onCloseModal, responseUrls, ...attributes } = props;

    return (
        <Modal visible={responseReceived} transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.urlModalWrapper}>
                    <Text style={styles.urlModalTitle}>Urls Detected</Text>
                    <View style={styles.spacer} />

                    <ScrollView>
                    {
                        responseUrls.map((url, key) => (
                            <View key = { key }>
                                <TouchableOpacity onPress={() => {
                                    // handle case where Linking.canOpenUrl returns false (e.g when URL does not start with http or https)
                                    if (!url.startsWith("https://") && !url.startsWith("http://")) {
                                        url = "https://" + url;
                                    }
                                    // Invariant: url will be openable at this point
                                    Linking.canOpenURL(url).then(supported => {
                                        if (supported) {
                                            Linking.openURL(url);
                                        } else {
                                            // Note: should not reach here
                                            // console.log("cannot open URL" + url);
                                        }
                                    });
                                }}>
                                    <Text style={styles.urlItem}>{ url }</Text>
                                </TouchableOpacity>
                                <View style={styles.spacer} />
                            </View>
                        ))
                    }
                    </ScrollView>
                    <TouchableOpacity onPress={onCloseModal} style={styles.closeButtonUrlModal} activeOpacity={.15}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
export default UrlModal;


// Useful site for learning how to pass data btwn components (parent --> child and even child --> parent)
// https://medium.com/@ruthmpardee/passing-data-between-react-components-103ad82ebd17