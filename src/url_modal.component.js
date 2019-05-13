import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Modal, ActivityIndicator } from 'react-native';

import styles from './styles';

const UrlModal = props => {
    const { responseReceived, ...attributes } = props;

    return(
        <Modal visible={responseReceived} transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.urlModalWrapper}>

                </View>
            </View>
        </Modal>
    )
}
