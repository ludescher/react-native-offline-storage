import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { smartcomponent } from '../../react-native-smartcomponent';

class Test1Component extends React.Component {

    constructor(props) {
        super(props);

        console.log("Test1Component()", this);
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.testCall()}>
                <Text>
                    Test
            </Text>
            </TouchableOpacity>
        );
    }
}

export default smartcomponent(require('./Controller').default)(Test1Component);