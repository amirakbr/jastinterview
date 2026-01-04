import { Column } from '../types'
import { generateId } from './generateId'

export const createColumn = (columnNumber: number) : Column => {
  return {
    id: generateId(),
    title: `Column ${columnNumber}`,
  }
}
