import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchProducts, setSearchQuery } from "../../store/dataSlice";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function FilterScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((state) => state.data);
    
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [minRating, setMinRating] = useState<number>(0);

    const categories = Array.from(new Set(items.map((item: any) => item.category)));

    const applyFilters = () => {
        let query = '';
        if (selectedCategory) {
            query += ` category:${selectedCategory}`;
        }
        if (minPrice) {
            query += ` price>=${minPrice}`;
        }
        if (maxPrice) {
            query += ` price<=${maxPrice}`;
        }
        if (minRating > 0) {
            query += ` rating>=${minRating}`;
        }
        
        dispatch(setSearchQuery(query.trim()));
        dispatch(fetchProducts({ skip: 0, limit: 10, query: query.trim() }));
        navigation.goBack();
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setMinRating(0);
    };

    const renderStarRating = (rating: number) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setMinRating(star)}
                        style={{ marginRight: 4 }}
                    >
                        <Text style={{ fontSize: 24, color: star <= rating ? '#FFD700' : '#ddd' }}>
                            {star <= rating ? '★' : '☆'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, color: '#007AFF' }}>← Back</Text>
                </TouchableOpacity>

                <Animated.Text entering={FadeIn} style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
                    Filters
                </Animated.Text>

                <ScrollView>
                    {/* Category Filter */}
                    <AnimatedView entering={SlideInUp.delay(100)} style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => setSelectedCategory(category)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: selectedCategory === category ? '#000' : '#eee',
                                        marginRight: 8,
                                        borderWidth: selectedCategory === category ? 0 : 1,
                                        borderColor: '#ddd'
                                    }}
                                >
                                    <Text style={{ color: selectedCategory === category ? '#fff' : '#000' }}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </AnimatedView>

                    {/* Price Range Filter */}
                    <AnimatedView entering={SlideInUp.delay(200)} style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Price Range</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16
                                }}
                                placeholder="Min Price"
                                value={minPrice}
                                onChangeText={setMinPrice}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16
                                }}
                                placeholder="Max Price"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                                keyboardType="numeric"
                            />
                        </View>
                    </AnimatedView>

                    {/* Rating Filter */}
                    <AnimatedView entering={SlideInUp.delay(300)} style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                            Minimum Rating: {minRating > 0 ? `${minRating}+` : 'All'}
                        </Text>
                        {renderStarRating(minRating)}
                    </AnimatedView>

                    {/* Action Buttons */}
                    <AnimatedView entering={SlideInUp.delay(400)} style={{ marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={applyFilters}
                            style={{
                                backgroundColor: '#000',
                                padding: 15,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Apply Filters</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={clearFilters}
                            style={{
                                backgroundColor: '#eee',
                                padding: 15,
                                borderRadius: 12,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: '#000', fontSize: 16 }}>Clear All</Text>
                        </TouchableOpacity>
                    </AnimatedView>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
