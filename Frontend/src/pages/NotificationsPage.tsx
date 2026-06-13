import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users,
  Info,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  useNotifications,
  type AppNotification,
  type NotificationType,
} from '../utils/notificationStore';
import { getNotifications } from '../utils/notificationApi';
import { styles } from './NotificationsPage.styles';

const NOTIFICATIONS_PER_PAGE = 9;

function formatCreatedAt(createdAt: string) {
  const elapsedMinutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));

  if (elapsedMinutes < 1) return '방금 전';
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;
  if (elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)}시간 전`;
  if (elapsedMinutes < 2880) return '어제';
  return `${Math.floor(elapsedMinutes / 1440)}일 전`;
}

const notificationIcons: Record<NotificationType, typeof Bell> = {
  SCHEDULE: CalendarDays,
  MATCH: Trophy,
  GROUP: Users,
  SYSTEM: Info,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const notificationUpdates = useNotifications();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    void getNotifications(currentPage - 1, NOTIFICATIONS_PER_PAGE, showUnreadOnly)
      .then(response => {
        setNotifications(response.items.map(notification => ({
          ...notification,
          createdAt: formatCreatedAt(notification.createdAt),
        })));
        if (!showUnreadOnly) setTotalCount(response.totalElements);
        setTotalPages(Math.max(1, response.totalPages));
        setUnreadCount(response.unreadCount);

        if (currentPage > Math.max(1, response.totalPages)) {
          setCurrentPage(Math.max(1, response.totalPages));
        }
      });
  }, [currentPage, showUnreadOnly, notificationUpdates]);

  const openNotification = (notification: AppNotification) => {
    void markNotificationAsRead(notification.id).then(() => {
      setNotifications(current => current.map(item => (
        item.id === notification.id ? { ...item, read: true } : item
      )));
      setUnreadCount(current => Math.max(0, current - (notification.read ? 0 : 1)));
      navigate(notification.targetPath);
    });
  };

  const markAllAsRead = () => {
    void markAllNotificationsAsRead().then(() => {
      setNotifications(current => current.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      if (showUnreadOnly) setCurrentPage(1);
    });
  };

  const changeFilter = (unreadOnly: boolean) => {
    setShowUnreadOnly(unreadOnly);
    setCurrentPage(1);
  };

  return (
    <div className = {styles.page}>
      <div className = {styles.content}>
        <header className = {styles.header}>
          <div>
            <h1 className = {styles.title}>전체 알림</h1>
            <p className = {styles.subtitle}>
              일정, 경기, 모임과 관련된 중요한 소식을 확인하세요.
            </p>
          </div>

          <Button
            type = "button"
            variant = "outline"
            className = {styles.markAllButton}
            disabled = {unreadCount === 0}
            onClick = {markAllAsRead}
          >
            <CheckCheck />
            전체 읽음 처리
          </Button>
        </header>

        <section className = {styles.card}>
          <div className = {styles.toolbar}>
            <div className = {styles.tabs}>
              <button
                type = "button"
                className = {styles.tab(!showUnreadOnly)}
                onClick = {() => changeFilter(false)}
              >
                전체
                <span>{totalCount}</span>
              </button>
              <button
                type = "button"
                className = {styles.tab(showUnreadOnly)}
                onClick = {() => changeFilter(true)}
              >
                읽지 않음
                <span>{unreadCount}</span>
              </button>
            </div>

            <span className = {styles.summary}>
              읽지 않은 알림 {unreadCount}개
            </span>
          </div>

          {notifications.length > 0 ? (
            <div className = {styles.list}>
              {notifications.map(notification => {
                const Icon = notificationIcons[notification.type];

                return (
                  <button
                    key = {notification.id}
                    type = "button"
                    className = {styles.item(notification.read)}
                    onClick = {() => openNotification(notification)}
                  >
                    <div className = {styles.iconBox(notification.type)}>
                      <Icon />
                    </div>

                    <div className = {styles.itemContent}>
                      <div className = {styles.itemTitleRow}>
                        <strong>{notification.title}</strong>
                        {!notification.read && <span className = {styles.unreadDot} />}
                      </div>
                      <p>{notification.message}</p>
                      <span>{notification.createdAt}</span>
                    </div>

                    <ChevronRight className = {styles.chevron} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className = {styles.empty}>
              <div className = {styles.emptyIcon}>
                <CheckCheck />
              </div>
              <strong>모든 알림을 확인했습니다</strong>
              <span>새로운 알림이 도착하면 이곳에서 확인할 수 있습니다.</span>
            </div>
          )}
        </section>

        <nav className = {styles.pagination} aria-label = "페이지 이동">
          <button type = "button" className = {styles.paginationArrow} disabled = {currentPage === 1} onClick = {() => setCurrentPage(currentPage - 1)} aria-label = "이전 페이지"><ChevronLeft /></button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <button key = {page} type = "button" className = {styles.paginationPage(currentPage === page)} onClick = {() => setCurrentPage(page)}>{page}</button>
          ))}
          <button type = "button" className = {styles.paginationArrow} disabled = {currentPage === totalPages} onClick = {() => setCurrentPage(currentPage + 1)} aria-label = "다음 페이지"><ChevronRight /></button>
        </nav>
      </div>
    </div>
  );
}
