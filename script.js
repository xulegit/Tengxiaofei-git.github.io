const yearElement = document.getElementById('year')
const themeToggleButton = document.getElementById('theme-toggle')
const themeLabel = document.querySelector('[data-theme-label]')
const cardViewport = document.getElementById('card-viewport')
const cardTrack = document.getElementById('card-track')
const navDots = document.querySelectorAll('.nav-dot')
const slideJumpButtons = document.querySelectorAll('[data-slide-to]:not(.nav-dot)')

/** 启用的幻灯片 id 顺序，在 applyConfig 之后赋值 */
let sectionIds = ['home', 'skills', 'research', 'competition', 'internship', 'social']

/** 单张幻灯片占视口宽度比例；越小左右邻卡露得越多 */
const SLIDE_WIDTH_RATIO = 0.78

/** 卡片比轨道略矮的像素，留出上下空隙以便 box-shadow 不被裁切 */
const CARD_VERTICAL_INSET = 12

let currentIndex = 0
let touchStartX = null

const setTextById = (id, text) => {
  const el = document.getElementById(id)
  if (el && text != null && text !== '') {
    el.textContent = text
  }
}

const getVisibleSlides = () => {
  if (!cardTrack) {
    return []
  }
  return Array.from(cardTrack.querySelectorAll('.card-slide')).filter((el) => !el.classList.contains('hidden'))
}

const renderSkillsGrid = (root, skills) => {
  if (!root || !skills?.columns?.length) {
    return
  }
  root.innerHTML = ''
  skills.columns.forEach((col) => {
    const colEl = document.createElement('div')
    const multi = (col.sections || []).length > 1
    colEl.className = multi ? 'min-w-0 space-y-4' : 'min-w-0'
    ;(col.sections || []).forEach((sec) => {
      const section = document.createElement('section')
      const h3 = document.createElement('h3')
      const longHeading = (sec.heading || '').length > 24
      h3.className = longHeading
        ? 'm-0 text-[10px] font-semibold uppercase leading-snug text-slate-500 dark:text-slate-400'
        : 'm-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'
      h3.textContent = sec.heading || ''
      const ul = document.createElement('ul')
      ul.className = 'mt-1.5 list-none space-y-1 p-0'
      ;(sec.items || []).forEach((item) => {
        const li = document.createElement('li')
        li.className = 'flex gap-2 rounded-lg bg-slate-50/80 px-2.5 py-1.5 dark:bg-slate-900/50'
        const dot = document.createElement('span')
        dot.className = 'mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--palette-doc-accent)]'
        dot.setAttribute('aria-hidden', 'true')
        const span = document.createElement('span')
        span.textContent = item
        li.appendChild(dot)
        li.appendChild(span)
        ul.appendChild(li)
      })
      section.appendChild(h3)
      section.appendChild(ul)
      colEl.appendChild(section)
    })
    root.appendChild(colEl)
  })
}

const applyTimeline = (titleId, listId, block) => {
  const titleEl = document.getElementById(titleId)
  const listEl = document.getElementById(listId)
  if (!block) {
    return
  }
  if (titleEl && block.title) {
    titleEl.textContent = block.title
  }
  if (!listEl) {
    return
  }
  listEl.innerHTML = ''
  const items = block.items
  if (!Array.isArray(items) || items.length === 0) {
    return
  }
  items.forEach((text) => {
    const li = document.createElement('li')
    li.className = 'flex gap-3 rounded-xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/50'
    const dot = document.createElement('span')
    dot.className = 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--palette-doc-accent)]'
    dot.setAttribute('aria-hidden', 'true')
    const span = document.createElement('span')
    span.textContent = text
    li.appendChild(dot)
    li.appendChild(span)
    listEl.appendChild(li)
  })
}

