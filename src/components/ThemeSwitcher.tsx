import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from 'react-i18next'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'system'
      default:
        return 'light'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return t('light')
      case 'dark':
        return t('dark')
      default:
        return t('auto')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(getNextTheme())}
      className="gap-2"
    >
      {getIcon()}
      <span className="hidden sm:inline">{getThemeLabel()}</span>
    </Button>
  )
}