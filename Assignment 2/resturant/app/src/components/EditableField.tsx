import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  KeyboardTypeOptions,
} from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  label:        string;
  value:        string;
  icon:         string;
  editable:     boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  delay?:       number;
}

export default function EditableField({
  label, value, icon, editable, onChangeText,
  keyboardType = 'default', autoCapitalize = 'words', delay = 0,
}: Props) {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const slideIn    = useRef(new Animated.Value(30)).current;
  const fadeIn     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideIn, {
        toValue: 0, duration: 500, delay,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1, duration: 500, delay,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1, duration: 250, useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0, duration: 250, useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [Colors.border, Colors.accent],
  });

  const bgColor = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [Colors.bgCard, 'rgba(0,245,255,0.06)'],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View style={[
      styles.wrapper,
      { opacity: fadeIn, transform: [{ translateY: slideIn }] },
    ]}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[
        styles.fieldContainer,
        {
          borderColor,
          backgroundColor: bgColor,
          shadowOpacity,
          shadowColor: Colors.accent,
          shadowRadius: 10,
          elevation: 4,
        },
      ]}>
        <Text style={styles.icon}>{icon}</Text>
        <TextInput
          style={[styles.input, !editable && styles.inputReadonly]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.accent}
          cursorColor={Colors.accent}
        />
        {editable && (
          <View style={styles.editIndicator} />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  icon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  inputReadonly: {
    color: Colors.textSecondary,
  },
  editIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
});
