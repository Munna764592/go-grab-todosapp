import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Formik } from "formik";
import * as Yup from "yup";

const screenHeight = Dimensions.get("window").height;
const CreateCategoryForm = ({ visible, onClose, onDataChanged }) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      slideUp();
    }
  }, [visible]);

  const slideUp = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight * 0.26,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      onClose();
    });
  };
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("Category Name is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date().required("Date is required")
  });

  const handleSubmit = async (values, { resetForm }) => {
    const db = await SQLite.openDatabaseAsync("CategoryDatabase.db");

    // Ensure the table exists
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        description TEXT, 
        date TEXT
      );
    `);

    // Insert data into the database
    await db.runAsync(
      "INSERT INTO categories (name, description, date) VALUES (?, ?, ?)",
      [
        values.categoryName,
        values.description,
        format(values.date, "yyyy-MM-dd")
      ]
    );

    console.log("Data inserted successfully");
    slideDown();
    if (onDataChanged) onDataChanged();
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { top: slideAnim }]}>
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={slideDown} style={styles.closeButton}>
          <MaterialIcons name="close" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Category</Text>
        <Formik
          initialValues={{ categoryName: "", description: "", date }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue
          }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={values.categoryName}
                onChangeText={handleChange("categoryName")}
                onBlur={handleBlur("categoryName")}
              />
              {touched.categoryName && errors.categoryName && (
                <Text style={styles.errorText}>{errors.categoryName}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={values.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
              />
              {touched.description && errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                  {format(values.date, "yyyy-MM-dd")}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={values.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setFieldValue("date", selectedDate || values.date);
                  }}
                />
              )}
              {touched.date && errors.date && (
                <Text style={styles.errorText}>{errors.date}</Text>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginBottom: 10
  },
  dateInputContainer: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold"
  },

  container: {
    position: "absolute",
    left: 0,
    right: 0,
    buttom: 0,
    height: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  formContainer: {
    flex: 1,
    padding: 20
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000"
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily: "Poppins_600SemiBold"
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontFamily: "Poppins_400Regular"
  }
});

export default CreateCategoryForm;
