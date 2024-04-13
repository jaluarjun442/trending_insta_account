import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailScreen from './DetailScreen'; // Import the DetailScreen component
import BottomMenu from './BottomMenu'; // Import the BottomMenu component
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitIdLive = 'ca-app-pub-9187335266224900/4404839702'; // Replace with your own Ad Unit ID
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : adUnitIdLive;

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loadedPage, setloadedPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (!loadedPage.includes(page)) {
      setloadedPage(prevloadedPage => [...prevloadedPage, page]);
      setLoading(true);
      fetch(`https://shopperlity.online/shopperlity/api/insta_account?page=${page}`)
        .then(response => response.json())
        .then(responseJson => {
          setData(prevData => [...prevData, ...responseJson.data]);
          setNextPageUrl(responseJson.next_page_url);
          if (page != responseJson.current_page + 1) {
            setPage(responseJson.current_page + 1);
          }
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  };

  const renderListItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Detail', { user: item })}>
        <View style={styles.item}>
          <Image style={styles.image} source={{ uri: item.image }} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.username}>{item.instagramUsername}</Text>
          </View>
        </View>
        {(index + 1) % 3 === 0 && index !== 0 ? ( // Display AdMob banner after every 3rd item
          <View style={styles.adContainer}>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.MEDIUM_RECTANGLE}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true, // Set to true for GDPR compliance
              }}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (nextPageUrl) {
      fetchData();
    }
  };

  const renderFooter = () => {
    return loading ? (
      <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#0000ff" />
    ) : null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <BottomMenu />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default App;
