import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_PRIMARY = '#C41E24';
const TEXT_SECONDARY = '#6B6B6B';
const TEXT_SECONDARY_DARK = '#A0A0A0';

type TabIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
};

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_PRIMARY,
        tabBarInactiveTintColor: isDark ? TEXT_SECONDARY_DARK : TEXT_SECONDARY,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: isDark ? '#333333' : '#E0E0E0',
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="taqueria"
        options={{
          title: 'Taqueria',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="restaurant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="storefront" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="catering"
        options={{
          title: 'Catering',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
