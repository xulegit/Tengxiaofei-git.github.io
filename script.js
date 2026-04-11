const yearElement = document.getElementById('year')
const themeToggleButton = document.getElementById('theme-toggle')
const themeLabel = document.querySelector('[data-theme-label]')
const cardViewport = document.getElementById('card-viewport')
const cardTrack = document.getElementById('card-track')
const navDots = document.querySelectorAll('.nav-dot')
const slideJumpButtons = document.querySelectorAll('[data-slide-to]:not(.nav-dot)')

const SECTION_IDS = ['home', 'skills', 'research', 'competition', 'internship', 'social']

/** 单张幻灯片占视口宽度比例；越小左右邻卡露得越多 */
const SLIDE_WIDTH_RATIO = 0.78

/** 卡片比轨道略矮的像素，留出上下空隙以便 box-shadow 不被裁切 */
const CARD_VERTICAL_INSET = 12

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

    btn.classList.toggle('active', isActive)
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

/** 让所有 .card-slide 与轨道同高，保证每张卡片纵向长度一致（不随单页内容变矮变高） */
const syncSlideHeights = () => {
  if (!cardTrack) {
    return
  }
  const trackH = cardTrack.clientHeight
  if (trackH <= 0) {
    return
  }
  const slideH = Math.max(160, trackH - CARD_VERTICAL_INSET)
  Array.from(cardTrack.querySelectorAll('.card-slide')).forEach((el) => {
    el.style.height = `${slideH}px`
    el.style.minHeight = `${slideH}px`
    el.style.alignSelf = 'center'
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
  syncSlideHeights()
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

  if (typeof ResizeObserver !== 'undefined') {
    const carouselResizeObserver = new ResizeObserver(() => {
      syncCarouselLayout()
    })
    carouselResizeObserver.observe(cardViewport)
  }

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

  const findVerticalScrollable = (start, stopAncestor) => {
    let el = start
    while (el && el !== stopAncestor) {
      if (!(el instanceof Element)) {
        el = el.parentElement
        continue
      }
      const st = window.getComputedStyle(el)
      const oy = st.overflowY
      if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && el.scrollHeight > el.clientHeight + 2) {
        return el
      }
      el = el.parentElement
    }
    return null
  }

  const handleCarouselWheel = (event) => {
    if (isArrowCarouselBlockedTarget(event.target)) {
      return
    }
    if (event.deltaY === 0) {
      return
    }
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
      return
    }
    const scrollEl = findVerticalScrollable(event.target, cardViewport)
    if (scrollEl) {
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight
      if (event.deltaY > 0 && scrollEl.scrollTop < maxScroll - 1) {
        return
      }
      if (event.deltaY < 0 && scrollEl.scrollTop > 0) {
        return
      }
    }
    event.preventDefault()
    if (event.deltaY > 0) {
      goToIndex(currentIndex + 1)
      return
    }
    goToIndex(currentIndex - 1)
  }

  cardViewport.addEventListener('wheel', handleCarouselWheel, { passive: false })

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
