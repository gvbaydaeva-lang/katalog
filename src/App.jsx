import { useMemo, useState } from 'react'
import './App.css'

const CATEGORIES = ['Все', 'Платья', 'Верхняя одежда', 'Блузы', 'Брюки', 'Обувь']

const PRODUCTS = [
  {
    id: 1,
    name: 'Шёлковое платье миди',
    brand: 'Lumière',
    price: 8900,
    category: 'Платья',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    badge: 'Новинка',
  },
  {
    id: 2,
    name: 'Кашемировое пальто',
    brand: 'Nord Line',
    price: 24500,
    category: 'Верхняя одежда',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce267634?w=600&h=800&fit=crop',
    badge: null,
  },
  {
    id: 3,
    name: 'Блуза из льна',
    brand: 'Studio Form',
    price: 4200,
    category: 'Блузы',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
    badge: '-15%',
  },
  {
    id: 4,
    name: 'Широкие брюки',
    brand: 'Atelier 12',
    price: 5600,
    category: 'Брюки',
    image: 'https://images.unsplash.com/photo-1594633312681-425a7b956cc1?w=600&h=800&fit=crop',
    badge: null,
  },
  {
    id: 5,
    name: 'Кожаные лоферы',
    brand: 'Step & Co',
    price: 9800,
    category: 'Обувь',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
    badge: 'Хит',
  },
  {
    id: 6,
    name: 'Платье с запахом',
    brand: 'Lumière',
    price: 7200,
    category: 'Платья',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
    badge: null,
  },
  {
    id: 7,
    name: 'Тренч классический',
    brand: 'Nord Line',
    price: 18900,
    category: 'Верхняя одежда',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    badge: 'Новинка',
  },
  {
    id: 8,
    name: 'Кроссовки минимал',
    brand: 'Step & Co',
    price: 8400,
    category: 'Обувь',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
    badge: null,
  },
]

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Все')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((item) => {
      const matchesCategory = category === 'Все' || item.category === category
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="logo">Mode</div>
          <p className="tagline">Женская одежда · маркетплейс</p>
          <div className="search">
            <span className="search__icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Поиск по каталогу..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h1>Каталог брендов в одном месте</h1>
          <p>Выбирайте одежду от разных продавцов — без переписки в директе</p>
        </section>

        <nav className="categories" aria-label="Категории">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'categories__btn is-active' : 'categories__btn'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <p className="results">
          {filtered.length} {filtered.length === 1 ? 'товар' : filtered.length < 5 ? 'товара' : 'товаров'}
        </p>

        <section className="grid">
          {filtered.map((product) => (
            <article key={product.id} className="card">
              <div className="card__image-wrap">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.badge && <span className="card__badge">{product.badge}</span>}
              </div>
              <div className="card__body">
                <p className="card__brand">{product.brand}</p>
                <h2 className="card__title">{product.name}</h2>
                <div className="card__footer">
                  <span className="card__price">{formatPrice(product.price)}</span>
                  <button type="button" className="card__btn">В корзину</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <p className="empty">Ничего не найдено. Попробуйте другой запрос или категорию.</p>
        )}
      </main>

      <footer className="footer">
        <p>Mode — прототип каталога · {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
