import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';


const PackageItem = ({ item, handleDeletePackage, refreshPackages }) => {
  const [editing, setEditing] = useState(false);
  const [updatedPackageName, setUpdatedPackageName] = useState(item?.packageName || '');
  const [updatedPackagePrice, setUpdatedPackagePrice] = useState(item?.packagePrice?.toString() || '');
  const [updatedSubjects, setUpdatedSubjects] = useState(item?.subjects ? item.subjects.join(', ') : '');
  const [updatedBranch, setUpdatedBranch] = useState(item?.branchName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePackage = async () => {
    if (updatedPackageName.trim() === '' || updatedPackagePrice.trim() === '' || updatedSubjects.trim() === '' || updatedBranch.trim() === '') {
      alert('Please fill in all the fields.');
      return;
    }

    setIsLoading(true);

    try {
      const packageRef = firestore().collection('packages').doc(item.id);
      await packageRef.update({
        Package: updatedPackageName,
        Amount: parseFloat(updatedPackagePrice),
        Subjects: updatedSubjects.split(',').map(subject => subject.trim()),
        Branch: updatedBranch
      });
      setIsLoading(false);

      alert('Package updated successfully.');
      setEditing(false);
      refreshPackages();
    } catch (error) {
      alert('Error updating package: ' + error.message);
    }
  };
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
  return (
    <>
      <View style={styles.packageContainer}>
        {editing ? (
          <>
            <TextInput
              value={updatedPackageName}
              onChangeText={text => setUpdatedPackageName(text)}
              style={styles.input}
              placeholder="Package Name"
            />
            <TextInput
              value={updatedPackagePrice}
              onChangeText={text => setUpdatedPackagePrice(text)}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="Package Price"
            />
            <TextInput
              value={updatedSubjects}
              onChangeText={text => setUpdatedSubjects(text)}
              style={styles.input}
              placeholder="Subjects (comma-separated)"
            />
            <Picker
              selectedValue={updatedBranch}
              onValueChange={(itemValue) => setUpdatedBranch(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Select Branch" value="" />
              <Picker.Item label="Johar" value="Johar" />
              <Picker.Item label="Model" value="Model" />
            </Picker>
          </>
        ) : (
          <>
            <Text style={styles.packageName}>{item.packageName}</Text>
            <Text style={styles.packagePrice}>{`${item.packagePrice}`}</Text>
            <Text style={styles.subjects}>{item.subjects ? item.subjects.join(', ') : ''}</Text>
            <Text style={styles.branchName}>{item.branchName}</Text>
          </>
        )}
        <View style={styles.buttonContainer}>
          {editing ? (
            <TouchableOpacity onPress={handleUpdatePackage} style={styles.editButton}>
              <Text style={styles.editText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleDeletePackage(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {modal}
    </>
  );
};

const styles = StyleSheet.create({
  packageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0782F9',
  },
  subjects: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: 'black',

  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#0782F9',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  branchName: {
    color: 'black',
  }
});

export default PackageItem;


