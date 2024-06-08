import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricAvailable(isAvailable);
  };

  const handleRegister = async () => {
    if (email && password) {
      await AsyncStorage.setItem('user', JSON.stringify({ email, password }));
      navigation.navigate('Login');
    }
  };

  const authenticateWithBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      // Autenticação bem-sucedida, faça algo como navegar para a próxima tela
      navigation.navigate('Login');
    } else {
      // Autenticação falhou, exiba uma mensagem de erro
      alert('Biometric authentication failed');
    }
  };

  const changePage = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isBiometricAvailable && (
        <TouchableOpacity style={[styles.buttonContainer, styles.blackButton]} onPress={authenticateWithBiometrics}>
          <Text style={styles.buttonText}>Authenticate with Biometrics</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={changePage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  blackButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
