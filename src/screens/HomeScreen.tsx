import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TextInput, View, ActivityIndicator, TouchableOpacity, StatusBar, SafeAreaView, RefreshControl, Platform, Alert } from "react-native";
import { styles } from "../styles";
import { dataItem } from "../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts, setSearchQuery } from "../../store/dataSlice";
import { addToCart } from "../../store/cartSlice";
import { addToFavorites } from "../../store/favoritesSlice";
import { addToComparison } from "../../store/comparisonSlice";
import { addToRecentlyViewed } from "../../store/recentlyViewedSlice";
import { useAppLifecycle } from "../../hooks/useAppLifecycle";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { GestureDetector, Gesture, LongPressGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import SkeletonLoader from '../components/SkeletonLoader';

export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items, loading, isFetchingMore, error, searchQuery, skip, limit, total } = useAppSelector((state) => state.data);
    const cartItems = useAppSelector((state) => state.cart.items);
    const favorites = useAppSelector((state) => state.favorites.items);
    const [refreshing, setRefreshing] = useState(false);

    // Initialize lifecycle and cache loading
    useAppLifecycle();

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchProducts({ skip: 0, limit, query: searchQuery }));
        }
    }, [dispatch]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchProducts({ skip: 0, limit, query: searchQuery }));
        if (Platform.OS === 'ios') {
            // Haptic feedback on iOS
        }
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleSearch = (text: string) => {
        dispatch(setSearchQuery(text));
        dispatch(fetchProducts({ skip: 0, limit, query: text }));
    };

    const loadMore = () => {
        if (!isFetchingMore && items.length < total) {
            dispatch(fetchProducts({ skip, limit, query: searchQuery }));
        }
    };

    const renderItm = ({ item }: { item: dataItem }) => {
        const translateX = useSharedValue(0);
        const isFavorite = favorites.some((fav: dataItem) => fav.id === item.id);
        const comparisonItems = useAppSelector((state) => state.comparison.items);
        const isInComparison = comparisonItems.some((c: dataItem) => c.id === item.id);

        const rightSwipe = Gesture.Fling()
            .direction(1)
            .onEnd(() => {
                runOnJS(dispatch)(addToCart(item));
                translateX.value = withSpring(0);
            });

        const leftSwipe = Gesture.Fling()
            .direction(-1)
            .onEnd(() => {
                runOnJS(dispatch)(addToFavorites(item));
                translateX.value = withSpring(0);
            });

        const gesture = Gesture.Race(rightSwipe, leftSwipe);

        const handleLongPress = () => {
            Alert.alert(
                'Quick Actions',
                'What would you like to do with this item?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: isInComparison ? 'Remove from Comparison' : 'Add to Comparison',
                        onPress: () => {
                            if (isInComparison) {
                                // Remove logic would go here
                            } else {
                                dispatch(addToComparison(item));
                                Alert.alert('Added to comparison');
                            }
                        }
                    },
                    {
                        text: 'Share',
                        onPress: () => {
                            // Share functionality
                        }
                    }
                ]
            );
        };

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value }],
        }));

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={animatedStyle}>
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            dispatch(addToRecentlyViewed(item));
                            navigation.navigate('Details', { id: item.id.toString() });
                        }}
                        onLongPress={handleLongPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.innerContainer}>
                            <Image style={styles.img} source={{ uri: item.thumbnail }} />
                            <Text style={{ fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>{item.title}</Text>
                            <Text style={{ color: '#666' }}>${item.price}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 20 }}>
                                <Text style={{ color: '#007AFF' }}>View Details →</Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <Text style={{ color: isInComparison ? '#9C27B0' : '#999' }}>{isInComparison ? '📊' : ''}</Text>
                                    <Text style={{ color: isFavorite ? '#FF0000' : '#999' }}>{isFavorite ? '❤️' : '🤍'}</Text>
                                </View>
                            </View>
                        </View>
                        <Text>{"\n"}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </GestureDetector>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text style={styles.txt}>Shop Mart</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Filter')}
                            style={{
                                backgroundColor: '#eee',
                                padding: 10,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Comparison')}
                            style={{
                                backgroundColor: '#eee',
                                padding: 10,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>📊</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('CollaborativeCart')}
                            style={{
                                backgroundColor: '#eee',
                                padding: 10,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>👥</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Favorites')}
                            style={{
                                backgroundColor: '#eee',
                                padding: 10,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>❤️ {favorites.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Cart')}
                            style={{
                                backgroundColor: '#eee',
                                padding: 10,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>🛒 {cartItems.length}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TextInput
                    style={styles.search}
                    onChangeText={handleSearch}
                    value={searchQuery}
                    placeholder="Search for an item.."
                    placeholderTextColor="#999"
                />

                {loading && items.length === 0 ? (
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        renderItem={() => <SkeletonLoader />}
                        keyExtractor={(item) => item.toString()}
                    />
                ) : error ? (
                    <View>
                        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
                        <TouchableOpacity onPress={() => dispatch(fetchProducts({ skip: 0, limit, query: searchQuery }))}>
                            <Text style={{ textAlign: 'center', color: '#007AFF', marginTop: 10 }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        style={styles.container}
                        data={items}
                        renderItem={renderItm}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#0000ff"
                            />
                        }
                        ListFooterComponent={() => 
                            isFetchingMore ? (
                                <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 20 }} />
                            ) : null
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

