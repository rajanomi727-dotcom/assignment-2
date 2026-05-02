import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface Props {
  name:     string;
  subtitle?: string;
}

const LOGO_URI = 'https://i.postimg.cc/5608yfsM/image.png';

export default function ProfileHeader({ name, subtitle }: Props) {
  const spin     = useRef(new Animated.Value(0)).current;
  const pulse    = useRef(new Animated.Value(0.85)).current;
  const fadeIn   = useRef(new Animated.Value(0)).current;
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    // Rotating gradient ring
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1800, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.92, duration: 1800, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
      ])
    ).start();

    // Fade in on mount
    Animated.timing(fadeIn, {
      toValue: 1, duration: 900, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      {/* Outer glow halo */}
      <Animated.View style={[styles.halo, { transform: [{ scale: pulse }] }]}>
        <LinearGradient
          colors={['rgba(0,245,255,0.25)', 'rgba(139,92,246,0.18)', 'rgba(236,72,153,0.10)']}
          style={styles.haloGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Spinning gradient ring */}
      <Animated.View style={[styles.ringWrapper, { transform: [{ rotate }] }]}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd, Colors.gradientStart]}
          style={styles.ring}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* White border gap between ring and image */}
      <View style={styles.ringGap} />

      {/* Profile image */}
      {imgErr ? (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitials}>
            {name.split(' ').slice(0,2).map(n => n[0]?.toUpperCase() ?? '').join('')}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: LOGO_URI }}
          style={styles.avatar}
          onError={() => setImgErr(true)}
        />
      )}

      {/* Name & subtitle */}
      <View style={styles.textBlock}>
        <Text style={styles.name}>{name || 'NIXH User'}</Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : (
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Active</Text>
            </View>
            <Text style={styles.handleText}>@{name.toLowerCase().replace(/\s+/g, '.')}</Text>
          </View>
        )}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Posts',     value: '248'  },
          { label: 'Followers', value: '12.4K' },
          { label: 'Following', value: '391'  },
        ].map((s, i) => (
          <View key={s.label} style={[styles.stat, i === 1 && styles.statCenter]}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const AVATAR_SIZE = 108;
const RING_SIZE   = AVATAR_SIZE + 8;
const HALO_SIZE   = AVATAR_SIZE + 48;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 28,
  },
  halo: {
    position: 'absolute',
    top: 48 - (HALO_SIZE - AVATAR_SIZE) / 2,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    overflow: 'hidden',
  },
  haloGradient: {
    flex: 1,
  },
  ringWrapper: {
    position: 'absolute',
    top: 48 - (RING_SIZE - AVATAR_SIZE) / 2,
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    overflow: 'hidden',
  },
  ring: {
    flex: 1,
  },
  ringGap: {
    position: 'absolute',
    top: 48 - 2,
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    backgroundColor: '#0A0A0A',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#111',
  },
  avatarFallback: {
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accentDim,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 2,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 18,
    gap: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,245,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.25)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  handleText: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    width: '80%',
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
