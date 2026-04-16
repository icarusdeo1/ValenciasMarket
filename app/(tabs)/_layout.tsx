import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BRAND_PRIMARY = '#C41E24';
const TEXT_SECONDARY = '#6B6B6B';

type TabIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
};

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_PRIMARY,
        tabBarInactiveTintColor: TEXT_SECONDARY,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#E0E0E0',
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
