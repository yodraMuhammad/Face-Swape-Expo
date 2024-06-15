import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Dimensions, ScrollView, SafeAreaView, ActivityIndicator, Text, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

export default function ContohImagePicker() {
  const [image, setImage] = useState(null);
  const [imageTarget, setImageTarget] = useState(null);
  const [swappedImage, setSwappedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { height: screenHeight } = Dimensions.get('window');

  const pilihGambar = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });
    console.log(result);
    if (result) {
      setImage(result?.assets[0]);
    }
  };

  const pilihGambarTarget = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });

    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });
    console.log(result);
    if (result) {
      setImageTarget(result?.assets[0]);
    }
  };

  const tukarWajah = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('face_to_swap', image?.file);
    formData.append('real_image', imageTarget?.file);

    try {
      const response = await fetch('https://freshpixl-home.el.r.appspot.com/api/swap-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSwappedImage(`data:image/jpeg;base64,${data?.result_image}`);
    } catch (error) {
      console.error('Error swapping faces:', error);
      setError(error);
    } finally {
      setLoading(false);
    }

    // try {
    //   const response = await axios.post('https://freshpixl-home.el.r.appspot.com/api/swap-image', formData);
    //   console.log(response.data);
    //   const data = await response.data;
    //   setSwappedImage(`data:image/jpeg;base64,${data?.result_image}`);
    // } catch (error) {
    //   console.error(error);
    //   setError(error);
    // } finally {
    //   setLoading(false)
    // }
  };

  const downloadImage = async () => {
    if (!swappedImage) return;

    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = swappedImage;
      link.download = 'swapped_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const filename = FileSystem.documentDirectory + 'swapped_image.jpg';
      try {
        await FileSystem.writeAsStringAsync(filename, swappedImage.replace(/^data:image\/jpeg;base64,/, ''), {
          encoding: FileSystem.EncodingType.Base64,
        });
        alert('Image downloaded to ' + filename);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  const hapusGambar = () => setImage(null);
  const hapusGambarTarget = () => setImageTarget(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.section}>
          <Button title="Unggah Gambar Sumber" onPress={pilihGambar} />
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image?.uri }} style={styles.image} />
            ) : (
              <View style={[styles.image, { borderWidth: 1 }]} />
            )}
          </View>
          <Button title="Hapus Gambar" onPress={hapusGambar} color="red" />
        </View>
        <View style={styles.section}>
          <Button title="Unggah Gambar Target" onPress={pilihGambarTarget} />
          <View style={styles.imageContainer}>
            {imageTarget ? (
              <Image source={{ uri: imageTarget?.uri }} style={styles.image} />
            ) : (
              <View style={[styles.image, { borderWidth: 1 }]} />
            )}
          </View>
          <Button title="Hapus Gambar" onPress={hapusGambarTarget} color="red" />
        </View>
        <View style={styles.section}>
          <Button
            title="Tukar Wajah"
            onPress={tukarWajah}
            // disabled={!image || !imageTarget || loading}
            color="green"
          />
          {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginVertical: 10}} />}
        </View>
        {swappedImage && (
          <View style={styles.section}>
            <Text>Hasil Tukar Wajah:</Text>
            <Image source={{ uri: swappedImage }} style={styles.image} />
          </View>
        )}
        {error && (
          <View style={styles.section}>
            <Text>Error: {error}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Button
            title="Download"
            onPress={downloadImage}
            // disabled={!image || !imageTarget || loading}
            color="green"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 50
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
