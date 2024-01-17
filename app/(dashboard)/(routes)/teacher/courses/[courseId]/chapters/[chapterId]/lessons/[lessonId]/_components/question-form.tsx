import { Question } from '@prisma/client'
import React from 'react'

interface QuestionFormProps {
    question: Partial<Question>
}

export default function QuestionForm({}: QuestionFormProps) {
  return (
    <div>QuestionForm</div>
  )
}