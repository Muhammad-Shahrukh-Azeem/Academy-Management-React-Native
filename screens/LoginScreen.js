import React, { useEffect, useState, useContext } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import UserRoleContext from '../contexts/UserRoleContext';
import firestore from '@react-native-firebase/firestore';


const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation()

  const { setUserRole } = useContext(UserRoleContext);



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // console.log("USER", user)

      if (user) {

        const docRef = firestore().collection('userRoles').doc(user.uid);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const userRole = docSnap.data().Role;
          setUserRole(userRole);
          // Navigate to appropriate screen based on userRole
          if (userRole === 'Admin') {
            navigation.replace('AdminHome');
          } else {
            navigation.replace('Home');
          }
        } else {
          console.log("userRoles doc not found for user: ", user); // Debug statement
          // Handle the case when no user role is found, e.g., show an error message or log out the user
        }
      }
    });
    return unsubscribe;
  }, []);
  const modal = (
    <Modal
      animationType="fade"
      transparent
      visible={isLoading}
      onRequestClose={() => { }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: 'white' }}>Loading...</Text>
      </View>
    </Modal>
  );

  const handleLogin = () => {

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        // console.log(user)

      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior="center">
        <Text style={styles.heading}>Expert's Management System</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Branch ID"
            placeholderTextColor="grey"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="grey"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
      {modal}
    </>
  );

}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0782F9',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    color: 'black',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  }
})