import chatgptIcon from '@/assets/chatgpt-icon.png'
import claudeIcon from '@/assets/claude-icon.png'

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
    }
]

export const getModelById = (id: string) => 
    models.find(model => model.id === id)