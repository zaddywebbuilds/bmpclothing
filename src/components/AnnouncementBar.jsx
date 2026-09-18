import { site } from '../data/site'

export default function AnnouncementBar() {
  if (!site.announcement) return null
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <p>{site.announcement}</p>
    </div>
  )
}
