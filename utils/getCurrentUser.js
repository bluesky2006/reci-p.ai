import { GoogleSignin } from "@react-native-google-signin/google-signin";

const getCurrentUser = async () => {
    const currentUser = GoogleSignin.getCurrentUser();
    return currentUser
  };

export default getCurrentUser