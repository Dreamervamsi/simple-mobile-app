import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

export default function DetailsScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { id } = route.params;

    const product = useAppSelector((state) =>
        state.data.items.find((item) => item.id.toString() === id)
    );

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

                <Image
                    source={{ uri: product.thumbnail }}
                    style={{ width: '100%', height: 300, resizeMode: 'contain' }}
                />

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{product.title}</Text>
                    <Text style={{ fontSize: 20, color: '#666', marginTop: 10 }}>${product.price}</Text>
                    <Text style={{ fontSize: 16, color: '#333', marginTop: 15, lineHeight: 24 }}>
                        {product.description}
                    </Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#000',
                            padding: 15,
                            borderRadius: 10,
                            marginTop: 30,
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            dispatch(addToCart(product));
                            Alert.alert('Added to cart!');
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
