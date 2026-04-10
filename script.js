const yearElement = document.getElementById('year')
const themeToggleButton = document.getElementById('theme-toggle')
const themeLabel = document.querySelector('[data-theme-label]')
const cardViewport = document.getElementById('card-viewport')
const cardTrack = document.getElementById('card-track')
const navDots = document.querySelectorAll('.nav-dot')
const slideJumpButtons = document.querySelectorAll('[data-slide-to]:not(.nav-dot)')

const SECTION_IDS = ['home', 'research', 'competition', 'internship', 'social']

/** 单张幻灯片占视口宽度比例；越小左右邻卡露得越多 */
const SLIDE_WIDTH_RATIO = 0.78

let currentIndex = 0
let touchStartX = null

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

const getIndexForId = (id) => {
  const i = SECTION_IDS.indexOf(id)
  return i >= 0 ? i : 0
}

const applyNavActive = (activeId) => {
  navDots.forEach((btn) => {
    const target = btn.getAttribute('data-slide-to')
    const isActive = target === activeId
    const label = btn.querySelector('.nav-dot__label')

    btn.classList.toggle('w-auto', isActive)
    btn.classList.toggle('min-w-12', isActive)
    btn.classList.toggle('gap-2', isActive)
    btn.classList.toggle('pr-4', isActive)
    btn.classList.toggle('w-12', !isActive)
    btn.classList.toggle('gap-0', !isActive)
    btn.classList.toggle('pr-0', !isActive)

    if (label) {
      label.classList.toggle('max-w-[min(20rem,calc(100vw-5rem))]', isActive)
      label.classList.toggle('opacity-100', isActive)
      label.classList.toggle('max-w-0', !isActive)
      label.classList.toggle('opacity-0', !isActive)
    }

    btn.classList.toggle('border-brand-500', isActive)
    btn.classList.toggle('border-slate-200/80', !isActive)
    btn.classList.toggle('bg-brand-50', isActive)
    btn.classList.toggle('bg-white', !isActive)
    btn.classList.toggle('text-brand-800', isActive)
    btn.classList.toggle('text-slate-700', !isActive)
    btn.classList.toggle('shadow-lg', isActive)
    btn.classList.toggle('shadow-card', !isActive)
    btn.classList.toggle('dark:border-brand-400', isActive)
    btn.classList.toggle('dark:border-slate-700', !isActive)
    btn.classList.toggle('dark:bg-brand-500/25', isActive)
    btn.classList.toggle('dark:bg-slate-800/90', !isActive)
    btn.classList.toggle('dark:text-brand-100', isActive)
    btn.classList.toggle('dark:text-slate-200', !isActive)
    btn.classList.toggle('dark:shadow-lg', isActive)
    btn.classList.toggle('dark:shadow-card-dark', !isActive)
    if (isActive) {
      btn.setAttribute('aria-current', 'true')
    } else {
      btn.removeAttribute('aria-current')
    }
  })
}

const syncSlideWidths = () => {
  if (!cardViewport || !cardTrack) {
    return
  }
  const viewW = cardViewport.clientWidth
  const slidePx = Math.max(200, Math.round(viewW * SLIDE_WIDTH_RATIO))
  Array.from(cardTrack.querySelectorAll('.card-slide')).forEach((el) => {
    el.style.flex = '0 0 auto'
    el.style.width = `${slidePx}px`
    el.style.minWidth = `${slidePx}px`
    el.style.maxWidth = `${slidePx}px`
  })
}

const syncTransform = () => {
  if (!cardViewport || !cardTrack) {
    return
  }
  const slide = cardTrack.children[currentIndex]
  if (!slide) {
    return
  }
  const viewW = cardViewport.clientWidth
  const slideW = slide.offsetWidth
  const slideLeft = slide.offsetLeft
  const translateX = (viewW - slideW) / 2 - slideLeft
  cardTrack.style.transform = `translateX(${translateX}px)`
}

const syncCarouselLayout = () => {
  syncSlideWidths()
  syncTransform()
}

const goToIndex = (index, { updateHash = true } = {}) => {
  if (!cardViewport || !cardTrack) {
    return
  }
  const max = SECTION_IDS.length - 1
  const next = Math.min(Math.max(0, index), max)
  currentIndex = next
  syncTransform()
  const id = SECTION_IDS[currentIndex]
  applyNavActive(id)
  if (updateHash) {
    const url = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(null, '', url)
  }
}

const goToId = (id, options) => {
  goToIndex(getIndexForId(id), options)
}

const getInitialSectionId = () => {
  const raw = window.location.hash.replace(/^#/, '')
  if (SECTION_IDS.includes(raw)) {
    return raw
  }
  return 'home'
}

if (cardViewport && cardTrack) {
  currentIndex = getIndexForId(getInitialSectionId())
  applyNavActive(SECTION_IDS[currentIndex])
  requestAnimationFrame(() => {
    syncCarouselLayout()
    requestAnimationFrame(() => {
      syncCarouselLayout()
    })
  })

  window.addEventListener('resize', () => {
    syncCarouselLayout()
  })

  navDots.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-slide-to')
      if (!id) {
        return
      }
      goToId(id)
    })
    btn.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return
      }
      event.preventDefault()
      btn.click()
    })
  })

  slideJumpButtons.forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-slide-to')
      if (!id) {
        return
      }
      goToId(id)
    })
  })

  cardViewport.addEventListener('touchstart', (e) => {
    if (!e.changedTouches.length) {
      return
    }
    touchStartX = e.changedTouches[0].clientX
  }, { passive: true })

  cardViewport.addEventListener('touchend', (e) => {
    if (touchStartX === null || !e.changedTouches.length) {
      return
    }
    const dx = e.changedTouches[0].clientX - touchStartX
    touchStartX = null
    if (Math.abs(dx) < 48) {
      return
    }
    if (dx < 0) {
      goToIndex(currentIndex + 1)
    } else {
      goToIndex(currentIndex - 1)
    }
  }, { passive: true })

  const isArrowCarouselBlockedTarget = (target) => {
    if (!target || !target.closest) {
      return false
    }
    return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
  }

  const handleCarouselArrowKeys = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }
    if (isArrowCarouselBlockedTarget(event.target)) {
      return
    }
    event.preventDefault()
    if (event.key === 'ArrowRight') {
      goToIndex(currentIndex + 1)
      return
    }
    goToIndex(currentIndex - 1)
  }

  window.addEventListener('keydown', handleCarouselArrowKeys)

  window.addEventListener('hashchange', () => {
    const id = getInitialSectionId()
    goToId(id, { updateHash: false })
  })
}
