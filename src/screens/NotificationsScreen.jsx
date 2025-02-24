import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const NotificationItem = ({ item, onMarkAsRead, onDelete }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
    <View style={styles.notificationActions}>
      {!item.read && (
        <TouchableOpacity onPress={() => onMarkAsRead(item.id)}>
          <Text style={styles.actionText}>Mark as Read</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const NotificationsScreen = ({navigation}) => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Message', body: 'You have a new message from John', time: '5m ago', read: false },
    { id: '2', title: 'Friend Request', body: 'Sarah sent you a friend request', time: '1h ago', read: false },
    { id: '3', title: 'Event Reminder', body: 'Your event starts in 1 hour', time: '2h ago', read: true },
  
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 16,
  },
  deleteText: {
    color: '#FF3B30',
  },
});

export default NotificationsScreen;