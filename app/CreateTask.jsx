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

const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const categoryId = Number(id);

  const handleSubmit = async () => {
    if (taskTitle.trim() === "") {
      Alert.alert("Error", "Please enter a task title.");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

      // Ensure the tasks table exists
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryId INTEGER,
        title TEXT,
        description TEXT,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      );
    `);

      // Insert the new task
     try {
       await db.runAsync(
         `INSERT INTO tasks (categoryId, title, description) VALUES (?, ?, ?);`,
         [categoryId, taskTitle, taskDescription]
       );
     } catch (error) {
       console.error("Error inserting task:", error);
     }

      // Alert.alert("Success", "Task created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error inserting task:", error);
      Alert.alert("Error", "Failed to create task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create New Task</Text>

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
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
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

export default CreateTask;
