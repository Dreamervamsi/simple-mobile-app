import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View, SafeAreaView, Alert, TextInput, Modal, ScrollView } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { 
  createSharedCart, 
  addToSharedCart, 
  removeFromSharedCart, 
  addParticipant, 
  setCurrentSharedCart,
  deleteSharedCart 
} from "../../store/collaborativeCartSlice";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function CollaborativeCartScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { sharedCarts, currentSharedCart } = useAppSelector((state) => state.collaborativeCart);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCartName, setNewCartName] = useState('');
    const [participantEmail, setParticipantEmail] = useState('');

    const handleCreateCart = () => {
        if (!newCartName.trim()) {
            Alert.alert('Error', 'Please enter a cart name');
            return;
        }
        dispatch(createSharedCart({ name: newCartName, createdBy: 'You' }));
        setNewCartName('');
        setModalVisible(false);
    };

    const handleAddParticipant = () => {
        if (!participantEmail.trim() || !currentSharedCart) {
            Alert.alert('Error', 'Please enter an email and select a cart');
            return;
        }
        dispatch(addParticipant({ cartId: currentSharedCart.id, participant: participantEmail }));
        setParticipantEmail('');
        Alert.alert('Success', 'Participant added successfully');
    };

    const renderSharedCart = ({ item }: { item: any }) => (
        <AnimatedView
            entering={FadeIn}
            style={{
                backgroundColor: '#f9f9f9',
                padding: 15,
                borderRadius: 12,
                marginBottom: 10,
                borderWidth: currentSharedCart?.id === item.id ? 2 : 1,
                borderColor: currentSharedCart?.id === item.id ? '#007AFF' : '#ddd'
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                <TouchableOpacity onPress={() => dispatch(deleteSharedCart(item.id))}>
                    <Text style={{ color: 'red', fontSize: 12 }}>Delete</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ color: '#666', marginTop: 5 }}>{item.items.length} items</Text>
            <Text style={{ color: '#999', fontSize: 12, marginTop: 5 }}>
                Participants: {item.participants.join(', ')}
            </Text>
            <TouchableOpacity
                onPress={() => dispatch(setCurrentSharedCart(item))}
                style={{
                    backgroundColor: '#007AFF',
                    padding: 8,
                    borderRadius: 6,
                    marginTop: 10,
                    alignItems: 'center'
                }}
            >
                <Text style={{ color: '#fff', fontSize: 12 }}>Select Cart</Text>
            </TouchableOpacity>
        </AnimatedView>
    );

    const renderCartItem = ({ item }: { item: any }) => (
        <View style={{
            flexDirection: 'row',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            alignItems: 'center'
        }}>
            <Image source={{ uri: item.thumbnail }} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
            <View style={{ flex: 1, marginLeft: 15 }}>
                <Text numberOfLines={1} style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: '#666' }}>${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => currentSharedCart && dispatch(removeFromSharedCart({ cartId: currentSharedCart.id, itemId: item.id }))}>
                <Text style={{ color: 'red' }}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, color: '#007AFF' }}>← Back</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Collaborative Shopping</Text>

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: '#000',
                        padding: 15,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginBottom: 20
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>+ Create Shared Cart</Text>
                </TouchableOpacity>

                {currentSharedCart ? (
                    <AnimatedView entering={SlideInUp} style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{currentSharedCart.name}</Text>
                            <TouchableOpacity onPress={() => dispatch(setCurrentSharedCart(null))}>
                                <Text style={{ color: '#007AFF' }}>Switch Cart</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                            <TextInput
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    padding: 10,
                                    marginRight: 10
                                }}
                                placeholder="Add participant email"
                                value={participantEmail}
                                onChangeText={setParticipantEmail}
                            />
                            <TouchableOpacity
                                onPress={handleAddParticipant}
                                style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 8 }}
                            >
                                <Text style={{ color: '#fff' }}>Add</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={currentSharedCart.items}
                            renderItem={renderCartItem}
                            keyExtractor={(item) => item.id.toString()}
                            style={{ flex: 1 }}
                        />
                    </AnimatedView>
                ) : (
                    <ScrollView>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Your Shared Carts</Text>
                        {sharedCarts.length === 0 ? (
                            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                <Text style={{ fontSize: 48 }}>🛒</Text>
                                <Text style={{ fontSize: 16, color: '#666', marginTop: 20 }}>No shared carts yet</Text>
                                <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Create one to shop with friends!</Text>
                            </View>
                        ) : (
                            sharedCarts.map((cart) => renderSharedCart({ item: cart }))
                        )}
                    </ScrollView>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <AnimatedView entering={SlideInUp} style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Create Shared Cart</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 15
                            }}
                            placeholder="Cart name (e.g., Family Shopping)"
                            value={newCartName}
                            onChangeText={setNewCartName}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{ flex: 1, marginRight: 10, padding: 12, backgroundColor: '#ddd', borderRadius: 8, alignItems: 'center' }}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCreateCart}
                                style={{ flex: 1, marginLeft: 10, padding: 12, backgroundColor: '#000', borderRadius: 8, alignItems: 'center' }}
                            >
                                <Text style={{ color: '#fff' }}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </AnimatedView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
