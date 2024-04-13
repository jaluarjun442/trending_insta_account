import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitIdLive = 'ca-app-pub-9187335266224900/4404839702'; // Replace with your own Ad Unit ID
// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : adUnitIdLive;
const adUnitId = adUnitIdLive;

const DetailScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [otherProfiles, setOtherProfiles] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchOtherProfiles();
  }, []);

  const fetchOtherProfiles = async () => {
    try {
      const response = await fetch('https://shopperlity.online/shopperlity/api/insta_account/random');
      const data = await response.json();
      setOtherProfiles(data);
    } catch (error) {
      console.error('Error fetching other profiles:', error);
    }
  };

  const handleProfileClick = (item) => {
    navigation.setParams({ user: item });
    scrollToTop();
    fetchOtherProfiles();
    // renderSectionTitle();
  };

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderProfileTile = ({ item }) => (
    <>
      <TouchableOpacity onPress={() => handleProfileClick(item)}>
        <View style={styles.profileTile}>
          <Image style={styles.profileImage} source={{ uri: item.image }} />
          <Text style={styles.profileName}>{item.name}</Text>
          <Text style={styles.profileUsername}>{item.username}</Text>
          {/* <TouchableOpacity onPress={() => handleInstagramRedirect(item.username)}>
          <Text style={styles.instagramButton}>View on Instagram</Text>
        </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    </>
  );

  const handleInstagramRedirect = (username) => {
    const instagramURL = `https://www.instagram.com/${username}`;
    Linking.openURL(instagramURL);
  };

  const renderMainUser = () => (
    <View style={styles.mainUserInfo}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.MEDIUM_RECTANGLE}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      <Image style={styles.mainUserImage} source={{ uri: user.image }} />
      <Text style={styles.mainUserName}>{user.name}</Text>
      <Text style={styles.mainUserUsername}>{user.username}</Text>
      <TouchableOpacity onPress={() => handleInstagramRedirect(user.username)} style={styles.instagramButton}>
        <Text style={styles.instagramButtonText}>View on Instagram</Text>
      </TouchableOpacity>
      {/* <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      /> */}
    </View>
  );

  const renderSectionTitle = () => (
    <>
      <Text style={styles.sectionTitle}>Other Profiles</Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.MEDIUM_RECTANGLE}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={[{ key: 'mainUser' }, { key: 'sectionTitle' }, ...otherProfiles]}
      renderItem={({ item }) => {
        if (item.key === 'mainUser') {
          return renderMainUser();
        } else if (item.key === 'sectionTitle') {
          return renderSectionTitle();
        } else {
          return renderProfileTile({ item });
        }
      }}
      keyExtractor={item => item.id || item.key}
      contentContainerStyle={styles.container}
      // ListFooterComponent={() => (
      //   <BannerAd
      //     unitId={adUnitId}
      //     size={BannerAdSize.MEDIUM_RECTANGLE}
      //     requestOptions={{
      //       requestNonPersonalizedAdsOnly: true,
      //     }}
      //   />
      // )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  mainUserInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  mainUserImage: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  mainUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mainUserUsername: {
    fontSize: 18,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileTile: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: '#666',
  },
  instagramButton: {
    backgroundColor: '#007AFF', // Blue color
    borderRadius: 20, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instagramButtonText: {
    color: '#fff', // White text color
    fontWeight: 'bold',
  },
});

export default DetailScreen;
