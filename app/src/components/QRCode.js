import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const QR = ({value, getRef}) => {
    return(
        <QRCode
            value={value}
            size={280}
            color="black"
            backgroundColor="white"
            getRef={getRef}
        />
    )
}

export default QR
