// import React, { useEffect } from 'react';
// import {
//   BluetoothManager,
//   BluetoothEscposPrinter,
// } from 'react-native-bluetooth-escpos-printer';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

//   const requestLocationPermission = async () => {
//     const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//     if (result === RESULTS.GRANTED) {
//       return true;
//     }

//     const requestResult = await request(
//       PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//     );
//     return requestResult === RESULTS.GRANTED;
//   };

//   const initializeBluetooth = () => {
//     BluetoothManager.isBluetoothEnabled().then((enabled) => {
//       if (!enabled) {
//         BluetoothManager.enableBluetooth()
//           .then(() => {
//             console.log('Bluetooth is now enabled.');
//           })
//           .catch((error) => {
//             console.log('Error enabling Bluetooth:', error);
//           });
//       }
//     });
//   };

//   const scanDevices = async (receiptText) => {
//     try {
//       await BluetoothManager.startScan();
//       BluetoothManager.onDeviceFound((device) => {
//         console.log('Found device:', device);
//         if (device.name === 'Your_Printer_Name') {
//           // Connect to the printer and print
//           connectAndPrint(device, receiptText);
//         }
//       });
//     } catch (error) {
//       console.log('Error scanning for devices:', error);
//     }
//   };

//   const connectAndPrint = async (device, receiptText) => {
//     try {
//       await BluetoothManager.connect(device.id);
//       await BluetoothEscposPrinter.printText(receiptText, {});
//       await BluetoothEscposPrinter.printColumn(
//         [10, 10],
//         [
//           BluetoothEscposPrinter.ALIGN.LEFT,
//           BluetoothEscposPrinter.ALIGN.RIGHT,
//         ],
//         ['Left column', 'Right column'],
//         {}
//       );
//       await BluetoothEscposPrinter.printBarCode(
//         '12345678',
//         BluetoothEscposPrinter.BARCODETYPE.UPC_A,
//         3,
//         60,
//         0,
//         2
//       );
//       await BluetoothEscposPrinter.printQRCode(
//         'https://www.example.com',
//         200,
//         BluetoothEscposPrinter.ERROR_CORRECTION_LEVEL.L
//       );
//       await BluetoothEscposPrinter.printNewLine();
//       await BluetoothEscposPrinter.printText('Footer text\n', {});
//       await BluetoothEscposPrinter.printCut();
//     } catch (error) {
//       console.log('Error connecting and printing:', error);
//     }
//   };
// };

// // Export the scanAndPrint function
// export const scanAndPrint = async (receiptText) => {
//   const granted = await requestLocationPermission();
//   if (!granted) {
//     console.log('Location permission is required to use Bluetooth.');
//     return;
//   }

//   initializeBluetooth();
//   await scanDevices(receiptText);
// };;
