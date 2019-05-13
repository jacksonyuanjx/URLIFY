import React from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';

import styles from './styles';

const BadRespModal = props => {
    const { badResponseReceived, onCloseModal, ...attributes } = props;

    return (
        <Modal visible={badResponseReceived} transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.badRespModalWrapper}>
                    <View style={styles.spacerBadResp} />
                    <Text>No URL detected! Please take another picture.</Text>
                    <View style={styles.spacerBadResp} />

                    <TouchableOpacity onPress={onCloseModal} style={styles.closeButton} activeOpacity={.15}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
export default BadRespModal;
