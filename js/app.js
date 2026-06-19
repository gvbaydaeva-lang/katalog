const COLOR_HEX = {
  'Чёрный': '#1a1a1a',
  'Белый': '#ffffff',
  'Бежевый': '#d4c4b0',
  'Розовый': '#e8a0bf',
  'Синий': '#3d5a80',
  'Зелёный': '#6b9080',
}

const state = {
  menuOpen: false,
  filtersOpen: false,
  bannerIndex: 0,
  category: null,
  subcategory: null,
  sizes: [],
  colors: [],
  query: '',
}

const els = {}

document.addEventListener('DOMContentLoaded', init)

function init() {
  els.menu = document.getElementById('catalog-menu')
  els.overlay = document.getElementById('overlay')
  els.filters = document.getElementById('filters-panel')
  els.search = document.getElementById('search-input')
  els.banner = document.getElementById('banner')
  els.bannerTrack = document.getElementById('banner-track')
  els.contentTitle = document.getElementById('content-title')
  els.contentCount = document.getElementById('content-count')
  els.grid = document.getElementById('products-grid')
  els.empty = document.getElementById('empty-msg')
  els.modal = document.getElementById('product-modal')
  els.filtersReset = document.getElementById('filters-reset')
  els.maxUrl = document.body.dataset.maxUrl || 'https://max.ru/'

  document.getElementById('burger-btn').addEventListener('click', toggleMenu)
  document.getElementById('catalog-close').addEventListener('click', closeMenu)
  els.overlay.addEventListener('click', closeMenu)
  document.getElementById('filters-toggle').addEventListener('click', () => {
    state.filtersOpen = !state.filtersOpen
    els.filters.classList.toggle('is-open', state.filtersOpen)
  })

  els.search.addEventListener('input', () => {
    state.query = els.search.value.trim().toLowerCase()
    applyFilters()
  })

  document.getElementById('catalog-all').addEventListener('click', () => {
    resetFilters()
    closeMenu()
  })

  document.querySelectorAll('.catalog-tree__cat').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.catalog-tree__group')
      const subs = group.querySelector('.catalog-tree__subs')
      const cat = btn.dataset.category
      const isOpen = subs.classList.contains('is-open')

      document.querySelectorAll('.catalog-tree__subs').forEach((ul) => ul.classList.remove('is-open'))
      document.querySelectorAll('.catalog-tree__cat').forEach((b) => b.classList.remove('is-open', 'is-active'))

      if (!isOpen) {
        subs.classList.add('is-open')
        btn.classList.add('is-open', 'is-active')
      }

      state.category = cat
      state.subcategory = null
      setCatalogActive(btn)
      applyFilters()
    })
  })

  document.querySelectorAll('.catalog-tree__subs button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.category
      state.subcategory = btn.dataset.subcategory
      document.querySelectorAll('.catalog-tree__subs button').forEach((b) => b.classList.remove('is-active'))
      btn.classList.add('is-active')
      applyFilters()
      closeMenu()
    })
  })

  document.querySelectorAll('.filter-group__head').forEach((head) => {
    head.addEventListener('click', () => {
      const body = head.nextElementSibling
      head.classList.toggle('is-open')
      body.classList.toggle('is-open')
    })
  })

  document.querySelectorAll('[data-filter-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.filterSize
      if (state.sizes.includes(size)) {
        state.sizes = state.sizes.filter((s) => s !== size)
        btn.classList.remove('is-active')
      } else {
        state.sizes.push(size)
        btn.classList.add('is-active')
      }
      applyFilters()
    })
  })

  document.querySelectorAll('[data-filter-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.filterColor
      if (state.colors.includes(color)) {
        state.colors = state.colors.filter((c) => c !== color)
        btn.classList.remove('is-active')
      } else {
        state.colors.push(color)
        btn.classList.add('is-active')
      }
      applyFilters()
    })
  })

  els.filtersReset.addEventListener('click', resetFilters)

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => openModal(card))
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openModal(card)
    })
  })

  document.getElementById('banner-prev').addEventListener('click', () => goBanner(-1))
  document.getElementById('banner-next').addEventListener('click', () => goBanner(1))
  document.querySelectorAll('.banner__dots button').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      state.bannerIndex = i
      updateBanner()
    })
  })

  document.getElementById('modal-close').addEventListener('click', closeModal)
  document.getElementById('modal-backdrop').addEventListener('click', closeModal)

  setInterval(() => goBanner(1), 5000)
  applyFilters()
  updateBanner()
}

function toggleMenu() {
  state.menuOpen = !state.menuOpen
  els.menu.classList.toggle('is-open', state.menuOpen)
  els.overlay.hidden = !state.menuOpen
}

function closeMenu() {
  state.menuOpen = false
  els.menu.classList.remove('is-open')
  els.overlay.hidden = true
}

function setCatalogActive(activeBtn) {
  document.getElementById('catalog-all').classList.remove('is-active')
  document.querySelectorAll('.catalog-tree__cat').forEach((b) => {
    if (b !== activeBtn) b.classList.remove('is-active')
  })
}

