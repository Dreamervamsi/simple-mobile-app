import React from "react";
import { ScrollView, Text, TouchableOpacity, View, SafeAreaView, Image } from "react-native";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeFromComparison, clearComparison } from "../../store/comparisonSlice";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ComparisonScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const comparisonItems = useAppSelector((state) => state.comparison.items);

    const renderComparisonRow = (label: string, getValue: (item: any) => string) => (
        <View style={{ flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text style={{ width: 100, fontWeight: 'bold', color: '#666' }}>{label}</Text>
            {comparisonItems.map((item, index) => (
                <Animated.View 
                    key={item.id}
                    entering={SlideInRight.delay(index * 50)}
                    style={{ flex: 1, paddingHorizontal: 8 }}
                >
                    <Text style={{ textAlign: 'center' }}>{getValue(item)}</Text>
                </Animated.View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, color: '#007AFF' }}>← Back</Text>
                </TouchableOpacity>

                <Animated.Text entering={FadeIn} style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
                    Product Comparison
                </Animated.Text>

                {comparisonItems.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 48 }}>📊</Text>
                        <Text style={{ fontSize: 18, color: '#666', marginTop: 20 }}>No items to compare</Text>
                        <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
                            Long-press on products to add to comparison
                        </Text>
                    </View>
                ) : (
                    <ScrollView>
                        {/* Product Images */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            {comparisonItems.map((item, index) => (
                                <Animated.View 
                                    key={item.id}
                                    entering={SlideInRight.delay(index * 50)}
                                    style={{ flex: 1, alignItems: 'center', paddingHorizontal: 8 }}
                                >
                                    <Image 
                                        source={{ uri: item.thumbnail }} 
                                        style={{ width: 80, height: 80, resizeMode: 'contain' }} 
                                    />
                                    <TouchableOpacity
                                        onPress={() => dispatch(removeFromComparison(item.id))}
                                        style={{ marginTop: 8 }}
                                    >
                                        <Text style={{ color: 'red', fontSize: 12 }}>Remove</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>

                        {/* Comparison Table */}
                        <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' }}>
                            {renderComparisonRow('Title', (item) => item.title.substring(0, 20) + '...')}
                            {renderComparisonRow('Price', (item) => `$${item.price}`)}
                            {renderComparisonRow('Category', (item) => item.category)}
                            {renderComparisonRow('Brand', (item) => item.brand)}
                            {renderComparisonRow('Rating', (item) => `${item.rating}/5`)}
                            {renderComparisonRow('Stock', (item) => item.stock.toString())}
                        </View>

                        <TouchableOpacity
                            onPress={() => dispatch(clearComparison())}
                            style={{
                                backgroundColor: '#000',
                                padding: 15,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginTop: 20
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Clear All</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
