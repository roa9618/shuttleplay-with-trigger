import { useSyncExternalStore } from 'react';

export type NotificationType = 'SCHEDULE' | 'MATCH' | 'GROUP' | 'SYSTEM';

export type AppNotification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  targetPath: string;
  read: boolean;
};

const initialNotifications: AppNotification[] = [
  {
    id: 1,
    type: 'MATCH',
    title: '다음 경기가 배정되었습니다',
    message: '2번 코트에서 경기가 곧 시작됩니다. 경기 준비를 해주세요.',
    createdAt: '방금 전',
    targetPath: '/sessions/demo/next-match',
    read: false,
  },
  {
    id: 2,
    type: 'SCHEDULE',
    title: '이번 주 운동 일정이 등록되었습니다',
    message: '금요일 오후 8시 판교 배드민턴 동호회 일정이 등록되었습니다.',
    createdAt: '10분 전',
    targetPath: '/groups',
    read: false,
  },
  {
    id: 3,
    type: 'GROUP',
    title: '모임 운영 안내가 변경되었습니다',
    message: '참석 등록 마감 시간이 운동 시작 2시간 전으로 변경되었습니다.',
    createdAt: '어제',
    targetPath: '/groups/1',
    read: true,
  },
  {
    id: 4,
    type: 'SYSTEM',
    title: '프로필 정보를 확인해주세요',
    message: '정확한 매칭을 위해 급수와 활동 정보를 최신 상태로 유지해주세요.',
    createdAt: '3일 전',
    targetPath: '/settings',
    read: true,
  },
];

let notifications = initialNotifications;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getSnapshot() {
  return notifications;
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function markNotificationAsRead(notificationId: number) {
  notifications = notifications.map(notification => (
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  ));
  emitChange();
}

export function markAllNotificationsAsRead() {
  notifications = notifications.map(notification => ({
    ...notification,
    read: true,
  }));
  emitChange();
}
