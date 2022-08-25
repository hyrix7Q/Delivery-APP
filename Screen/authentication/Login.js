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
  Alert,
} from "react-native";
import React from "react";
import Header from "../../components/Signup/Header";
import * as Yup from "yup";
import Validator from "email-validator";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebase/firebaseConfig/firebaseConfig";

const Login = ({ navigation }) => {
  const [selectedJob, setSelectedJob] = React.useState("client");
  const [showPassword, setShowPassword] = React.useState(false);

  const SignUpFormSchema = Yup.object().shape({
    email: Yup.string().email().required("An email is required !"),
    username: Yup.string().required().min(2, "a username is required"),
    password: Yup.string()
      .required()
      .min(8, "Your password has to be atleast 8 caracters"),
  });

  const onLoginHandler = (email, password) => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(() => {
        console.log("Logined ");
      })
      .catch((err) => {
        Alert.alert("An error has occurred !", err.message, [{ text: "Okay" }]);
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
                <Text style={styles.TitleText}>Login to your account!</Text>
              </View>
              {/*Inputs */}
              <View style={styles.InputContainer}>
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
                    style={[styles.input, { flexGrow: 1 }]}
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
                    onLoginHandler(values.email, values.password);
                  }}
                >
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.Already}>
                <Text>Create a new account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Signup");
                  }}
                >
                  <Text style={{ color: "#EA0039" }}> Signup</Text>
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
    marginRight: "30%",
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

export default Login;
