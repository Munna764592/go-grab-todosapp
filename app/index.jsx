import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_600SemiBold
} from "@expo-google-fonts/poppins";
import FloatingButton from "../src/components/floatingButton";
import CreateCategoryForm from "../src/components/CreateCategoryForm";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();
import {
  LongPressGestureHandler,
  State,
  GestureHandlerRootView
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import UpdateCategoryForm from "../src/components/UpdateCategoryForm";

export default function Index() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold
  });

  const fetchData = async () => {
    const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        date TEXT
      );
    `);

      const result = await db.getAllAsync("SELECT * FROM categories");
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const [categories, setCategories] = useState([]);
  const loadData = async () => {
    const data = await fetchData();
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openForm = () => {
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
  };

  const router = useRouter();
  
  const handlePress = (id) => {
    router.push(`/todolist?id=${encodeURIComponent(id)}`);
  };

  const deleteCategory = async (id) => {
    const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

    try {
      await db.runAsync("DELETE FROM categories WHERE id = ?", [id]);
      console.log("Category deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleLongPress = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this categories?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => deleteCategory(id)
      }
    ]);
  };

  const [UpdateformVisible, setUpdateFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleUpdate = (id) => {
    const category = categories.find((cat) => cat.id === id);
    setSelectedCategory(category);
    setUpdateFormVisible(true);
  };

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Additional resource loading can go here
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  if (!isReady) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View
      style={styles.container}
      className="flex-1 justify-center items-center p-3">
      <View style={styles.container2}>
        <Text style={styles.headertxt}>
          <Text style={{ color: "#f57c00" }}>Hello</Text> Munna
        </Text>
        <Text style={styles.headertxt2}>Manage your{"\n"}Daily Task</Text>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.ACTIVE) {
                    handleLongPress(item.id);
                  }
                }}>
                <View style={styles.grp}>
                  <TouchableOpacity
                    style={styles.grpContent}
                    onPress={() => handlePress(item.id)}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.grptxt}>{item.name}</Text>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleUpdate(item.id)}>
                        <MaterialIcons name="update" size={30} color="white" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.grptxt2}>{item.description}</Text>
                    <Text style={styles.grptxt2}>{item.date}</Text>
                  </TouchableOpacity>
                </View>
              </LongPressGestureHandler>
            )}
          />
        </GestureHandlerRootView>
      </View>
      <FloatingButton onPress={openForm} />
      <CreateCategoryForm
        visible={isFormVisible}
        onClose={closeForm}
        onDataChanged={loadData}
      />
      <UpdateCategoryForm
        visible={UpdateformVisible}
        onClose={() => setUpdateFormVisible(false)}
        onDataChanged={loadData}
        initialValues={selectedCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center"
  },
  deleteButtonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14
  },
  grptxt2: {
    marginTop: 10,
    color: "gray"
  },
  grptxt: {
    color: "white",
    fontSize: 25,
    fontWeight: "600"
  },
  grp: {
    backgroundColor: "#232323",
    borderRadius: 10,
    marginVertical: 5,
    // height: 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10
  },
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
  headertxt: {
    color: "white",
    fontSize: 20,
    fontFamily: "Poppins_400Regular"
  },
  headertxt2: {
    color: "white",
    fontSize: 40,
    fontFamily: "Poppins_400Regular",
    fontWeight: "600",
    lineHeight: 50
  }
});
