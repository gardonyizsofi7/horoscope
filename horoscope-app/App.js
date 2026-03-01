import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { ZodiacGrid } from './src/components/ZodiacGrid';
import { HoroscopeModal } from './src/components/HoroscopeModal';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function App() {
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getCurrentDateFormatted = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('hu-HU', options);
  };

  const handleZodiacSelect = (zodiac) => {
    setSelectedZodiac(zodiac);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <MaterialCommunityIcons name="menu" size={28} color="white" />
        <Text style={styles.headerTitle}>Horoszkóp</Text>
        <MaterialCommunityIcons name="star-outline" size={28} color="white" />
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getCurrentDateFormatted()}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, timeframe === 'daily' && styles.activeTab]}
          onPress={() => setTimeframe('daily')}
        >
          <Text style={[styles.tabText, timeframe === 'daily' && styles.activeTabText]}>Napi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, timeframe === 'weekly' && styles.activeTab]}
          onPress={() => setTimeframe('weekly')}
        >
          <Text style={[styles.tabText, timeframe === 'weekly' && styles.activeTabText]}>Heti</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, timeframe === 'monthly' && styles.activeTab]}
          onPress={() => setTimeframe('monthly')}
        >
          <Text style={[styles.tabText, timeframe === 'monthly' && styles.activeTabText]}>Havi</Text>
        </TouchableOpacity>
      </View>

      <ZodiacGrid onSelect={handleZodiacSelect} />

      {selectedZodiac && (
        <HoroscopeModal
          visible={modalVisible}
          zodiac={selectedZodiac}
          timeframe={timeframe}
          onClose={() => setModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a2c82', // Purple background similar to the image
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    color: '#e0e0e0',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'white',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
});
