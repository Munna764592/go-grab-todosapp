import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

const UpdateTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const navigation = useNavigation();
  const { taskId } = useLocalSearchParams();
  const id = Number(taskId);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");
        const results = await db.getAllAsync(
          `SELECT * FROM tasks WHERE id = ?`,
          [id]
        );

        if (results.length > 0) {
          const task = results[0];

          if (task) {
            setTaskTitle(task.title || "");
            setTaskDescription(task.description || "");
          } else {
            Alert.alert("Error", "Task not found.");
            navigation.goBack();
          }
        } else {
          Alert.alert("Error", "Task not found.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        Alert.alert("Error", "Failed to fetch task details.");
      }
    };

    fetchTask();
  }, [id, navigation]);

  const handleUpdate = async () => {
    if (taskTitle.trim() === "") {
      Alert.alert("Error", "Please enter a task title.");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

      await db.runAsync(
        `UPDATE tasks SET title = ?, description = ? WHERE id = ?;`,
        [taskTitle, taskDescription, id]
      );

    //   Alert.alert("Success", "Task updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Task</Text>

      <View style={styles.container2}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label]}>Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[styles.input, styles.multilineText]}
            value={taskDescription}
            onChangeText={setTaskDescription}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={require("../src/assets/images/todo.png")}
            style={styles.image}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginTop: 60
  },
  container2: {
    flex: 1,
    justifyContent: "center"
  },
  multilineText: {
    textAlignVertical: "top"
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555"
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111111",
    paddingBottom: 0,
    paddingTop: 60
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    fontFamily: "Poppins_600SemiBold"
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontFamily: "Poppins_400Regular",
    color: "white"
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    fontWeight: "600"
  }
});

export default UpdateTask;
