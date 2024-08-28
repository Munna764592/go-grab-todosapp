import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SQLite from "expo-sqlite";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const TaskDetailScreen = () => {
  const { taskId } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const router = useRouter();

  const fetchTaskDetails = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");
      const results = await db.getAllAsync(`SELECT * FROM tasks WHERE id = ?`, [
        Number(taskId)
      ]);

      setTask(results[0]);
    } catch (error) {
      console.error("Error fetching task details:", error);
      Alert.alert("Error", "Failed to fetch task details.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTaskDetails();
    }, [taskId])
  );

  return (
    <View style={styles.container}>
      {task ? (
        <>
          <View style={styles.container2}>
            <View style={styles.header}>
              <View style={styles.status}>
                <Text
                  style={{ fontWeight: "600", color: "white", fontSize: 18 }}>
                  Status:{" "}
                </Text>
                <Text style={{ fontSize: 15, color: "gray" }}>
                  {task.completed === 1 ? "Completed" : "Pending"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/UpdateTask?taskId=${encodeURIComponent(task.id)}`
                  )
                }>
                <MaterialIcons name="update" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111111",
    paddingBottom: 0
  },
  container2: {
    flex: 1,
    paddingTop: 40
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10
  },
  description: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10
  },
  status: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  header: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#31363F",
    borderRadius: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  }
});

export default TaskDetailScreen;
