import Taro from '@tarojs/taro'

import type { EventItem, EventRecord } from '../types/events'

const STORAGE_KEY = 'blueprint_event_log'

const defaultEvents: EventItem[] = [
  {
    id: 1001,
    title: 'Launch Preparation',
    description: 'Checklist for getting the launch capsule ready.',
    createdAt: '2024-11-20T08:15:00.000Z',
    records: [
      {
        id: 5001,
        date: '2024-11-20',
        startTime: '08:30',
        endTime: '09:10',
        durationMinutes: 40,
        note: 'Subsystem warmup'
      },
      {
        id: 5002,
        date: '2024-11-20',
        startTime: '10:00',
        endTime: '11:05',
        durationMinutes: 65,
        note: 'Safety review'
      }
    ]
  },
  {
    id: 1002,
    title: 'Research Sprint',
    description: 'Deep work window for data investigation.',
    createdAt: '2024-11-21T07:00:00.000Z',
    records: [
      {
        id: 6001,
        date: '2024-11-21',
        startTime: '13:15',
        endTime: '15:00',
        durationMinutes: 105,
        note: 'Model validation'
      }
    ]
  }
]

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(part => Number(part) || 0)
  return hours * 60 + minutes
}

export const calculateDurationMinutes = (start: string, end: string) => {
  const startMinutes = toMinutes(start)
  const endMinutes = toMinutes(end)
  const diff = endMinutes - startMinutes
  return diff >= 0 ? diff : diff + 24 * 60
}

export const loadEvents = (): EventItem[] => {
  try {
    const stored = Taro.getStorageSync(STORAGE_KEY)
    if (stored && Array.isArray(stored)) {
      return stored as EventItem[]
    }
  } catch (error) {
    console.warn('Unable to read storage, using defaults.', error)
  }
  Taro.setStorageSync(STORAGE_KEY, defaultEvents)
  return defaultEvents
}

export const persistEvents = (events: EventItem[]) => {
  Taro.setStorageSync(STORAGE_KEY, events)
}

export const updateEvent = (event: EventItem) => {
  const events = loadEvents()
  const next = events.map(item => (item.id === event.id ? event : item))
  persistEvents(next)
}

export const deleteEvent = (eventId: number) => {
  const events = loadEvents()
  const next = events.filter(item => item.id !== eventId)
  persistEvents(next)
}

export const createEvent = (title: string, description: string): EventItem => {
  const now = new Date()
  return {
    id: Date.now(),
    title,
    description,
    createdAt: now.toISOString(),
    records: []
  }
}

export const createRecord = (
  date: string,
  startTime: string,
  endTime: string,
  note: string
): EventRecord => ({
  id: Date.now(),
  date,
  startTime,
  endTime,
  durationMinutes: calculateDurationMinutes(startTime, endTime),
  note
})
