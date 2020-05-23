import React from 'react';
import { Text } from 'react-native';
import { BindLogic } from '../../react-native-mvc';

class Test1Component extends React.Component {
    render() {
        return (
            <Text>
                Test
            </Text>
        );
    }
}

// export default Test1Component;

export default BindLogic(require('./Controller').default)(Test1Component);