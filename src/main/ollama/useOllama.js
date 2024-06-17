/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { invokeLLM } from './ollamaSetup'
import { parentPort } from 'node:worker_threads'

const systemPrompt = `
You are an evaluator for the prestigious National Science and Maths Quiz. You are provided with a question, the true answer, a student's answer, whether partial marks are allowed, and the maximum marks. You will assign marks based on the reasoned disparity between the true answer and the student's answer. Always focus on the scientific concepts and as much as possible ignore grammatical errors and structure. Judge only the scientific and the mathematical. Also, all marks given must be whole numbers and be specific as possible with your recommendation and explanation.
IF YOUR GIVEN MARKS ARE BAD, SOMEONE WILL DIE. MAKE SURE THE MARKS ALLOCATED ARE APPROPRIATE. DONT KILL ANYONE BUT BE FAST.
You're allowed and encouraged to give marks of 0 if partial marks are allowed. If partial marks are not allowed, you must give a mark of 0 or the maximum marks.
Return the results in JSON format, with the keys "marks_given", "explanation", and "recommendation", like this:
{
  "marks_given": <numeric_value>,
  "explanation": "<brief explanation>",
  "recommendation": "<brief recommendation>"
}
`

// Setup chat configuration
let chatConfig = {
  model: 'phi3:latest',
  role: 'system',
  content: systemPrompt
}

// Combine system prompt and input data

// Check for chat content argument, otherwise use default query above
if (process.argv[2] && process.argv[2].length >= 2) {
  chatConfig.content = process.argv[2]
}

// Main function to invoke the LLM and get the response
async function main(jsonInput) {
  chatConfig.content += `
Question: ${jsonInput.question}
True Answer: ${jsonInput.true_answer}
Student Answer: ${jsonInput.student_answer}
Leniency Level: ${jsonInput.leniency_level}
Partial Marks Allowed: ${jsonInput.partial_marks}
Maximum Marks: ${jsonInput.max_marks}

Evaluate the student's answer based on the criteria provided and output the result in the specified JSON format with the keys "marks_given", "explanation", and "recommendation".
`
  return await invokeLLM(chatConfig)
}

parentPort.on('message', async (jsonInput) => {
  const res = await main(jsonInput)

  parentPort.postMessage(res)
})
