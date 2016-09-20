import React from 'react';
import {
  registerComponent,
} from 'react-native-playground';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Edit and save with Cmd+S (Mac) or Ctrl+S (Windows). Changes will
          be reflected immediately in the simulator or on your device.
        </Text>

        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    margin: 15,
  },
});

registerComponent(App);
