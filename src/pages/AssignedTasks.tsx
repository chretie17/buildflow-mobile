import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../utils/api';
import { getUserId } from '../utils/storage';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const AssignedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert('Session Expired', 'Please log in again.');
        return;
      }

      try {
        const response = await api.get(`/tasks/assigned/${userId}`);
        setTasks(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#E05F00" style={styles.loader} />;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 16, margin: 8, borderRadius: 8, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#555' },
  status: { marginTop: 8, fontSize: 14, color: '#E05F00' },
});

export default AssignedTasks;
