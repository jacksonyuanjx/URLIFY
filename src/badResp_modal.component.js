import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Modal, TouchableOpacity } from 'react-native';

import styles from './styles';

const BadRespModal = props => {
    const { badResponseReceived, onCloseModal, ...attributes } = props;
    return(
        <Modal visible={badResponseReceived} transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.badRespModalWrapper}>
                    <Text>No URL detected! Please take another picture.</Text>
                    <TouchableOpacity onPress={onCloseModal} style={styles.closeButton} activeOpacity={.15}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
export default BadRespModal;

// export default ({
//     onCloseModal
// }) => (
//         <Modal visible={responseReceived} transparent={true}>
//             <View style={styles.modalBackground}>
//                 <View style={styles.badRespModalWrapper}>
//                     <Text>No URL detected! Please take another picture.</Text>
//                     <TouchableOpacity onPress={onCloseModal}>
//                         <Text>Close</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
// );
