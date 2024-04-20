/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler'

// import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn'
// import * as ZIM from 'zego-zim-react-native';
// import * as ZPNs from 'zego-zpns-react-native';

// ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

const Root = () => (
    <GestureHandlerRootView style={{flex: 1}}>
        <App />
    </GestureHandlerRootView>
)

AppRegistry.registerComponent(appName, () => Root);