function resetFilters() {
  state.category = null
  state.subcategory = null
  state.sizes = []
  state.colors = []
  document.getElementById('catalog-all').classList.add('is-active')
  document.querySelectorAll('.catalog-tree__cat, .catalog-tree__subs button').forEach((b) => {
    b.classList.remove('is-active', 'is-open')
  })
  document.querySelectorAll('.catalog-tree__subs').forEach((ul) => ul.classList.remove('is-open'))
  document.querySelectorAll('[data-filter-size], [data-filter-color]').forEach((b) => b.classList.remove('is-active'))
  applyFilters()
}

function cardMatches(card) {
  const q = state.query
  const text = card.textContent.toLowerCase()
  const category = card.dataset.category
  const sub = card.dataset.subcategory
  const sizes = (card.dataset.sizes || '').split(',')
  const colors = (card.dataset.colors || '').split(',')

  if (q && !text.includes(q)) return false
  if (state.category && category !== state.category) return false
  if (state.subcategory && sub !== state.subcategory) return false
  if (state.sizes.length && !state.sizes.some((s) => sizes.includes(s))) return false
  if (state.colors.length && !state.colors.some((c) => colors.includes(c))) return false
  return true
}

function applyFilters() {
  let visible = 0
  document.querySelectorAll('.card').forEach((card) => {
    const show = cardMatches(card)
    card.classList.toggle('is-hidden', !show)
    if (show) visible++
  })

  const isHome = !state.category && !state.subcategory && !state.query
  els.banner.classList.toggle('is-hidden', !isHome)

  els.contentTitle.textContent = state.subcategory
    ? `${state.category} · ${state.subcategory}`
    : state.category || 'Все товары'

  els.contentCount.textContent = `${visible} товаров`
  els.empty.classList.toggle('is-hidden', visible > 0)
  els.filtersReset.hidden = !(state.sizes.length || state.colors.length || state.category)
}

function goBanner(delta) {
  const total = document.querySelectorAll('.banner__slide').length
  state.bannerIndex = (state.bannerIndex + delta + total) % total
  updateBanner()
}

function updateBanner() {
  els.bannerTrack.style.transform = `translateX(-${state.bannerIndex * 100}%)`
  document.querySelectorAll('.banner__dots button').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === state.bannerIndex)
  })
}

function openModal(card) {
  const name = card.querySelector('.card__title').textContent
  const brand = card.querySelector('.card__brand').textContent
  const price = card.querySelector('.card__price').textContent
  const oldPriceEl = card.querySelector('.card__old-price')
  const badgeEl = card.querySelector('.card__badge')
  const img = card.querySelector('img').src
  const desc = card.dataset.description || ''
  const sizes = (card.dataset.sizes || '').split(',').filter(Boolean)
  const colors = (card.dataset.colors || '').split(',').filter(Boolean)

  document.getElementById('modal-image').src = img
  document.getElementById('modal-image').alt = name
  document.getElementById('modal-brand').textContent = brand
  document.getElementById('modal-name').textContent = name
  document.getElementById('modal-price').textContent = price
  document.getElementById('modal-old-price').textContent = oldPriceEl ? oldPriceEl.textContent : ''
  document.getElementById('modal-old-price').hidden = !oldPriceEl
  document.getElementById('modal-desc').textContent = desc

  const modalBadge = document.getElementById('modal-badge')
  if (badgeEl) {
    modalBadge.textContent = badgeEl.textContent
    modalBadge.hidden = false
  } else {
    modalBadge.hidden = true
  }

  const sizesWrap = document.getElementById('modal-sizes')
  sizesWrap.innerHTML = ''
  sizes.forEach((size, i) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = size
    if (i === 0) btn.classList.add('is-active')
    btn.addEventListener('click', () => {
      sizesWrap.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'))
      btn.classList.add('is-active')
    })
    sizesWrap.appendChild(btn)
  })

  const colorsWrap = document.getElementById('modal-colors')
  colorsWrap.innerHTML = ''
  colors.forEach((color, i) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    if (i === 0) btn.classList.add('is-active')
    const dot = document.createElement('span')
    dot.className = 'picker__dot'
    dot.style.background = COLOR_HEX[color] || '#ccc'
    if (color === 'Белый') dot.style.border = '1px solid #ddd'
    btn.appendChild(dot)
    btn.appendChild(document.createTextNode(color))
    btn.addEventListener('click', () => {
      colorsWrap.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'))
      btn.classList.add('is-active')
    })
    colorsWrap.appendChild(btn)
  })

  const askLink = document.getElementById('modal-ask')
  const text = encodeURIComponent(`Здравствуйте! Вопрос по товару: ${name} (${brand})`)
  askLink.href = `${els.maxUrl}?text=${text}`

  els.modal.classList.add('is-open')
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  els.modal.classList.remove('is-open')
  document.body.style.overflow = ''
}
