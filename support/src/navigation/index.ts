import type { HorizontalNavItems, VerticalNavItems } from '@layouts/types'
import {
  mdiViewDashboardOutline,
  mdiCalendar,
  mdiAccountGroup,
  mdiStorefrontOutline,
  mdiCart,
  mdiAccount,
} from '@mdi/js'

export const useNavItems = (): HorizontalNavItems | VerticalNavItems => {
  const { t: $t } = useI18n()
  return [
    {
      title: $t('navigation.dashboard'),
      to: { path: '/' },
      icon: { icon: mdiViewDashboardOutline },
    },
    {
      title: $t('navigation.events'),
      to: { path: '/events' },
      icon: { icon: mdiCalendar },
    },
    {
      title: $t('navigation.communities'),
      to: { path: '/communities' },
      icon: { icon: mdiAccountGroup },
    },
    {
      title: $t('navigation.shops'),
      to: { path: '/shops' },
      icon: { icon: mdiStorefrontOutline },
    },
    {
      title: $t('navigation.orders'),
      to: { path: '/orders' },
      icon: { icon: mdiCart },
    },
    {
      title: $t('navigation.users'),
      to: { path: '/users' },
      icon: { icon: mdiAccount },
    },
  ]
}
