export type ParticipantTagsButtonClickAction = 'reveal-and-prompt' | 'reveal' | 'hide'

export function shouldShowParticipantTagsButton(input: {
  isShowMember: boolean
  isCurrentUserParticipant: boolean
  previewProfilesReady: boolean
  previewHasAnyTags: boolean
}): boolean {
  if (!input.isShowMember) {
    return false
  }
  if (input.isCurrentUserParticipant) {
    return true
  }
  return input.previewProfilesReady && input.previewHasAnyTags
}

export function resolveParticipantTagsButtonClick(input: {
  tagsVisible: boolean
  isLoggedIn: boolean
  myTagsReady: boolean
  myTagCount: number
}): ParticipantTagsButtonClickAction {
  if (input.tagsVisible) {
    return 'hide'
  }
  if (input.isLoggedIn && input.myTagsReady && input.myTagCount === 0) {
    return 'reveal-and-prompt'
  }
  return 'reveal'
}
