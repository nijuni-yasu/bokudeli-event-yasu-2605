import type { HorizontalNavItems, VerticalNavItems } from '@layouts/types'
import {
  getCommunitiesLocation,
  getDashboardLocation,
  getEventsLocation,
  getOrdersLocation,
  getShopsLocation,
  getUsersLocation,
} from '@/router/utils'
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
      to: getDashboardLocation(),
      icon: { icon: mdiViewDashboardOutline },
    },
    {
      title: $t('navigation.events'),
      to: getEventsLocation(),
      icon: { icon: mdiCalendar },
    },
    {
      title: $t('navigation.communities'),
      to: getCommunitiesLocation(),
      icon: { icon: mdiAccountGroup },
    },
    {
      title: $t('navigation.shops'),
      to: getShopsLocation(),
      icon: { icon: mdiStorefrontOutline },
    },
    {
      title: $t('navigation.orders'),
      to: getOrdersLocation(),
      icon: { icon: mdiCart },
    },
    {
      title: $t('navigation.users'),
      to: getUsersLocation(),
      icon: { icon: mdiAccount },
    },
  ]
}
