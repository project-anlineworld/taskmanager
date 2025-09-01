// Discord integration utilities
// Note: This is a basic implementation for demonstration purposes
// For production use, you'd want to implement a proper Discord bot

interface DiscordWebhookPayload {
  content?: string
  embeds?: DiscordEmbed[]
}

interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: DiscordField[]
  timestamp?: string
}

interface DiscordField {
  name: string
  value: string
  inline?: boolean
}

export class DiscordIntegration {
  private webhookUrl: string | null = null

  constructor() {
    // In a real implementation, you'd get this from environment variables
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || null
  }

  private async sendWebhook(payload: DiscordWebhookPayload) {
    if (!this.webhookUrl) {
      console.warn('Discord webhook URL not configured')
      return
    }

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      console.error('Failed to send Discord webhook:', error)
    }
  }

  async notifyTaskCreated(task: {
    title: string
    description?: string
    assignee?: { display_name?: string; username?: string }
    reporter?: { display_name?: string; username?: string }
    priority: string
  }) {
    const assigneeName = task.assignee?.display_name || task.assignee?.username || '未割り当て'
    const reporterName = task.reporter?.display_name || task.reporter?.username || '不明'

    const embed: DiscordEmbed = {
      title: '🆕 新しいタスクが作成されました',
      description: task.title,
      color: 0x2563eb, // Blue color
      fields: [
        {
          name: '担当者',
          value: assigneeName,
          inline: true,
        },
        {
          name: '報告者',
          value: reporterName,
          inline: true,
        },
        {
          name: '優先度',
          value: task.priority,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    }

    if (task.description) {
      embed.fields?.push({
        name: '説明',
        value: task.description.length > 100 
          ? task.description.substring(0, 100) + '...' 
          : task.description,
        inline: false,
      })
    }

    await this.sendWebhook({ embeds: [embed] })
  }

  async notifyTaskStatusChanged(task: {
    title: string
    oldStatus: string
    newStatus: string
    assignee?: { display_name?: string; username?: string }
    changedBy?: { display_name?: string; username?: string }
  }) {
    const assigneeName = task.assignee?.display_name || task.assignee?.username || '未割り当て'
    const changedByName = task.changedBy?.display_name || task.changedBy?.username || '不明'

    const statusColors: Record<string, number> = {
      '未着手': 0x6b7280, // Gray
      '進行中': 0x2563eb, // Blue
      'レビュー待ち': 0xf59e0b, // Yellow
      '完了': 0x10b981, // Green
    }

    const embed: DiscordEmbed = {
      title: '📝 タスクのステータスが更新されました',
      description: task.title,
      color: statusColors[task.newStatus] || 0x6b7280,
      fields: [
        {
          name: 'ステータス変更',
          value: `${task.oldStatus} → ${task.newStatus}`,
          inline: true,
        },
        {
          name: '担当者',
          value: assigneeName,
          inline: true,
        },
        {
          name: '変更者',
          value: changedByName,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    }

    await this.sendWebhook({ embeds: [embed] })
  }

  async notifyTaskCompleted(task: {
    title: string
    assignee?: { display_name?: string; username?: string }
    completedBy?: { display_name?: string; username?: string }
  }) {
    const assigneeName = task.assignee?.display_name || task.assignee?.username || '未割り当て'
    const completedByName = task.completedBy?.display_name || task.completedBy?.username || '不明'

    const embed: DiscordEmbed = {
      title: '✅ タスクが完了しました',
      description: task.title,
      color: 0x10b981, // Green
      fields: [
        {
          name: '担当者',
          value: assigneeName,
          inline: true,
        },
        {
          name: '完了者',
          value: completedByName,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    }

    await this.sendWebhook({ embeds: [embed] })
  }
}

// Singleton instance
export const discord = new DiscordIntegration()