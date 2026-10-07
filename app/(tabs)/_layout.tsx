import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../src/store/useSettingsStore';

export default function TabLayout() {
  const lang = useSettingsStore((s) => s.lang);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4FC3F7',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.55)',
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: lang === 'tr' ? 'Hava Durumu' : 'Weather',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cities"
        options={{
          title: lang === 'tr' ? 'Şehirler' : 'Cities',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: lang === 'tr' ? 'Ayarlar' : 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
