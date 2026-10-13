import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View, SafeAreaView, Alert, Modal } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeFromCart, clearCart } from "../../store/cartSlice";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, SlideInRight, SlideOutRight, ZoomIn } from 'react-native-reanimated';
import Confetti from '../components/Confetti';

export default function CartScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const [showConfetti, setShowConfetti] = React.useState(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    const handleCheckout = () => {
        setShowConfetti(true);
        setTimeout(() => {
            Alert.alert('🎉 Checkout successful!', 'Thank you for your purchase!');
            dispatch(clearCart());
            setShowConfetti(false);
            navigation.goBack();
        }, 2000);
    };

    const renderCartItem = ({ item, index }: { item: any; index: number }) => (
        <Animated.View
            entering={SlideInRight.delay(index * 50).springify()}
            exiting={SlideOutRight}
            style={{
                flexDirection: 'row',
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                alignItems: 'center',
                backgroundColor: '#fff'
            }}
        >
            <Image source={{ uri: item.thumbnail }} style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 8 }} />
            <View style={{ flex: 1, marginLeft: 15 }}>
                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                <Text style={{ color: '#666', marginTop: 4 }}>${item.price}</Text>
            </View>
            <Animated.View entering={ZoomIn}>
                <TouchableOpacity 
                    onPress={() => dispatch(removeFromCart(item.id))}
                    style={{ backgroundColor: '#fee', padding: 8, borderRadius: 6 }}
                >
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Remove</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, color: '#007AFF' }}>← Back</Text>
                </TouchableOpacity>

                <Animated.Text entering={FadeIn} style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Your Cart</Animated.Text>

                {cartItems.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>Your cart is empty</Text>
                        <TouchableOpacity
                            style={{ marginTop: 20, backgroundColor: '#000', padding: 12, borderRadius: 8 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={{ color: '#fff' }}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={cartItems}
                            renderItem={renderCartItem}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                        />
                        <View style={{
                            padding: 20,
                            borderTopWidth: 1,
                            borderTopColor: '#eee',
                            marginTop: 10
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total:</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>${totalPrice}</Text>
                            </View>

                            <Animated.View entering={ZoomIn.delay(100)}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#000',
                                        padding: 18,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        marginBottom: 10
                                    }}
                                    onPress={handleCheckout}
                                >
                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Checkout</Text>
                                </TouchableOpacity>
                            </Animated.View>

                            <TouchableOpacity
                                onPress={() => dispatch(clearCart())}
                                style={{ alignItems: 'center' }}
                            >
                                <Text style={{ color: 'red' }}>Clear Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
        
        <Modal visible={showConfetti} transparent animationType="fade">
            <Confetti />
        </Modal>
    );
}
