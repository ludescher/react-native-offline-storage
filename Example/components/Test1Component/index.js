import React from 'react';
import { Text } from 'react-native';
import { BindLogic } from 'react-native-offline-storage';

class Test1Component extends React.Component {
    render() {
        return (
            <Text>
                Test
            </Text>
        );
    }
}

export default BindLogic(Test1Component, require('./Controller').default);