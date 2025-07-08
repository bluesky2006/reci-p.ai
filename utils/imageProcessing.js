import TextRecognition from 'react-native-text-recognition';

const imageProcessing = async (uri) => {

  try {
    console.log(uri.slice(7))

    console.log(TextRecognition.recognize(uri))
    
    const result = await TextRecognition.recognize(uri.slice(7));
    
    console.log(result)
    
  } catch (error) {
    console.log(error)
  }

};

export default imageProcessing;
