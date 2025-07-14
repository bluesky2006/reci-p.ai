import { GoogleSignin } from "@react-native-google-signin/google-signin";

const getCurrentUser = async () => {
    const currentUser = GoogleSignin.getCurrentUser();
    console.log(currentUser)
    return currentUser
  };

export default getCurrentUser