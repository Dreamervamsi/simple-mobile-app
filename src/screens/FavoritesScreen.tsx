import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View, SafeAreaView, Alert, Share } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeFromFavorites, clearFavorites } from "../../store/favoritesSlice";
import { addToCart } from "../../store/cartSlice";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutRight } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function FavoritesScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((state) => state.favorites.items);

    const shareWishlist = async () => {
        const wishlistText = favorites
            .map(item => `• ${item.title} - $${item.price}`)
            .join('\n');
        
        try {
            await Share.share({
                message: `My Shop Mart Wishlist:\n\n${wishlistText}\n\nCheck out Shop Mart!`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share wishlist');
        }
    };

    const renderFavoriteItem = ({ item, index }: { item: any; index: number }) => (
        <AnimatedView
            entering={SlideInRight.delay(index * 50).springify()}
            exiting={FadeOut}
            style={{
                flexDirection: 'row',
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                alignItems: 'center',
                backgroundColor: '#fff'
            }}
        >
            <Image source={{ uri: item.thumbnail }} style={{ width: 60, height: 60, resizeMode: 'contain', borderRadius: 8 }} />
            <View style={{ flex: 1, marginLeft: 15 }}>
                <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                <Text style={{ color: '#666', marginTop: 4 }}>${item.price}</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    dispatch(addToCart(item));
                    Alert.alert('Added to cart!');
                }}
                style={{
                    backgroundColor: '#000',
                    padding: 8,
                    borderRadius: 6,
                    marginRight: 8
                }}
            >
                <Text style={{ color: '#fff', fontSize: 12 }}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(removeFromFavorites(item.id))}>
                <Text style={{ color: 'red', fontSize: 12 }}>Remove</Text>
            </TouchableOpacity>
        </AnimatedView>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, color: '#007AFF' }}>← Back</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold' }}>My Favorites</Text>
                    {favorites.length > 0 && (
                        <TouchableOpacity onPress={shareWishlist} style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 6 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>Share Wishlist</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {favorites.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 48 }}>❤️</Text>
                        <Text style={{ fontSize: 18, color: '#666', marginTop: 20 }}>No favorites yet</Text>
                        <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Swipe left on products to add to favorites</Text>
                        <TouchableOpacity
                            style={{ marginTop: 20, backgroundColor: '#000', padding: 12, borderRadius: 8 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={{ color: '#fff' }}>Browse Products</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={favorites}
                            renderItem={renderFavoriteItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <TouchableOpacity
                            onPress={() => dispatch(clearFavorites())}
                            style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}
                        >
                            <Text style={{ color: 'red' }}>Clear All Favorites</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
