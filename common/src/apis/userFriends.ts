export type UserFriendsSortBy = 'meet_count' | 'last_met_at'

export type GetUserFriendsRequest = {
  limit?: number
  sort_by?: UserFriendsSortBy
  cursor?: string | null
}

export type UserFriendListItem = {
  user_id: string
  user_name: string
  user_image_url: string
  meet_count: number
  first_met_at: number
  last_met_at: number
}

export type GetUserFriendsResponse = {
  friends: UserFriendListItem[]
  next_cursor: string | null
  has_more: boolean
}

export type BackfillUserFriendsRequest = {
  dry_run?: boolean
  community_id?: string
  event_id_from?: string
  event_id_to?: string
  resume_token?: string
}

export type BackfillUserFriendsResponse = {
  dry_run: boolean
  scanned_events_count: number
  processed_pairs_count: number
  updated_docs_count: number
  resume_token: string | null
}
