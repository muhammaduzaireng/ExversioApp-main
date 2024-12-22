/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Use the app name from app.json as the first parameter
AppRegistry.registerComponent(appName, () => App);
