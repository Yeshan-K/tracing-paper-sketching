import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from './styles';
import { Ionicons } from '@expo/vector-icons';

export default class ActionButton extends Component {
  constructor(props) {
    super(props);
  }

  renderButtonText() {
    const { text } = this.props;
    return <Text style={styles.buttonText}>{text}</Text>;
  }

  render() {
    const { onPress, iconName, textPosition, text, lightMode } = this.props;


    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
            {text && textPosition === 'left' &&
              <View style={{backgroundColor: lightMode ? 'rgba(232, 232, 232, 0.8)' : 'rgba(52, 52, 52, 0.8)', borderRadius: 25}}>
                <Text style={{paddingHorizontal: 10}}>{this.renderButtonText()}</Text>
              </View>
            }
            <View style={styles.button}>
                <Ionicons name={iconName} size={24} color="#444" />
            </View>
            {text && textPosition === 'right' &&
              <View style={{ backgroundColor: lightMode ? 'rgba(232, 232, 232, 0.8)' : 'rgba(52, 52, 52, 0.8)', borderRadius: 25}}>
                <Text style={{paddingHorizontal: 10}}>{this.renderButtonText()}</Text>
              </View>
            }
        </View>
      </TouchableOpacity>
    );
  }
}

ActionButton.defaultProps = {
  textPosition: 'left'
}

const styles = Styles.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonText: {
    color: 'gray',
    fontSize: 22,
    marginHorizontal: 10,
    includeFontPadding: false,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginTop: 5,
  }
});

