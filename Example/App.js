import React from 'react';
import { View } from 'react-native';
import Test1Component from './components/Test1Component';

class App extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Test1Component />
            </View>
        )
    }
}

export default App;