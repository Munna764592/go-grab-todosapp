import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import {
  LongPressGestureHandler,
  State,
  GestureHandlerRootView
} from "react-native-gesture-handler";

const TodoListScreen = () => {
  const { id } = useLocalSearchParams();
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  // useEffect(() => {
  //   const deleteTasksTable = async () => {
  //     try {
  //       // Open the database connection
  //       const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

  //       // Execute SQL command to drop the tasks table
  //       await db.execAsync(
  //         "DROP TABLE IF EXISTS tasks;",
  //         [],
  //         () => console.log("Tasks table deleted successfully."),
  //         (error) => {
  //           console.error("Error deleting tasks table:", error);
  //           return false; // Return false to indicate failure
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error opening database:", error);
  //     }
  //   };

  //   // Call the function to delete the tasks table
  //   deleteTasksTable();
  // }, []);

  const fetchTasks = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

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

      const results = await db.getAllAsync(
        `SELECT * FROM tasks WHERE categoryId = ?`,
        [Number(id)]
      );

      setTasks(results);
      // const allTasks = await db.getAllAsync(`SELECT * FROM tasks`);
      // console.log("All tasks in the table:", allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Failed to fetch tasks.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [id])
  );

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      await db.runAsync("UPDATE tasks SET completed = ? WHERE id = ?", [
        newStatus,
        taskId
      ]);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      Alert.alert("Error", "Failed to update task status.");
    }
  };
  const deleteTasks = async (id) => {
    const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

    try {
      await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
      console.log("Tasks deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleLongPress = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => deleteTasks(id)
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          handleLongPress(item.id);
        }
      }}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          router.push(`/taskdetail?taskId=${encodeURIComponent(item.id)}`)
        }>
        <View style={styles.iconContainer}>
          <Text style={styles.itemText}>{item.title}</Text>
          <Switch
            value={item.completed === 1}
            onValueChange={() => toggleTaskCompletion(item.id, item.completed)}
            trackColor={{ false: "#767577", true: "#f57c00" }}
            thumbColor={item.completed === 1 ? "#FF5722" : "#f4f3f4"}
          />
        </View>

        {/* <Text style={styles.itemText2}>{item.description}</Text> */}
      </TouchableOpacity>
    </LongPressGestureHandler>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tasks</Text>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </GestureHandlerRootView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/CreateTask?id=${encodeURIComponent(id)}`)}>
        <View style={styles.buttonContent}>
          <MaterialIcons name="add" size={35} color="white" />
          <Text style={styles.buttonText}>Create Task</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  button: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    marginLeft: 10,
    fontWeight: "600"
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
  itemContainer: {
    backgroundColor: "#232323",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  itemText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    flexShrink: 1
  },
  itemText2: {
    fontSize: 16,
    color: "gray",
    fontFamily: "Poppins_400Regular"
  }
});

export default TodoListScreen;
