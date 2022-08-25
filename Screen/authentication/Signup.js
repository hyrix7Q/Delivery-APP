import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  Picker,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import Header from "../../components/Signup/Header";
import * as Yup from "yup";
import Validator from "email-validator";
import { Formik } from "formik";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import * as AuthActions from "../../store/actions/auth";

const Signup = ({ navigation }) => {
  const [selectedJob, setSelectedJob] = React.useState("client");
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const dispatch = useDispatch();

  const SignUpFormSchema = Yup.object().shape({
    email: Yup.string().email().required("An email is required !"),
    password: Yup.string()
      .required()
      .min(8, "Your password has to be atleast 8 caracters"),
  });
  const createUser = async (username, email, password) => {
    createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        updateProfile(authentication.currentUser, {
          displayName: username,
        }).then(() => {
          setDoc(
            doc(
              db,
              "users",
              "jobs",
              selectedJob,
              authentication.currentUser.uid
            ),
            {
              id: authentication.currentUser.uid,
              displayName: authentication.currentUser.displayName,
              job: selectedJob,
              phoneNumber: phoneNumber,
            }
          );
          dispatch(AuthActions.getJob(selectedJob));
        });
      })
      .catch((res) => {
        console.log("ERROR", res);
      });
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={{ backgroundColor: "#F7F7F7", flex: 1 }}>
        <Formik
          initialValues={{ email: "", password: "", username: "" }}
          onSubmit={(values) => {}}
          validationSchema={SignUpFormSchema}
          validateOnMount={true}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            values,
            isValid,
            errors,
          }) => (
            <>
              <View style={styles.TitleContainer}>
                <Text style={styles.TitleText}>Create your account!</Text>
              </View>
              {/*Inputs */}
              <View style={styles.InputContainer}>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    placeholder="username"
                    onChangeText={(text) => {
                      setUsername(text);
                    }}
                  />
                </View>
                <View
                  style={[
                    styles.inputField,
                    {
                      flexDirection: "row",
                      borderWidth:
                        values.email.length < 1 ||
                        Validator.validate(values.email)
                          ? 0
                          : 1,
                      borderColor:
                        values.email.length < 1 ||
                        Validator.validate(values.email)
                          ? "#ccc"
                          : "red",
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.input, { flexGrow: 1 }]}
                    placeholder="email address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                </View>
                <View
                  style={[
                    styles.inputField,
                    {
                      flexDirection: "row",
                      borderWidth:
                        values.password.length < 1 || values.password.length > 8
                          ? 0
                          : 1,
                      borderColor:
                        values.password.length < 1 || values.password.length > 8
                          ? "#ccc"
                          : "red",
                    },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        flexGrow: 1,
                        flexDirection: "row",
                      },
                    ]}
                    placeholder="password"
                    secureTextEntry={showPassword}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}
                    style={{ alignSelf: "center", marginRight: "5%" }}
                  >
                    <Text style={{ color: "#EA0039", fontWeight: "700" }}>
                      {showPassword ? "Show" : "Hide"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                    }}
                    keyboardType="numeric"
                  />
                </View>
                <View
                  style={{
                    backgroundColor: "white",
                    width: 200,
                    marginLeft: 8,
                    marginTop: "5%",
                  }}
                >
                  <Picker
                    selectedValue={selectedJob}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedJob(itemValue)
                    }
                  >
                    <Picker.Item label="Client" value="client" />
                    <Picker.Item label="Delivery man" value="delivery" />
                  </Picker>
                </View>
              </View>
              {/*Button */}
              <View
                style={{
                  alignItems: "center",
                  height: "10%",
                  marginTop: "10%",
                }}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    createUser(username, values.email, values.password);
                  }}
                >
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  >
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.Already}>
                <Text>Already have an account ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text style={{ color: "#EA0039" }}> Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  TitleText: { color: "#EA0039", fontSize: 38, fontWeight: "bold" },
  TitleContainer: {
    marginTop: "15%",
    marginLeft: "10%",
    marginRight: "40%",
  },
  InputContainer: {
    marginTop: "10%",
    marginHorizontal: "10%",
  },
  inputField: {
    marginBottom: "5%",
    borderRadius: 25,
    backgroundColor: "white",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#EA0039",
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "1.5%",
    borderRadius: 25,
  },
  Already: {
    bottom: 0,
    paddingBottom: "5%",
    flexDirection: "row",
    alignSelf: "center",
  },
});

export default Signup;
