import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface MaterialData {
  userName: string
  type: 'text' | 'image'
  content: string
  title?: string
}

export async function analyzeDispute(materials: MaterialData[], disputeDescription: string): Promise<string> {
  const materialsText = materials
    .map((m, index) => {
      const header = `【${m.userName}】${m.title ? ` - ${m.title}` : ''}`
      const content = m.type === 'image' ? `[图片证据] ${m.content}` : m.content
      return `${index + 1}. ${header}\n${content}`
    })
    .join('\n\n')

  const prompt = `你是一位公正、专业的争端调解专家。请根据以下争端描述和各方提交的证据，进行客观分析并给出解决方案。

## 争端描述
${disputeDescription}

## 各方提交的证据与立场
${materialsText}

请按照以下结构进行分析和回应：

### 一、争端概述
简要总结本次争端的核心问题和争议焦点。

### 二、各方立场分析
客观分析各方的主要观点、论据及其合理性。

### 三、证据评估
评估各方提交证据的有效性、相关性和可信度。

### 四、是非评判
基于事实和逻辑，给出公正的是非判断，明确指出各方的对错之处。

### 五、解决方案
提供具体、可行的解决方案和行动建议，帮助各方达成共识。

### 六、预防建议
为避免类似争端再次发生，提供相关建议。

请注意：
1. 保持中立、客观的态度
2. 基于事实和证据进行分析
3. 考虑各方的合理诉求
4. 提供切实可行的解决方案
5. 语言简洁明了，易于理解`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的争端调解专家，擅长客观分析问题并提供公正的解决方案。请用中文回答。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    return completion.choices[0].message.content || '分析失败，请稍后重试'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('AI分析服务暂时不可用，请稍后重试')
  }
}
