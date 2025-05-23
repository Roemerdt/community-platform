import type { Comment } from './comment'
import type { ContentType } from './common'
import type { IDBDocSB, IDoc } from './document'
import type { News } from './news'
import type { IPatreonUser } from './patreon'
import type { Question } from './question'

export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo_url: string | null
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}

export class Profile {
  id: number
  username: string
  displayName: string
  isVerified: boolean
  isSupporter: boolean
  photoUrl: string | null
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: Profile) {
    Object.assign(this, obj)
  }

  static fromDB(dbProfile: DBProfile) {
    return new Profile({
      id: dbProfile.id,
      country: dbProfile.country,
      displayName: dbProfile.display_name,
      username: dbProfile.username,
      isSupporter: dbProfile.is_supporter,
      isVerified: dbProfile.is_verified,
      photoUrl: dbProfile.photo_url || null,
      roles: dbProfile.roles || null,
    })
  }
}

// Notifications here to avoid circular dependencies

export type NotificationActionType = 'newContent' | 'newComment'
type NotificationContentType = 'news' | 'comment' | 'reply'
// type NotificationContentType = 'news' | 'research' | 'researchUpdate' | 'project' | 'question' | 'comment' | 'reply'

type NotificationSourceContentType = ContentType
// type NotificationSourceContentType = 'news' | 'research' | 'researchUpdate' | 'project' | 'question' // What page on the platform should be linked to
type NotificationSourceContent = News | Comment | Question

type TriggeredBy = Pick<Profile, 'id' | 'username' | 'photoUrl'>

export class DBNotification implements IDBDocSB {
  readonly id: number
  readonly action_type: NotificationActionType
  readonly content_type: NotificationContentType
  readonly content_id: number
  readonly content: NotificationSourceContent

  readonly created_at: Date
  modified_at: Date | null
  readonly owned_by: DBProfile
  owned_by_id: number
  is_read: boolean
  source_content_type: NotificationSourceContentType
  source_content_id: number
  triggered_by: DBProfile
  triggered_by_id: number

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export class Notification implements IDoc {
  id: number
  actionType: NotificationActionType
  contentType: NotificationContentType
  contentId: number
  content?: NotificationSourceContent
  createdAt: Date
  modifiedAt: Date | null
  ownedById: number
  isRead: boolean
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
  sourceContent?: NotificationSourceContent
  triggeredBy: TriggeredBy

  constructor(obj: Notification) {
    Object.assign(this, obj)
  }

  static fromDB(dbNotification: DBNotification) {
    return new Notification({
      id: dbNotification.id,
      actionType: dbNotification.action_type,
      contentType: dbNotification.content_type,
      contentId: dbNotification.content_id,
      createdAt: new Date(dbNotification.created_at),
      modifiedAt: dbNotification.modified_at
        ? new Date(dbNotification.modified_at)
        : null,
      ownedById: dbNotification.owned_by_id,
      isRead: dbNotification.is_read,
      sourceContentType: dbNotification.source_content_type,
      sourceContentId: dbNotification.source_content_id,
      triggeredBy: Profile.fromDB(dbNotification.triggered_by),
    })
  }
}

export type NewNotificationData = {
  actionType: NotificationActionType
  ownedById: number
  triggeredById: number
  contentType: NotificationContentType
  contentId: number
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
}
