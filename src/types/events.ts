export type EventRecord = {
  id: number
  date: string
  startTime: string
  endTime: string
  durationMinutes: number
  note: string
}

export type EventItem = {
  id: number
  title: string
  description: string
  createdAt: string
  records: EventRecord[]
}
