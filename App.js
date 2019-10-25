import React, { Fragment } from 'react';
import { Button, Image, Text, View, Linking, ActivityIndicator, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TrasformableImage from './transformable-image';
import FloatingToolbar from './floating-toolbar';
import ActionButton from './action-button';
import ActionButtonWithText from './action-button-with-text';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import i18n from './i18n/i18n';
import * as Permissions from 'expo-permissions';
import Camera from './Camera';
import * as Brightness from 'expo-brightness';
import Help from './help'


export default class App extends React.Component {
  state = {
    image: null,
    width: null,
    height: null,
    locked: false,
    help: false,
    camera: null,
    photoLoader: false,
    mirror: false,
    brightness: false,
  };

  constructor(props) {
    super(props);
    this.cameraRef = React.createRef();
  }

  render() {
    let { image, width, height, locked, help, camera, photoLoader, mirror, brightness } = this.state;

    if (help) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
          <Help />
          <FloatingToolbar top={true} left={true}>
            <ActionButton onPress={this._toMain} text={i18n.t("button_back")} textPosition="right" iconName="md-arrow-back" />
          </FloatingToolbar>
        </View>
      );
    }

    if (!image && !camera) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
          <ActionButtonWithText onPress={this._pickImage} iconName="md-photos" text={i18n.t('pick_a_image')} />
          <ActionButtonWithText onPress={this._openCamera} iconName="md-camera" text={i18n.t('camera')} />
          <FloatingToolbar top={true}>
            <ActionButton onPress={this._toHelp} text={i18n.t("button_help")} iconName="md-help" />
          </FloatingToolbar>
        </View>
      );
    } else if (!image && camera) {
      return (
        <Camera ref={this.cameraRef}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {photoLoader && <ActivityIndicator size="large" color="#ffffff" />}

            <FloatingToolbar top={true} left={true}>
              <ActionButton onPress={this._closeCamera} text={i18n.t("button_back")} textPosition="right" iconName="md-arrow-back" />
            </FloatingToolbar>

            <FloatingToolbar>
              <ActionButton onPress={this._snap} text={i18n.t("button_takephoto")} iconName="md-camera" />
            </FloatingToolbar>

          </View>
        </Camera>
      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <TrasformableImage mirror={mirror} image={image} width={width} height={height} locked={locked} />
          {!locked &&
            <FloatingToolbar top={true} left={true}>
              <ActionButton onPress={this._resetImage} text={i18n.t("button_back")} textPosition="right" iconName="md-arrow-back" />
            </FloatingToolbar>
          }
          <FloatingToolbar left={true}>
            {!locked && <ActionButton onPress={this._brightness} text={i18n.t("button_brightness")} textPosition="right" iconName="md-sunny" />}
            {!locked && <ActionButton onPress={this._mirror} text={i18n.t("button_mirror")} textPosition="right" iconName="md-repeat" />}
          </FloatingToolbar>
          <FloatingToolbar>
            {!locked && <ActionButton onPress={this._lock} text={i18n.t("button_lock")} iconName="md-unlock" />}
            {locked && <ActionButton onPress={this._unlock} text={i18n.t("button_unlock")} iconName="md-lock" />}
          </FloatingToolbar>
        </View>
      );
    }
  }

  _brightness = async () => {
    if (!this.state.brightness) {
      await Brightness.setBrightnessAsync(1);
    } else {
      await Brightness.useSystemBrightnessAsync();
    }
    this.state.brightness ? this.setState({ brightness: false }) : this.setState({ brightness: true });
  }

  _mirror = () => {
    this.state.mirror ? this.setState({ mirror: false }) : this.setState({ mirror: true });
  }

  _lock = () => {
    this.setState({ locked: true }, () => {
      ToastAndroid.show(i18n.t('toast_screen_locked'), ToastAndroid.SHORT);
    });
    activateKeepAwake();
  }

  _unlock = () => {
    this.setState({ locked: false }, () => {
      ToastAndroid.show(i18n.t('toast_screen_unlocked'), ToastAndroid.SHORT);
    });
    deactivateKeepAwake();
  }

  _pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      this.setState({ image: result.uri, width: result.width, height: result.height }, () => {
        ToastAndroid.show(i18n.t('toast_image_loaded'), ToastAndroid.SHORT);
      });
    }
  }

  _openCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const camera = status === 'granted';
    this.setState({ camera }, () => {
      if (!this.state.camera) {
        ToastAndroid.show(i18n.t('toast_no_access_to_camera'), ToastAndroid.SHORT);
      }
    });
  }

  _snap = async () => {
    if (this.cameraRef) {
      this.setState({ photoLoader: true }, async () => {
        const photo = await this.cameraRef.current.takePictureAsync();
        this.setState({ image: photo.uri, width: photo.width, height: photo.height, camera: false, photoLoader: false });
      });
    }
  };

  _closeCamera = () => {
    this.setState({ camera: false });
  }

  _resetImage = () => {
    this.setState({ image: null });
  }

  _toHelp = () => {
    this.setState({ help: true });
  }

  _toMain = () => {
    this.setState({ help: false });
  }
}
