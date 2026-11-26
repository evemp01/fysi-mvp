import type { Patient } from '@/data/types'

export const initials = (p: Patient) => p.firstName[0] + p.name.split(' ')[1][0]
