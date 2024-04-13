import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BottomMenu = () => {
    const navigation = useNavigation();
    const [showLinks, setShowLinks] = useState(false);

    const handleButtonPress = () => {
        setShowLinks(!showLinks);
    };
    const handleExternalLinkPress = (url) => {
        Linking.openURL(url);
    };

    const links = [
        { title: 'Privacy Policy', url: 'https://hindilive24.blogspot.com/p/word-search-privacy.html' } // Example external URL
    ];

    return (
        <View style={styles.container}>
            <View style={styles.linksContainer}>
                {showLinks && (
                    <FlatList
                        data={links}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => item.url ? handleExternalLinkPress(item.url) : item.onPress()}
                                style={styles.linkItem}>
                                <Text style={styles.linkText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <Text style={styles.buttonText}>Menu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: 'blue',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    linksContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
    },
    linkItem: {
        paddingVertical: 8,
    },
    linkText: {
        fontSize: 16,
        color: '#333',
    },
});

export default BottomMenu;
