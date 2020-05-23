import React from 'react';
import { Text } from 'react-native';
import { BindLogic } from '../../../dist/main';

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