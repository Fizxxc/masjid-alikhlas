import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';

export default function Index() {
  const { loading, session, profile } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (profile?.role === 'admin') return <Redirect href="/admin/dashboard" />;
  return <Redirect href="/(tabs)" />;
}