const applyConfig = () => {
  if (typeof CONFIG === 'undefined') {
    console.warn('未加载 config.js：请保留 <script src="config.js"></script> 且在 script.js 之前引入')
    return
  }
  const c = CONFIG

  if (c.meta?.title) {
    document.title = c.meta.title
  }
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc && c.meta?.description) {
    metaDesc.setAttribute('content', c.meta.description)
  }
  if (c.meta?.lang) {
    document.documentElement.lang = c.meta.lang
  }

  setTextById('cfg-site-header-name', c.site?.headerName)
  setTextById('cfg-greeting-lead', c.profile?.greetingLead)
  setTextById('cfg-display-name', c.profile?.displayName)
  setTextById('cfg-location', c.profile?.locationLine)
  setTextById('cfg-intro', c.profile?.intro)
  setTextById('cfg-quote', c.profile?.quote)
  setTextById('cfg-about-title', c.profile?.aboutTitle)
  setTextById('cfg-skills-title', c.skills?.title)

  const wm = c.assets?.watermark
  if (wm) {
    document.querySelectorAll('.cfg-watermark').forEach((img) => {
      img.src = wm
    })
  }
  const secIcon = c.assets?.sectionIcon
  if (secIcon) {
    document.querySelectorAll('.cfg-section-icon').forEach((img) => {
      img.src = secIcon
    })
  }

  const repo = document.getElementById('cfg-repo-link')
  if (repo && c.links?.repoUrl) {
    repo.href = c.links.repoUrl
  }
  setTextById('cfg-repo-label', c.links?.repoLabel)

  const cta = document.getElementById('cfg-primary-cta')
  if (cta) {
    if (c.links?.primaryCtaSlideId) {
      cta.setAttribute('data-slide-to', c.links.primaryCtaSlideId)
    }
    if (c.links?.primaryCtaLabel) {
      cta.textContent = c.links.primaryCtaLabel
    }
  }

  const av = document.getElementById('cfg-avatar')
  if (av) {
    if (c.profile?.avatar) {
      av.src = c.profile.avatar
    }
    if (c.profile?.avatarAlt != null) {
      av.alt = c.profile.avatarAlt
    }
  }

  const dl = document.getElementById('cfg-about-dl')
  if (dl && Array.isArray(c.profile?.aboutRows)) {
    dl.innerHTML = ''
    c.profile.aboutRows.forEach((row) => {
      const wrap = document.createElement('div')
      const dt = document.createElement('dt')
      dt.className = 'text-[10px] font-medium text-slate-500 dark:text-slate-400'
      dt.textContent = row.label || ''
      const dd = document.createElement('dd')
      dd.className = 'mt-0.5 text-xs text-slate-800 dark:text-slate-200'
      if (row.href) {
        const a = document.createElement('a')
        a.href = row.href
        a.className =
          row.label === 'GitHub'
            ? 'font-medium text-slate-800 no-underline hover:underline dark:text-slate-200'
            : 'text-slate-700 no-underline hover:underline dark:text-slate-300'
        a.textContent = row.value || ''
        if (row.href.startsWith('mailto:')) {
          a.removeAttribute('target')
          a.removeAttribute('rel')
        } else {
          a.target = '_blank'
          a.rel = 'noopener noreferrer'
        }
        dd.appendChild(a)
      } else {
        dd.textContent = row.value || ''
      }
      wrap.appendChild(dt)
      wrap.appendChild(dd)
      dl.appendChild(wrap)
    })
  }

  renderSkillsGrid(document.getElementById('cfg-skills-grid'), c.skills)

  applyTimeline('cfg-research-title', 'cfg-research-list', c.timelines?.research)
  applyTimeline('cfg-competition-title', 'cfg-competition-list', c.timelines?.competition)
  applyTimeline('cfg-internship-title', 'cfg-internship-list', c.timelines?.internship)
  applyTimeline('cfg-social-title', 'cfg-social-list', c.timelines?.social)

  ;(c.slides || []).forEach((s) => {
    if (s.enabled === false) {
      document.getElementById(s.id)?.classList.add('hidden')
      document.querySelector(`.nav-dot[data-slide-to="${s.id}"]`)?.classList.add('hidden')
    }
  })

  ;(c.slides || []).forEach((s) => {
    const btn = document.querySelector(`.nav-dot[data-slide-to="${s.id}"]`)
    if (!btn) {
      return
    }
    if (s.navAriaLabel) {
      btn.setAttribute('aria-label', s.navAriaLabel)
    }
    const lab = btn.querySelector('.nav-dot__label')
    if (lab && s.navLabel) {
      lab.textContent = s.navLabel
    }
  })

  const f1 = document.getElementById('cfg-footer-line1')
  if (f1 && c.site?.footerName && c.site?.footerOrg) {
    f1.textContent = `${c.site.footerName} · ${c.site.footerOrg}`
  }
  setTextById('cfg-footer-note', c.site?.footerNote)
}

applyConfig()

if (cardTrack && getVisibleSlides().length === 0) {
  document.getElementById('home')?.classList.remove('hidden')
  document.querySelector('.nav-dot[data-slide-to="home"]')?.classList.remove('hidden')
}

if (cardTrack) {
  const visible = getVisibleSlides().map((el) => el.id)
  sectionIds = visible.length > 0 ? visible : ['home']
}

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
  const i = sectionIds.indexOf(id)
  return i >= 0 ? i : 0
}

const applyNavActive = (activeId) => {
  navDots.forEach((btn) => {
    if (btn.classList.contains('hidden')) {
      return
    }
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
  getVisibleSlides().forEach((el) => {
    el.style.flex = '0 0 auto'
    el.style.width = `${slidePx}px`
    el.style.minWidth = `${slidePx}px`
    el.style.maxWidth = `${slidePx}px`
  })
}

/** 让所有可见 .card-slide 与轨道同高 */
const syncSlideHeights = () => {
  if (!cardTrack) {
    return
  }
  const trackH = cardTrack.clientHeight
  if (trackH <= 0) {
    return
  }
  const slideH = Math.max(160, trackH - CARD_VERTICAL_INSET)
  getVisibleSlides().forEach((el) => {
    el.style.height = `${slideH}px`
    el.style.minHeight = `${slideH}px`
    el.style.alignSelf = 'center'
  })
}

const syncTransform = () => {
  if (!cardViewport || !cardTrack) {
    return
  }
  const slides = getVisibleSlides()
  const slide = slides[currentIndex]
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
  const max = sectionIds.length - 1
  const next = Math.min(Math.max(0, index), max)
  currentIndex = next
  syncTransform()
  const id = sectionIds[currentIndex]
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
  if (sectionIds.includes(raw)) {
    return raw
  }
  return sectionIds[0] || 'home'
}

if (cardViewport && cardTrack) {
  currentIndex = getIndexForId(getInitialSectionId())
  applyNavActive(sectionIds[currentIndex])
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
      if (btn.classList.contains('hidden')) {
        return
      }
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
