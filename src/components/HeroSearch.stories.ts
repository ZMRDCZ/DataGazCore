import type { Meta, StoryObj } from '@storybook/vue3'
import HeroSearch from './HeroSearch.vue'

const meta: Meta<typeof HeroSearch> = {
  title: 'Components/HeroSearch',
  component: HeroSearch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Основной компонент поиска KnowledgeGas AI с поддержкой голосового поиска, drag & drop и анимацией пламени.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Стандартное состояние поисковой строки с placeholder текстом.'
      }
    }
  }
}

export const Focused: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')
    if (input) {
      input.focus()
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Поисковая строка в фокусе с активированной анимацией пламени.'
      }
    }
  }
}

export const WithQuery: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement
    if (input) {
      input.value = 'СП 62.13330-2021'
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Поисковая строка с введённым запросом.'
      }
    }
  }
} 