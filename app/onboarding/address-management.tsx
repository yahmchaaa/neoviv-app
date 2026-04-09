import React, { useState, useEffect } from 'react';
import LoadingModal from '../../src/components/LoadingModal';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { saveAddress, getUserAddresses, deleteAddress } from '../../src/services/onboarding';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

const LOCATION_TYPES = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'office', label: 'Office', icon: '🏢' },
  { value: 'event', label: 'Event', icon: '🎪' },
];

export default function AddressManagementScreen() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState('home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const buttonScale = useSharedValue(1);

  // Animation values
  const orb1Y = useSharedValue(0);
  const orb1X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb3Y = useSharedValue(0);
  const orb3X = useSharedValue(0);

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(30, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb1X.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2Y.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-25, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(25, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb3Y.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb3X.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb1Y.value }, { translateX: orb1X.value }],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb2Y.value }, { translateX: orb2X.value }],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb3Y.value }, { translateX: orb3X.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const { data, error } = await getUserAddresses();
      if (error) {
        Alert.alert('Error', error);
      } else {
        setAddresses(data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressLine1 || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    buttonScale.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 300, useNativeDriver: true }),
        withTiming(1, { duration: 300, useNativeDriver: true })
      ),
      3,
      false
    );

    setSaving(true);

    try {
      const isPrimary = addresses.length === 0;
      const { success, error, addressId } = await saveAddress({
        locationType: selectedLocationType as any,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        isPrimary,
      });

      if (error) {
        Alert.alert('Error', error);
      } else {
        // Reset form and reload addresses
        setShowAddForm(false);
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setState('');
        setZipCode('');
        setSelectedLocationType('home');
        loadAddresses();
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSaving(false);
      buttonScale.value = 1;
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteAddress(addressId);
            if (error) {
              Alert.alert('Error', error);
            } else {
              loadAddresses();
            }
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    if (addresses.length === 0) {
      Alert.alert('Error', 'Please add at least one address to continue');
      return;
    }
    router.replace('/onboarding/medical-history');
  };

  const getLocationIcon = (type: string) => {
    const found = LOCATION_TYPES.find(t => t.value === type);
    return found?.icon || '📍';
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient colors={[TEAL + '40', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient colors={[ELECTRIC_BLUE + '30', TEAL + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb3, orb3Style]}>
        <LinearGradient colors={[TEAL + '30', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '57.1%' }]} />
        </View>
        <Text style={styles.progressText}>Step 4 of 7</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>NEOVIV</Text>
              <Text style={styles.tagline}>drops of life</Text>
            </View>

            {/* Address List */}
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Service Address</Text>
                <Text style={styles.subtitle}>
                  Add your service location. This is where we'll send your clinician.
                </Text>

                {/* Saved Addresses */}
                {addresses.length > 0 && (
                  <View style={styles.addressList}>
                    {addresses.map((addr) => (
                      <BlurView key={addr.id} intensity={15} tint="dark" style={styles.addressItem}>
                        <TouchableOpacity style={styles.addressContent} onPress={() => handleDeleteAddress(addr.id)}>
                          <Text style={styles.addressIcon}>{getLocationIcon(addr.location_type)}</Text>
                          <View style={styles.addressText}>
                            <Text style={styles.addressType}>
                              {addr.location_type.charAt(0).toUpperCase() + addr.location_type.slice(1)}
                              {addr.is_primary && ' (Primary)'}
                            </Text>
                            <Text style={styles.addressLine}>{addr.address_line1}</Text>
                            <Text style={styles.addressLine}>
                              {addr.city}, {addr.state} {addr.zip_code}
                            </Text>
                          </View>
                          <Text style={styles.deleteIcon}>✕</Text>
                        </TouchableOpacity>
                      </BlurView>
                    ))}
                  </View>
                )}

                {/* Add Address Form */}
                {!showAddForm ? (
                  <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
                    <LinearGradient
                      colors={[TEAL + '30', ELECTRIC_BLUE + '20']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.addButtonGradient}
                    >
                      <Text style={styles.addButtonText}>+ Add Location</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.addForm}>
                    <Text style={styles.formTitle}>Add Service Address</Text>

                    {/* Location Type Selector */}
                    <Text style={styles.inputLabel}>Location Type</Text>
                    <View style={styles.locationTypeContainer}>
                      {LOCATION_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.value}
                          style={[
                            styles.locationTypeButton,
                            selectedLocationType === type.value && styles.locationTypeButtonActive,
                          ]}
                          onPress={() => setSelectedLocationType(type.value)}
                        >
                          <Text style={styles.locationTypeIcon}>{type.icon}</Text>
                          <Text
                            style={[
                              styles.locationTypeLabel,
                              selectedLocationType === type.value && styles.locationTypeLabelActive,
                            ]}
                          >
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Address with Google Maps Autocomplete placeholder */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Street Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Start typing your address..."
                        placeholderTextColor="#666"
                        value={addressLine1}
                        onChangeText={setAddressLine1}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Apt, Suite, etc. (Optional)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Apt 4B"
                        placeholderTextColor="#666"
                        value={addressLine2}
                        onChangeText={setAddressLine2}
                      />
                    </View>

                    <View style={styles.row}>
                      <View style={[styles.inputContainer, { flex: 2 }]}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Miami"
                          placeholderTextColor="#666"
                          value={city}
                          onChangeText={setCity}
                        />
                      </View>
                      <View style={[styles.inputContainer, { flex: 1, marginLeft: 12 }]}>
                        <Text style={styles.inputLabel}>State</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="FL"
                          placeholderTextColor="#666"
                          value={state}
                          onChangeText={setState}
                          autoCapitalize="characters"
                          maxLength={2}
                        />
                      </View>
                      <View style={[styles.inputContainer, { flex: 1, marginLeft: 12 }]}>
                        <Text style={styles.inputLabel}>ZIP</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="33101"
                          placeholderTextColor="#666"
                          value={zipCode}
                          onChangeText={setZipCode}
                          keyboardType="number-pad"
                          maxLength={5}
                        />
                      </View>
                    </View>

                    <View style={styles.formButtons}>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddForm(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>

                      <Animated.View style={buttonStyle}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress} disabled={saving}>
                          <LinearGradient
                            colors={[TEAL, ELECTRIC_BLUE]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButtonGradient}
                          >
                            <Text style={styles.saveButtonText}>
                              Save Location
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </Animated.View>
                    </View>
                  </View>
                )}

                {/* Continue Button */}
                <Animated.View style={[buttonStyle, { marginTop: 24 }]}>
                  <TouchableOpacity style={styles.submitButton} onPress={handleContinue}>
                    <LinearGradient
                      colors={[TEAL, ELECTRIC_BLUE]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.submitButtonText}>Continue</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
                <LoadingModal visible={saving} message="Saving..." />
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: TEAL,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 14,
    color: ELECTRIC_BLUE,
    letterSpacing: 4,
    marginTop: 8,
    fontStyle: 'italic',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  addressList: {
    marginBottom: 20,
  },
  addressItem: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  addressIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  addressText: {
    flex: 1,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addressLine: {
    fontSize: 13,
    color: '#B3B3B3',
    marginTop: 2,
  },
  deleteIcon: {
    fontSize: 16,
    color: '#888',
    padding: 8,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: TEAL + '40',
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: TEAL,
    fontSize: 16,
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  locationTypeButtonActive: {
    borderColor: TEAL,
    backgroundColor: TEAL + '20',
  },
  locationTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  locationTypeLabel: {
    fontSize: 11,
    color: '#888',
  },
  locationTypeLabelActive: {
    color: TEAL,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 12,
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#B3B3B3',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  orbGradient: {
    width: '100%',
    height: '100%',
  },
  orb1: {
    width: 250,
    height: 250,
    top: -80,
    right: -60,
    opacity: 0.5,
  },
  orb2: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -50,
    opacity: 0.4,
  },
  orb3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -40,
    opacity: 0.3,
  },
});
