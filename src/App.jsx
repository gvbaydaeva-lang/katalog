import { useEffect, useMemo, useState } from 'react'
import './App.css'

const MAX_MESSENGER = 'https://max.ru/'

const BANNERS = [
  {
    id: 1,
    tag: 'Новинки',
    title: 'Весенняя коллекция 2026',
    text: 'Платья и блузы из натуральных тканей — уже в каталоге',
    tone: 'sand',
  },
  {
    id: 2,
    tag: 'Акция',
    title: 'Скидки до −30%',
    text: 'На верхнюю одежду и обувь до конца месяца',
    tone: 'sage',
  },
  {
    id: 3,
    tag: 'Хиты',
    title: 'Бестселлеры сезона',
    text: 'Самые популярные модели — брюки, платья, тренчи',
    tone: 'clay',
  },
]

const CATEGORY_TREE = [
  {
    name: 'Платья',
    subs: ['Летние', 'Мини', 'Вечерние', 'Миди'],
  },
  {
    name: 'Брюки',
    subs: ['Классические', 'Палаццо', 'Широкие', 'Кюлоты'],
  },
  {
    name: 'Блузы',
    subs: ['Льняные', 'Шёлковые', 'Офисные'],
  },
  {
    name: 'Верхняя одежда',
    subs: ['Пальто', 'Тренчи', 'Куртки'],
  },
  {
    name: 'Обувь',
    subs: ['Кроссовки', 'Лоферы', 'Сапоги'],
  },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '38', '39', '40', '41', '42']
const COLORS = [
  { name: 'Чёрный', hex: '#1a1a1a' },
  { name: 'Белый', hex: '#ffffff' },
  { name: 'Бежевый', hex: '#d4c4b0' },
  { name: 'Розовый', hex: '#e8a0bf' },
  { name: 'Синий', hex: '#3d5a80' },
  { name: 'Зелёный', hex: '#6b9080' },
]

const COLOR_MAP = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]))

const PRODUCTS = [
  {
    id: 1,
    name: 'Шёлковое платье миди с запахом',
    brand: 'Lumière',
    price: 8900,
    oldPrice: 11900,
    category: 'Платья',
    subcategory: 'Миди',
    sizes: ['S', 'M', 'L'],
    colors: ['Чёрный', 'Бежевый'],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    badge: 'Новинка',
    description: 'Лёгкое платье из натурального шёлка с запахом и подкладкой. Идеально для офиса и вечера.',
  },
  {
    id: 2,
    name: 'Летнее платье на бретелях',
    brand: 'Solea',
    price: 3200,
    oldPrice: null,
    category: 'Платья',
    subcategory: 'Летние',
    sizes: ['XS', 'S', 'M'],
    colors: ['Белый', 'Розовый'],
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
    badge: '-20%',
    description: 'Воздушное хлопковое платье с открытыми плечами. Комфорт в жаркую погоду.',
  },
  {
    id: 3,
    name: 'Мини-платье вечернее с блёстками',
    brand: 'Night Line',
    price: 5400,
    oldPrice: 7200,
    category: 'Платья',
    subcategory: 'Мини',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Чёрный'],
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
    badge: null,
    description: 'Элегантное мини-платье с деликатным блеском для особых случаев.',
  },
  {
    id: 4,
    name: 'Классические брюки со стрелками',
    brand: 'Atelier 12',
    price: 5600,
    oldPrice: null,
    category: 'Брюки',
    subcategory: 'Классические',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Чёрный', 'Бежевый', 'Синий'],
    image: 'https://images.unsplash.com/photo-1594633312681-425a7b956cc1?w=600&h=800&fit=crop',
    badge: null,
    description: 'Брюки прямого кроя со стрелками из смесовой шерсти. База гардероба.',
  },
  {
    id: 5,
    name: 'Брюки палаццо из тенсела',
    brand: 'Studio Form',
    price: 4800,
    oldPrice: 6100,
    category: 'Брюки',
    subcategory: 'Палаццо',
    sizes: ['S', 'M', 'L'],
    colors: ['Бежевый', 'Белый'],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
    badge: 'Хит',
    description: 'Широкие брюки палаццо с высокой посадкой. Мягкая дrape и комфорт.',
  },
  {
    id: 6,
    name: 'Кашемировое пальто двубортное',
    brand: 'Nord Line',
    price: 24500,
    oldPrice: 32000,
    category: 'Верхняя одежда',
    subcategory: 'Пальто',
    sizes: ['S', 'M', 'L'],
    colors: ['Бежевый', 'Чёрный'],
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce267634?w=600&h=800&fit=crop',
    badge: null,
    description: 'Тёплое двубортное пальто из кашемира. Классический силуэт на несколько сезонов.',
  },
  {
    id: 7,
    name: 'Блуза из льна с воротником',
    brand: 'Studio Form',
    price: 4200,
    oldPrice: 5200,
    category: 'Блузы',
    subcategory: 'Льняные',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Белый', 'Бежевый', 'Зелёный'],
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
    badge: '-15%',
    description: 'Льняная блуза с отложным воротником. Натуральная фактура, свободный крой.',
  },
  {
    id: 8,
    name: 'Кожаные лоферы на низком каблуке',
    brand: 'Step & Co',
    price: 9800,
    oldPrice: null,
    category: 'Обувь',
    subcategory: 'Лоферы',
    sizes: ['38', '39', '40', '41'],
    colors: ['Чёрный', 'Бежевый'],
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
    badge: 'Хит',
    description: 'Лоферы из натуральной кожи на низком каблуке. Универсальная повседневная модель.',
  },
  {
    id: 9,
    name: 'Тренч классический oversize',
    brand: 'Nord Line',
    price: 18900,
    oldPrice: 24000,
    category: 'Верхняя одежда',
    subcategory: 'Тренчи',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Бежевый'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    badge: 'Новинка',
    description: 'Тренч свободного кроя из плотного хлопка с поясом. Вне времени.',
  },
  {
    id: 10,
    name: 'Кроссовки минимал белые',
    brand: 'Step & Co',
    price: 8400,
    oldPrice: 9900,
    category: 'Обувь',
    subcategory: 'Кроссовки',
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Белый', 'Чёрный'],
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
    badge: null,
    description: 'Минималистичные кроссовки на лёгкой подошве. Для города и прогулок.',
  },
]

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

