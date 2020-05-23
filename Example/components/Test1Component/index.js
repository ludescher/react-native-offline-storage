import React from 'react';
import { Text } from 'react-native';
import { mvc } from '../../react-native-mvc';

class Test1Component extends React.Component {
    render() {
        return (
            <Text>
                Test
            </Text>
        );
    }
}

export default mvc(require('./Controller').default)(Test1Component);