import React from 'react';
import { registerComponent } from 'react-native-playground';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Hello there!
        </Text>
        <Text style={styles.instructions}>
          Edit and save with Cmd+S (Mac) or Ctrl+S (Windows). Changes will
          be reflected immediately in the simulator or on your device.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  },
});

registerComponent(SampleApp);
