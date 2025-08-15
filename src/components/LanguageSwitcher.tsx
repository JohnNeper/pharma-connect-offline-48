import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">
        {i18n.language === 'fr' ? t('french') : t('english')}
      </span>
    </Button>
  )
}