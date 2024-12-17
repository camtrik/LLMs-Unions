import chatgptIcon from '@/assets/chatgpt-icon.png'
import claudeIcon from '@/assets/claude-icon.png'
import geminiIcon from '@/assets/gemini-icon.png'

export const models = [
    {
        id: 'chatgpt', 
        name: 'ChatGPT',
        icon: chatgptIcon
    },
    {
        id: 'claude',
        name: 'Claude', 
        icon: claudeIcon
    }, 
    {
        id: 'gemini',
        name: 'Gemini', 
        icon: geminiIcon
    }
]

export const getModelById = (id: string) => 
    models.find(model => model.id === id)