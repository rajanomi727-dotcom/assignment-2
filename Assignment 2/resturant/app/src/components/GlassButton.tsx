import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Text,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface Props {
  label:     string;
  onPress:   () => void;
  variant?:  'primary' | 'ghost' | 'danger';
  icon?:     string;
  disabled?: boolean;
  style?:    ViewStyle;
  loading?:  boolean;
}

export default function GlassButton({
  label, onPress, variant = 'primary', icon,
  disabled = false, style, loading = false,
}: Props) {
  const scale   = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale,    { toValue: 0.95, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale,    { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1], outputRange: [0.15, 0.6],
  });

  const isPrimary = variant === 'primary';
  const isGhost   = variant === 'ghost';
  const isDanger  = variant === 'danger';

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={!disabled && !loading ? onPress : undefined}
    >
      {/* Shadow wrapper — must NOT have overflow:hidden so the glow is visible */}
      <Animated.View style={[
        styles.shadowWrapper,
        { transform: [{ scale }] },
        {
          shadowColor:    isDanger ? '#EF4444' : Colors.accent,
          shadowOpacity,
          shadowRadius:   14,
          shadowOffset:   { width: 0, height: 4 },
          elevation:      6,
        },
        (disabled || loading) && styles.disabled,
        style,
      ]}>
        {/* Inner clip wrapper keeps content corners rounded */}
        <View style={styles.clipWrapper}>
          {isPrimary ? (
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientMid]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <ButtonContent label={loading ? 'Saving…' : label} icon={icon} dark />
            </LinearGradient>
          ) : (
            <View style={[
              styles.plain,
              isGhost && styles.ghost,
              isDanger && styles.danger,
            ]}>
              <ButtonContent
                label={loading ? 'Saving…' : label}
                icon={icon}
                dark={isDanger}
                accent={isGhost}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

function ButtonContent({ label, icon, dark, accent }: {
  label: string; icon?: string; dark?: boolean; accent?: boolean;
}) {
  const color = dark ? '#000' : accent ? Colors.accent : Colors.textPrimary;
  return (
    <View style={btnStyles.row}>
      {icon && <Text style={[btnStyles.icon, { color }]}>{icon}</Text>}
      <Text style={[btnStyles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 16,
    // No overflow:hidden here — lets shadow/glow bleed outside
  },
  clipWrapper: {
    borderRadius: 16,
    overflow: 'hidden', // clips gradient/border corners
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  plain: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ghost: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  disabled: {
    opacity: 0.4,
  },
});

const btnStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
