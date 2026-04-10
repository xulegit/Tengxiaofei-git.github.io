const yearElement = document.getElementById('year')
const themeToggleButton = document.getElementById('theme-toggle')
const themeLabel = document.querySelector('[data-theme-label]')
const navLinks = document.querySelectorAll('.nav-link')
const sections = document.querySelectorAll('section[id]')

const SECTION_IDS = ['home', 'research', 'competition', 'internship', 'social']

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear())
}

const updateThemeUi = () => {
  const isDark = document.documentElement.classList.contains('dark')
  if (themeToggleButton) {
    themeToggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false')
  }
  if (themeLabel) {
    themeLabel.textContent = isDark ? '深色' : '浅色'
  }
}

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
}
updateThemeUi()

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    localStorage.setItem('theme', currentTheme)
    updateThemeUi()
  })

  themeToggleButton.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }
    event.preventDefault()
    themeToggleButton.click()
  })
}

const applyNavActive = (activeId) => {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href')
    const isActive = href === `#${activeId}`
    link.classList.toggle('bg-brand-100', isActive)
    link.classList.toggle('text-brand-800', isActive)
    link.classList.toggle('dark:bg-brand-500/20', isActive)
    link.classList.toggle('dark:text-brand-200', isActive)
    link.classList.toggle('font-semibold', isActive)
    link.classList.toggle('text-slate-600', !isActive)
    link.classList.toggle('dark:text-slate-400', !isActive)
    if (isActive) {
      link.setAttribute('aria-current', 'location')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

const getInitialSectionId = () => {
  const raw = window.location.hash.replace(/^#/, '')
  if (SECTION_IDS.includes(raw)) {
    return raw
  }
  return 'home'
}

applyNavActive(getInitialSectionId())

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }
      const currentId = entry.target.getAttribute('id')
      if (!currentId) {
        return
      }
      applyNavActive(currentId)
    })
  },
  {
    rootMargin: '-32% 0px -48% 0px',
    threshold: 0.12
  }
)

sections.forEach((section) => observer.observe(section))
