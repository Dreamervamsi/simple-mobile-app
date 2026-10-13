import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay, Easing } from 'react-native-reanimated';

interface ConfettiPieceProps {
    index: number;
}

function ConfettiPiece({ index }: ConfettiPieceProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
        const randomX = (Math.random() - 0.5) * 400;
        const randomY = Math.random() * 600 + 200;
        const randomRotation = Math.random() * 360;
        const randomDelay = Math.random() * 500;

        translateX.value = withDelay(
            randomDelay,
            withRepeat(
                withSequence(
                    withTiming(randomX, { duration: 2000, easing: Easing.out(Easing.quad) }),
                    withTiming(0, { duration: 0 })
                ),
                -1,
                false
            )
        );

        translateY.value = withDelay(
            randomDelay,
            withRepeat(
                withSequence(
                    withTiming(randomY, { duration: 2000, easing: Easing.out(Easing.quad) }),
                    withTiming(0, { duration: 0 })
                ),
                -1,
                false
            )
        );

        rotation.value = withDelay(
            randomDelay,
            withRepeat(
                withSequence(
                    withTiming(randomRotation, { duration: 2000 }),
                    withTiming(0, { duration: 0 })
                ),
                -1,
                false
            )
        );

        scale.value = withDelay(
            randomDelay,
            withRepeat(
                withSequence(
                    withTiming(0, { duration: 2000 }),
                    withTiming(1, { duration: 0 })
                ),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` },
            { scale: scale.value }
        ],
    }));

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
    const color = colors[index % colors.length];

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    backgroundColor: color,
                    top: '50%',
                    left: '50%',
                },
                animatedStyle,
            ]}
        />
    );
}

export default function Confetti() {
    const pieces = Array.from({ length: 50 }, (_, i) => i);

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            {pieces.map((index) => (
                <ConfettiPiece key={index} index={index} />
            ))}
        </View>
    );
}
