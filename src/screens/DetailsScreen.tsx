import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, SafeAreaView, Alert, Share } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";
import { addToFavorites, removeFromFavorites } from "../../store/favoritesSlice";
import { addToSharedCart } from "../../store/collaborativeCartSlice";
import { addToComparison } from "../../store/comparisonSlice";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import Animated, { FadeIn, ZoomIn, SlideInUp } from 'react-native-reanimated';

export default function DetailsScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { id } = route.params;

    const product = useAppSelector((state) =>
        state.data.items.find((item) => item.id.toString() === id)
    );
    const favorites = useAppSelector((state) => state.favorites.items);
    const currentSharedCart = useAppSelector((state) => state.collaborativeCart.currentSharedCart);
    const comparisonItems = useAppSelector((state) => state.comparison.items);
    const isFavorite = product ? favorites.some(fav => fav.id === product.id) : false;
    const isInComparison = product ? comparisonItems.some(c => c.id === product.id) : false;

    const shareProduct = async () => {
        if (!product) return;
        try {
            await Share.share({
                message: `Check out this product: ${product.title} - $${product.price}\n\nShop on Shop Mart!`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share product');
        }
    };

    const handleAddToSharedCart = () => {
        if (!product || !currentSharedCart) {
            Alert.alert('Info', 'Please create or select a shared cart first');
            return;
        }
        dispatch(addToSharedCart({ cartId: currentSharedCart.id, item: product }));
        Alert.alert('Success', `Added to ${currentSharedCart.name}`);
    };

    const handleAddToComparison = () => {
        if (!product) return;
        if (isInComparison) {
            Alert.alert('Info', 'This item is already in comparison');
        } else {
            dispatch(addToComparison(product));
            Alert.alert('Success', 'Added to comparison');
        }
    };

    if (!product) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Product not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: 'blue', marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, color: '#007AFF' }}>← Back</Text>
                </TouchableOpacity>

                <Animated.Image
                    entering={ZoomIn}
                    source={{ uri: product.thumbnail }}
                    style={{ width: '100%', height: 300, resizeMode: 'contain' }}
                />

                <Animated.View entering={SlideInUp.delay(100)} style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{product.title}</Text>
                    <Text style={{ fontSize: 20, color: '#666', marginTop: 10 }}>${product.price}</Text>
                    <Text style={{ fontSize: 16, color: '#333', marginTop: 15, lineHeight: 24 }}>
                        {product.description}
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 30 }}>
                        <Animated.View entering={ZoomIn.delay(200)} style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#000',
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    dispatch(addToCart(product));
                                    Alert.alert('Added to cart!');
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Add to Cart</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View entering={ZoomIn.delay(300)}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (isFavorite) {
                                        dispatch(removeFromFavorites(product.id));
                                        Alert.alert('Removed from favorites');
                                    } else {
                                        dispatch(addToFavorites(product));
                                        Alert.alert('Added to favorites!');
                                    }
                                }}
                                style={{
                                    backgroundColor: isFavorite ? '#FF0000' : '#eee',
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 60
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>{isFavorite ? '❤️' : '🤍'}</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View entering={ZoomIn.delay(400)}>
                            <TouchableOpacity
                                onPress={shareProduct}
                                style={{
                                    backgroundColor: '#007AFF',
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 60
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>📤</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {currentSharedCart && (
                            <Animated.View entering={ZoomIn.delay(500)}>
                                <TouchableOpacity
                                    onPress={handleAddToSharedCart}
                                    style={{
                                        backgroundColor: '#9C27B0',
                                        padding: 15,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60
                                    }}
                                >
                                    <Text style={{ fontSize: 24 }}>👥</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        <Animated.View entering={ZoomIn.delay(600)}>
                            <TouchableOpacity
                                onPress={handleAddToComparison}
                                style={{
                                    backgroundColor: isInComparison ? '#FF9800' : '#4CAF50',
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 60
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>📊</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Animated.View>
                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
