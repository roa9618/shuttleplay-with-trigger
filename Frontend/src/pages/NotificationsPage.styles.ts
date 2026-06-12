import type { NotificationType } from '../utils/notificationStore';

export const styles = {
  page: [
    'min-h-screen bg-background px-10 py-10',
    'bg-[radial-gradient(circle_at_top_right,var(--color-primary)/0.04,transparent_32%)]',
  ].join(' '),
  content: 'mx-auto w-full max-w-[1180px]',
  header: 'mb-7 flex items-end justify-between gap-6',
  title: 'text-[36px] font-medium tracking-tight text-foreground',
  subtitle: 'mt-2 text-sm text-muted-foreground',
  markAllButton: [
    'h-11 rounded-full border-primary/20 px-5',
    'text-primary hover:bg-primary/10 hover:text-primary',
  ].join(' '),
  card: [
    'overflow-hidden rounded-[30px] border border-primary/15',
    'bg-card shadow-xl shadow-primary/[0.07]',
  ].join(' '),
  toolbar: [
    'flex items-center justify-between gap-5 border-b',
    'border-primary/10 px-7 py-5',
  ].join(' '),
  tabs: 'flex items-center gap-2',
  tab: (active: boolean) => [
    'flex h-10 items-center gap-2 rounded-full px-4',
    'text-sm font-medium transition-colors',
    '[&>span]:rounded-full [&>span]:px-2 [&>span]:py-0.5',
    '[&>span]:text-[11px]',
    active
      ? 'bg-primary text-primary-foreground [&>span]:bg-white/20'
      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary [&>span]:bg-primary/10 [&>span]:text-primary',
  ].join(' '),
  summary: 'text-xs text-muted-foreground',
  list: 'divide-y divide-primary/10',
  item: (read: boolean) => [
    'flex w-full items-center gap-4 px-7 py-5 text-left',
    'transition-colors hover:bg-primary/[0.04]',
    read ? 'bg-card' : 'bg-primary/[0.025]',
  ].join(' '),
  iconBox: (type: NotificationType) => [
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
    '[&_svg]:h-5 [&_svg]:w-5',
    type === 'MATCH' ? 'bg-primary/10 text-primary' : '',
    type === 'SCHEDULE' ? 'bg-violet-100 text-violet-600' : '',
    type === 'GROUP' ? 'bg-fuchsia-100 text-fuchsia-600' : '',
    type === 'SYSTEM' ? 'bg-secondary text-muted-foreground' : '',
  ].filter(Boolean).join(' '),
  itemContent: [
    'min-w-0 flex-1',
    '[&>p]:mt-1 [&>p]:text-sm [&>p]:leading-6',
    '[&>p]:text-muted-foreground',
    '[&>span]:mt-2 [&>span]:block [&>span]:text-xs',
    '[&>span]:text-muted-foreground/80',
  ].join(' '),
  itemTitleRow: [
    'flex items-center gap-2',
    '[&>strong]:text-[15px] [&>strong]:font-semibold',
  ].join(' '),
  unreadDot: 'h-2 w-2 shrink-0 rounded-full bg-primary',
  chevron: 'h-4 w-4 shrink-0 text-muted-foreground/60',
  empty: [
    'flex min-h-[360px] flex-col items-center justify-center px-6 text-center',
    '[&>strong]:mt-4 [&>strong]:text-base [&>strong]:font-semibold',
    '[&>span]:mt-1.5 [&>span]:text-sm [&>span]:text-muted-foreground',
  ].join(' '),
  emptyIcon: [
    'flex h-14 w-14 items-center justify-center rounded-full',
    'bg-primary/10 text-primary [&_svg]:h-6 [&_svg]:w-6',
  ].join(' '),
} as const;