function messengerLink(product) {
  const text = encodeURIComponent(`Здравствуйте! Вопрос по товару: ${product.name} (${product.brand})`)
  return `${MAX_MESSENGER}?text=${text}`
}

function BannerCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  function goTo(i) {
    setIndex((i + BANNERS.length) % BANNERS.length)
  }

  return (
    <section className="banner" aria-label="Акции и новинки">
      <div className="banner__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {BANNERS.map((slide) => (
          <article key={slide.id} className={`banner__slide banner__slide--${slide.tone}`}>
            <span className="banner__tag">{slide.tag}</span>
            <h2 className="banner__title">{slide.title}</h2>
            <p className="banner__text">{slide.text}</p>
            <button type="button" className="banner__cta">Заказать</button>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="banner__nav banner__nav--prev"
        aria-label="Предыдущий баннер"
        onClick={() => goTo(index - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="banner__nav banner__nav--next"
        aria-label="Следующий баннер"
        onClick={() => goTo(index + 1)}
      >
        ›
      </button>
      <div className="banner__dots">
        {BANNERS.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={i === index ? 'is-active' : ''}
            aria-label={`Баннер ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product, onOpen }) {
  return (
    <article
      className="card"
      onClick={() => onOpen(product)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(product)}
      role="button"
      tabIndex={0}
    >
      <div className="card__image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="card__badge">{product.badge}</span>}
      </div>
      <div className="card__body">
        <div className="card__price-row">
          <span className="card__price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="card__old-price">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <p className="card__brand">{product.brand}</p>
        <h2 className="card__title">{product.name}</h2>
      </div>
    </article>
  )
}

function ProductModal({ product, onClose }) {
  const [size, setSize] = useState(product.sizes[0] ?? null)
  const [color, setColor] = useState(product.colors[0] ?? null)

  useEffect(() => {
    setSize(product.sizes[0] ?? null)
    setColor(product.colors[0] ?? null)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [product])

  return (
    <div className="product-modal" role="dialog" aria-modal="true" aria-label={product.name}>
      <button type="button" className="product-modal__backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="product-modal__sheet">
        <button type="button" className="product-modal__close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        <div className="product-modal__image">
          <img src={product.image} alt={product.name} />
          {product.badge && <span className="card__badge">{product.badge}</span>}
        </div>

        <div className="product-modal__info">
          <p className="product-modal__brand">{product.brand}</p>
          <h2 className="product-modal__name">{product.name}</h2>
          <div className="card__price-row">
            <span className="card__price card__price--lg">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="card__old-price">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <p className="product-modal__desc">{product.description}</p>

          <div className="product-modal__section">
            <p className="product-modal__label">Размер</p>
            <div className="picker picker--sizes">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={size === item ? 'is-active' : ''}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="product-modal__section">
            <p className="product-modal__label">Цвет</p>
            <div className="picker picker--colors">
              {product.colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={color === item ? 'is-active' : ''}
                  onClick={() => setColor(item)}
                >
                  <span
                    className="picker__dot"
                    style={{
                      background: COLOR_MAP[item] ?? '#ccc',
                      border: item === 'Белый' ? '1px solid #ddd' : 'none',
                    }}
                  />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="product-modal__actions">
            <button type="button" className="card__btn card__btn--cart">В корзину</button>
            <button type="button" className="card__btn card__btn--order">Заказать</button>
            <a
              href={messengerLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="card__btn card__btn--ask"
            >
              Задать вопрос
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedFilter, setExpandedFilter] = useState({ sizes: true, colors: false })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [activeProduct, setActiveProduct] = useState(null)

  const isHome = !selectedCategory && !selectedSubcategory && !query.trim()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q)

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory

      const matchesSubcategory =
        !selectedSubcategory || item.subcategory === selectedSubcategory

      const matchesSizes =
        selectedSizes.length === 0 ||
        selectedSizes.some((s) => item.sizes.includes(s))

      const matchesColors =
        selectedColors.length === 0 ||
        selectedColors.some((c) => item.colors.includes(c))

      return (
        matchesQuery &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSizes &&
        matchesColors
      )
    })
  }, [query, selectedCategory, selectedSubcategory, selectedSizes, selectedColors])

  function toggleSize(size) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  function toggleFilterSection(key) {
    setExpandedFilter((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleColor(color) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    )
  }

  function selectSubcategory(category, sub) {
    setSelectedCategory(category)
    setSelectedSubcategory(sub)
    setMenuOpen(false)
  }

  function resetFilters() {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setSelectedSizes([])
    setSelectedColors([])
  }

  const activeLabel = selectedSubcategory
    ? `${selectedCategory} · ${selectedSubcategory}`
    : selectedCategory || 'Все товары'

  return (
    <div className="app">
      <header className="header">
        <button
          type="button"
          className="header__burger"
          aria-label="Каталог"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
        <div className="header__logo">Mode</div>
        <div className="header__search">
          <span className="header__search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Искать на Mode"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="button" className="header__cart" aria-label="Корзина">
          🛒
        </button>
      </header>

      <div className="layout">
        <aside className={`sidebar sidebar--catalog ${menuOpen ? 'is-open' : ''}`}>
          <div className="sidebar__head">
            <h2>Каталог</h2>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Закрыть">✕</button>
          </div>
          <nav className="catalog-tree">
            <button
              type="button"
              className={`catalog-tree__all ${!selectedCategory ? 'is-active' : ''}`}
              onClick={() => {
                resetFilters()
                setMenuOpen(false)
              }}
            >
              Все товары
            </button>
            {CATEGORY_TREE.map((cat) => (
              <div key={cat.name} className="catalog-tree__group">
                <button
                  type="button"
                  className={`catalog-tree__cat ${expandedCategory === cat.name ? 'is-open' : ''} ${selectedCategory === cat.name && !selectedSubcategory ? 'is-active' : ''}`}
                  onClick={() => {
                    setExpandedCategory((prev) => (prev === cat.name ? null : cat.name))
                    setSelectedCategory(cat.name)
                    setSelectedSubcategory(null)
                  }}
                >
                  <span>{cat.name}</span>
                  <span className="catalog-tree__arrow">›</span>
                </button>
                {expandedCategory === cat.name && (
                  <ul className="catalog-tree__subs">
                    {cat.subs.map((sub) => (
                      <li key={sub}>
                        <button
                          type="button"
                          className={selectedSubcategory === sub ? 'is-active' : ''}
                          onClick={() => selectSubcategory(cat.name, sub)}
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {menuOpen && (
          <button
            type="button"
            className="overlay"
            aria-label="Закрыть меню"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <aside className={`sidebar sidebar--filters ${filtersOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filters-toggle"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <span>Фильтры</span>
            <span className="filters-toggle__arrow">{filtersOpen ? '‹' : '›'}</span>
          </button>

          {filtersOpen && (
            <div className="filters-body">
              <div className="filter-group">
                <button
                  type="button"
                  className={`filter-group__head ${expandedFilter.sizes ? 'is-open' : ''}`}
                  onClick={() => toggleFilterSection('sizes')}
                >
                  Размер
                  <span>›</span>
                </button>
                {expandedFilter.sizes && (
                  <div className="filter-group__body filter-chips">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={selectedSizes.includes(size) ? 'is-active' : ''}
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-group">
                <button
                  type="button"
                  className={`filter-group__head ${expandedFilter.colors ? 'is-open' : ''}`}
                  onClick={() => toggleFilterSection('colors')}
                >
                  Цвет
                  <span>›</span>
                </button>
                {expandedFilter.colors && (
                  <div className="filter-group__body filter-colors">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        className={selectedColors.includes(color.name) ? 'is-active' : ''}
                        onClick={() => toggleColor(color.name)}
                        title={color.name}
                      >
                        <span
                          className="filter-colors__dot"
                          style={{
                            background: color.hex,
                            border: color.name === 'Белый' ? '1px solid #ddd' : 'none',
                          }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedCategory) && (
                <button type="button" className="filters-reset" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </aside>

        <main className="content">
          {isHome && <BannerCarousel />}

          <div className="content__top">
            <h1 className="content__title">{activeLabel}</h1>
            <span className="content__count">{filtered.length} товаров</span>
          </div>

          {filtered.length > 0 ? (
            <section className="grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setActiveProduct}
                />
              ))}
            </section>
          ) : (
            <p className="empty">Ничего не найдено. Измените фильтры или запрос.</p>
          )}
        </main>
      </div>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </div>
  )
}
