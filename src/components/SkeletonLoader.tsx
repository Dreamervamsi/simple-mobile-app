import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SkeletonLoader() {
    return (
        <AnimatedView entering={FadeIn} style={{ padding: 15 }}>
            <AnimatedView 
                style={{ 
                    width: '100%', 
                    height: 150, 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: 8,
                    marginBottom: 10 
                }} 
            />
            <AnimatedView 
                style={{ 
                    width: '80%', 
                    height: 20, 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: 4,
                    marginBottom: 8 
                }} 
            />
            <AnimatedView 
                style={{ 
                    width: '40%', 
                    height: 16, 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: 4 
                }} 
            />
        </AnimatedView>
    );
}
