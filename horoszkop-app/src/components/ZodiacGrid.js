import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ZODIACS = [
  { id: 'kos', name: 'Kos', icon: 'zodiac-aries' },
  { id: 'bika', name: 'Bika', icon: 'zodiac-taurus' },
  { id: 'ikrek', name: 'Ikrek', icon: 'zodiac-gemini' },
  { id: 'rak', name: 'Rák', icon: 'zodiac-cancer' },
  { id: 'oroszlan', name: 'Oroszlán', icon: 'zodiac-leo' },
  { id: 'szuz', name: 'Szűz', icon: 'zodiac-virgo' },
  { id: 'merleg', name: 'Mérleg', icon: 'zodiac-libra' },
  { id: 'skorpio', name: 'Skorpió', icon: 'zodiac-scorpio' },
  { id: 'nyilas', name: 'Nyilas', icon: 'zodiac-sagittarius' },
  { id: 'bak', name: 'Bak', icon: 'zodiac-capricorn' },
  { id: 'vizonto', name: 'Vízöntő', icon: 'zodiac-aquarius' },
  { id: 'halak', name: 'Halak', icon: 'zodiac-pisces' },
];

export const ZodiacGrid = ({ onSelect }) => {
  return (
    <View style={styles.gridContainer}>
      {ZODIACS.map((zodiac) => (
        <TouchableOpacity
          key={zodiac.id}
          style={styles.zodiacItem}
          onPress={() => onSelect(zodiac)}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={zodiac.icon} size={48} color="white" />
          </View>
          <Text style={styles.zodiacName}>{zodiac.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    gap: 15,
  },
  zodiacItem: {
    width: '28%',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  zodiacName: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
