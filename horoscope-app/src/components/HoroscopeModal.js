import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { fetchHoroscope } from '../api';

export const HoroscopeModal = ({ visible, zodiac, timeframe, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [horoscopeText, setHoroscopeText] = useState('');

  useEffect(() => {
    if (visible && zodiac && timeframe) {
      loadHoroscope();
    }
  }, [visible, zodiac, timeframe]);

  const loadHoroscope = async () => {
    setLoading(true);
    const text = await fetchHoroscope(zodiac.id, timeframe);
    setHoroscopeText(text);
    setLoading(false);
  };

  const getTimeframeName = () => {
    switch (timeframe) {
      case 'daily': return 'Napi';
      case 'weekly': return 'Heti';
      case 'monthly': return 'Havi';
      default: return '';
    }
  };

  const shareText = async () => {
      try {
          await Share.share({
              message: `${zodiac.name} ${getTimeframeName().toLowerCase()} horoszkóp:\n\n${horoscopeText}\n\nForrás: zsozirisz.hu`,
          });
      } catch (error) {
          console.error(error);
      }
  }

  if (!zodiac) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <MaterialCommunityIcons name={zodiac.icon} size={32} color="#5e35b1" />
                <Text style={styles.title}>{zodiac.name} - {getTimeframeName()}</Text>
            </View>
          </View>

          <ScrollView style={styles.scrollView}>
            {loading ? (
              <ActivityIndicator size="large" color="#5e35b1" style={styles.loader} />
            ) : (
              <Text style={styles.horoscopeText}>{horoscopeText}</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.shareButton, loading && styles.shareButtonDisabled]}
            onPress={shareText}
            disabled={loading}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color="white" />
            <Text style={styles.shareButtonText}>Megosztás</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'justify',
  },
  shareButton: {
    backgroundColor: '#5e35b1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  shareButtonDisabled: {
    backgroundColor: '#9575cd',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});