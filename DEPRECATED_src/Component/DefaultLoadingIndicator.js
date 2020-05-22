import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function DefaultLoadingIndicator() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#d13878" />
        </View>
    );
}