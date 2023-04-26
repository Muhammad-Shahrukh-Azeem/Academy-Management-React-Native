import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';


const CourseItem = ({ item, handleDeleteCourse, refreshCourses }) => {
    const [editing, setEditing] = useState(false);
    const [updatedSubjectName, setUpdatedSubjectName] = useState(item.subjectName);
    const [updatedSubjectFee, setUpdatedSubjectFee] = useState(item.subjectFee ? item.subjectFee.toString() : '');
    const [updatedTeacherName, setUpdatedTeacherName] = useState(item.teacherName);
    const [updatedBranchName, setUpdatedBranchName] = useState(item.branchName);
    const [isLoading, setIsLoading] = useState(false);


    const handleUpdateCourse = async () => {

        if (updatedSubjectName.trim() === '' || updatedSubjectFee.trim() === '' || updatedTeacherName.trim() === '' || updatedBranchName.trim() === '') {
            alert('Please fill in all the fields.');
            return;
        }

        try {
            setIsLoading(true);

            await firestore().collection('courses').doc(item.id).update({
                subjectName: updatedSubjectName,
                subjectFee: parseFloat(updatedSubjectFee),
                teacherName: updatedTeacherName,
                branchName: updatedBranchName,
            });
            setIsLoading(false);
            alert('Course updated successfully.');
            setEditing(false);
            refreshCourses();
        } catch (error) {
            alert('Error updating course: ' + error.message);
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
            <View style={[styles.courseContainer, item.status === 'Paid' ? styles.paidCard : styles.unpaidCard]}>
                {editing ? (
                    <>
                        <TextInput
                            value={updatedSubjectName}
                            onChangeText={text => setUpdatedSubjectName(text)}
                            style={styles.input}
                            placeholder="Subject Name"
                        />
                        <TextInput
                            value={updatedSubjectFee}
                            onChangeText={text => setUpdatedSubjectFee(text)}
                            keyboardType="number-pad"
                            style={styles.input}
                            placeholder="Subject Fee"
                        />
                        <TextInput
                            value={updatedTeacherName}
                            onChangeText={text => setUpdatedTeacherName(text)}
                            style={styles.input}
                            placeholder="Teacher Name"
                        />
                        <TextInput
                            value={updatedBranchName}
                            onChangeText={text => setUpdatedBranchName(text)}
                            style={styles.input}
                            placeholder="Branch Name"
                        />
                    </>
                ) : (
                    <>
                        <Text style={[styles.textBlack, styles.bold]}>Name: <Text style={styles.textBlackRegular}>{item.teacherName}</Text></Text>
                        <Text style={[styles.textBlack, styles.bold]}>Subject/Package: <Text style={styles.textBlackRegular}>{item.subjectName}</Text></Text>
                        <Text style={[styles.textBlack, styles.bold]}>Amount: <Text style={styles.textBlackRegular}>{item.subjectFee}</Text></Text>
                        <Text style={[styles.textBlack, styles.bold]}>Branch: <Text style={styles.textBlackRegular}>{item.branchName}</Text></Text>
                    </>
                )}

                <View style={styles.buttonContainer}>
                    {editing ? (
                        <TouchableOpacity onPress={handleUpdateCourse} style={styles.paymentUpdateButton}>
                            <Text style={styles.paymentUpdateText}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setEditing(true)} style={styles.paymentUpdateButton}>
                            <Text style={styles.paymentUpdateText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteCourse(item.id)} style={styles.paymentUpdateButton}>
                        <Text style={styles.paymentUpdateText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {modal}
        </>
    );
};

const styles = StyleSheet.create({
    courseContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    paidCard: {
        borderColor: 'green',
    },
    unpaidCard: {
        borderColor: 'red',
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
    paymentUpdateButton: {
        backgroundColor: 'blue',
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    paymentUpdateText: {
        color: 'white',
        fontWeight: 'bold',
    },
    textBlack: {
        color: 'black',
    },
    bold: {
        fontWeight: 'bold',
    },
    textBlackRegular: {
        color: 'black',
        fontWeight: 'normal',
    },
});

export default CourseItem;