import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ProfileHeader  from '../components/ProfileHeader';
import EditableField  from '../components/EditableField';
import GlassButton    from '../components/GlassButton';
import { Colors }     from '../constants/colors';
import { fetchProfile, updateProfile, UserProfile } from '../services/api';

type EditState = Omit<UserProfile, 'id'>;

export default function ProfileScreen() {
  const [profile,     setProfile]     = useState<UserProfile | null>(null);
  const [editState,   setEditState]   = useState<EditState>({ name: '', email: '', phone: '' });
  const [isEditing,   setIsEditing]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Animations
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const errorShake     = useRef(new Animated.Value(0)).current;
  const successScale   = useRef(new Animated.Value(0)).current;
  const loaderSpin     = useRef(new Animated.Value(0)).current;

  // ── Loader spin ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || saving) {
      Animated.loop(
        Animated.timing(loaderSpin, {
          toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true,
        })
      ).start();
    } else {
      loaderSpin.stopAnimation();
      loaderSpin.setValue(0);
    }
  }, [loading, saving]);

  // ── Fetch profile ───────────────────────────────────────────────────────────
  const loadProfile = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const data = await fetchProfile();
      setProfile(data);
      setEditState({ name: data.name, email: data.email, phone: data.phone });
      Animated.timing(contentOpacity, {
        toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }).start();
    } catch (err: any) {
      setError(err.message ?? 'Could not reach server');
      shakeError();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, []);

  // ── Error shake ─────────────────────────────────────────────────────────────
  const shakeError = () => {
    errorShake.setValue(0);
    Animated.sequence([
      Animated.timing(errorShake, { toValue:  10, duration: 80,  useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -10, duration: 80,  useNativeDriver: true }),
      Animated.timing(errorShake, { toValue:   6, duration: 60,  useNativeDriver: true }),
      Animated.timing(errorShake, { toValue:  -6, duration: 60,  useNativeDriver: true }),
      Animated.timing(errorShake, { toValue:   0, duration: 60,  useNativeDriver: true }),
    ]).start();
  };

  // ── Success pulse ───────────────────────────────────────────────────────────
  const showSuccess = () => {
    setSaveSuccess(true);
    successScale.setValue(0);
    Animated.sequence([
      Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 180, friction: 8 }),
      Animated.delay(1800),
      Animated.timing(successScale, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setSaveSuccess(false));
  };

  // ── Edit / Save / Cancel ────────────────────────────────────────────────────
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profile) {
      setEditState({ name: profile.name, email: profile.email, phone: profile.phone });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmed: EditState = {
      name:  editState.name.trim(),
      email: editState.email.trim(),
      phone: editState.phone.trim(),
    };

    if (!trimmed.name) { Alert.alert('Validation', 'Name cannot be empty'); return; }
    if (!trimmed.email.includes('@')) { Alert.alert('Validation', 'Enter a valid email'); return; }

    setSaving(true);
    try {
      const updated = await updateProfile(trimmed);
      setProfile(updated);
      setEditState({ name: updated.name, email: updated.email, phone: updated.phone });
      setIsEditing(false);
      showSuccess();
    } catch (err: any) {
      Alert.alert('Save failed', err.message ?? 'Could not update profile');
      shakeError();
    } finally {
      setSaving(false);
    }
  };

  const loaderRotate = loaderSpin.interpolate({ inputRange: [0,1], outputRange: ['0deg','360deg'] });

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
        <Animated.View style={{ transform: [{ rotate: loaderRotate }] }}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
            style={styles.loaderRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        <Text style={styles.loaderText}>Loading profile…</Text>
      </View>
    );
  }

  // ── Error screen ────────────────────────────────────────────────────────────
  if (error && !profile) {
    return (
      <View style={styles.loaderScreen}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
        <Animated.View style={{ transform: [{ translateX: errorShake }] }}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMsg}>{error}</Text>
        </Animated.View>
        <GlassButton label="Retry" icon="↺" onPress={() => loadProfile()} style={{ marginTop: 24 }} />
      </View>
    );
  }

  // ── Main screen ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Top nav bar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>NIXH</Text>
        <View style={styles.navAccent} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProfile(true)}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
            />
          }
        >
          <Animated.View style={{ opacity: contentOpacity }}>

            {/* Profile header */}
            <ProfileHeader name={editState.name} />

            {/* Divider */}
            <View style={styles.sectionDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.sectionLabel}>Profile Info</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Fields card */}
            <Animated.View style={[
              styles.card,
              { transform: [{ translateX: errorShake }] },
            ]}>
              <EditableField
                label="Full Name"
                value={editState.name}
                icon="👤"
                editable={isEditing}
                onChangeText={t => setEditState(p => ({ ...p, name: t }))}
                autoCapitalize="words"
                delay={0}
              />
              <EditableField
                label="Email Address"
                value={editState.email}
                icon="✉️"
                editable={isEditing}
                onChangeText={t => setEditState(p => ({ ...p, email: t }))}
                keyboardType="email-address"
                autoCapitalize="none"
                delay={80}
              />
              <EditableField
                label="Phone Number"
                value={editState.phone}
                icon="📱"
                editable={isEditing}
                onChangeText={t => setEditState(p => ({ ...p, phone: t }))}
                keyboardType="phone-pad"
                autoCapitalize="none"
                delay={160}
              />
            </Animated.View>

            {/* Action buttons */}
            <View style={styles.actions}>
              {!isEditing ? (
                <GlassButton
                  label="Edit Profile"
                  icon="✎"
                  onPress={handleEdit}
                  variant="primary"
                />
              ) : (
                <View style={styles.editActions}>
                  <GlassButton
                    label="Save Changes"
                    icon="✓"
                    onPress={handleSave}
                    variant="primary"
                    loading={saving}
                    style={{ flex: 1 }}
                  />
                  <GlassButton
                    label="Cancel"
                    onPress={handleCancel}
                    variant="ghost"
                    disabled={saving}
                    style={{ flex: 0.55 }}
                  />
                </View>
              )}
            </View>

            {/* Profile meta info */}
            {profile && (
              <View style={styles.metaCard}>
                <Text style={styles.metaTitle}>Account Details</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>User ID</Text>
                  <Text style={styles.metaValue}>#{String(profile.id).padStart(6, '0')}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Status</Text>
                  <View style={styles.metaStatusBadge}>
                    <View style={styles.metaStatusDot} />
                    <Text style={styles.metaStatusText}>Verified</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Joined</Text>
                  <Text style={styles.metaValue}>April 2025</Text>
                </View>
              </View>
            )}

            <Text style={styles.footer}>NIXH · v1.0.0</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success toast */}
      {saveSuccess && (
        <Animated.View style={[
          styles.toast,
          { transform: [{ scale: successScale }] },
        ]}>
          <Text style={styles.toastText}>✓  Profile updated</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // Navbar
  navbar: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 6,
  },
  navAccent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 2,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  // Section divider
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Fields card
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 20,
  },

  // Action buttons
  actions: {
    marginBottom: 24,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },

  // Meta card
  metaCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 14,
    marginBottom: 24,
  },
  metaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaKey: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  metaValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  metaStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  metaStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  metaStatusText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1,
  },

  // Loader screen
  loaderScreen: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loaderRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  loaderText: {
    color: Colors.textSecondary,
    fontSize: 14,
    letterSpacing: 0.4,
  },

  // Error
  errorIcon: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  errorMsg: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 32 },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  toastText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
