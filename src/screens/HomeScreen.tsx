import React, { useEffect } from "react";
import { FlatList, Image, Text, TextInput, View, ActivityIndicator, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import { styles } from "../styles";
import { dataItem } from "../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts, setSearchQuery } from "../../store/dataSlice";
import { useAppLifecycle } from "../../hooks/useAppLifecycle";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items, loading, isFetchingMore, error, searchQuery, skip, limit, total } = useAppSelector((state) => state.data);
    const cartItems = useAppSelector((state) => state.cart.items);

    // Initialize lifecycle and cache loading
    useAppLifecycle();

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchProducts({ skip: 0, limit, query: searchQuery }));
        }
    }, [dispatch]);

    const handleSearch = (text: string) => {
        dispatch(setSearchQuery(text));
        dispatch(fetchProducts({ skip: 0, limit, query: text }));
    };

    const loadMore = () => {
        if (!isFetchingMore && items.length < total) {
            dispatch(fetchProducts({ skip, limit, query: searchQuery }));
        }
    };

    const renderItm = ({ item }: { item: dataItem }) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('Details', { id: item.id.toString() })}
            activeOpacity={0.7}
        >
            <View style={styles.innerContainer}>
                <Image style={styles.img} source={{ uri: item.thumbnail }} />
                <Text style={{ fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>{item.title}</Text>
                <Text style={{ color: '#666' }}>${item.price}</Text>
                <Text style={{ color: '#007AFF', marginTop: 5 }}>View Details →</Text>
            </View>
            <Text>{"\n"}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text style={styles.txt}>Shop Mart</Text>
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

                <TextInput
                    style={styles.search}
                    onChangeText={handleSearch}
                    value={searchQuery}
                    placeholder="Search for an item.."
                />

                {loading && items.length === 0 ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
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

