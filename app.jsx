const { useState, useEffect, useMemo, useCallback } = React;

const translations = {
  ar: {
    title: 'منتجات السعودية', products: 'منتج', merchants: 'متجر', fromMerchants: 'من', categoryLine: 1,
    search: 'ابحث عن منتج أو متجر...', category: 'الفئة', colors: 'الألوان', sizes: 'المقاسات',
    price: 'السعر', viewProduct: 'عرض المنتج', productCount: 'منتجات', browse: 'تصفح المنتجات',
    viewAll: 'عرض الكل', allMerchants: 'جميع المتاجر', default: 'الافتراضي', priceAsc: 'السعر ↑',
    commissionHigh: 'أعلى عمولة', allCommission: 'كل العمولات', highCommission: 'عمولة عالية ≥15%',
    mediumCommission: 'عمولة متوسطة 10-15%', lowCommission: 'عمولة منخفضة <10%',
    home: 'الرئيسية', allProducts: 'كل المنتجات', featured: 'عمولة عالية',
    loading: 'جار تحميل المنتجات...', retry: 'إعادة المحاولة', loadError: 'تعذر تحميل المنتجات. تحقق من assets/products.csv.',
    emptyData: 'لا توجد منتجات. أضف بيانات إلى assets/products.csv.', noResults: 'لم يتم العثور على منتجات',
    tryAgain: 'جرّب بحثاً أو تصفية أخرى', loadMore: 'عرض المزيد', commission: 'العمولة',
    commissionRate: 'نسبة عمولة المنشئ', seller: 'المتجر', frenchWarning: 'لا يزال ملف CSV يحتوي على منتجات فرنسية وأسعار باليورو.'
  },
  en: {
    title: 'Saudi Products', products: 'products', merchants: 'stores', fromMerchants: 'From', categoryLine: 1,
    search: 'Search products or stores...', category: 'Category', colors: 'Colors', sizes: 'Sizes',
    price: 'Price', viewProduct: 'View product', productCount: 'products', browse: 'Browse products',
    viewAll: 'View all', allMerchants: 'All stores', default: 'Default', priceAsc: 'Price ↑',
    commissionHigh: 'Top commission', allCommission: 'All commissions', highCommission: 'High ≥15%',
    mediumCommission: 'Medium 10-15%', lowCommission: 'Low <10%',
    home: 'Home', allProducts: 'All products', featured: 'High commission',
    loading: 'Loading products...', retry: 'Retry', loadError: 'Could not load products. Check assets/products.csv.',
    emptyData: 'No products yet. Add data to assets/products.csv.', noResults: 'No products found',
    tryAgain: 'Try another search or filter', loadMore: 'Show more', commission: 'Commission',
    commissionRate: 'Creator commission rate', seller: 'Store', frenchWarning: 'CSV still contains French products and euro prices.'
  },
  zh: {
    title: '沙特选品', products: '款商品', merchants: '个商家', fromMerchants: '来自', categoryLine: 0,
    search: '搜索商品或店铺...', category: '类目', colors: '颜色', sizes: '尺码',
    price: '售价', viewProduct: '查看商品', productCount: '款商品', browse: '进入选品',
    viewAll: '查看全部', allMerchants: '全部商家', default: '默认', priceAsc: '价格↑',
    commissionHigh: '佣金最高', allCommission: '全部佣金', highCommission: '高佣 ≥15%',
    mediumCommission: '中佣 10-15%', lowCommission: '低佣 ＜10%',
    home: '首页', allProducts: '全部商品', featured: '高佣精选',
    loading: '正在加载商品...', retry: '重试', loadError: '商品数据加载失败，请检查 assets/products.csv。',
    emptyData: '暂无商品数据，请在 assets/products.csv 添加商品。', noResults: '没有找到相关商品',
    tryAgain: '试试其他关键词或筛选条件', loadMore: '加载更多', commission: '佣金',
    commissionRate: '创作者佣金率', seller: '所属商家', frenchWarning: '当前 CSV 仍包含法国商品与欧元价格，尚未替换为沙特商品数据。'
  }
};

// ========== Utility Functions ==========
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Handle ranges like "19 €-26 €" -> take the lower price
  const cleaned = priceStr.replace(/\s/g, '').replace(',', '.');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function parseCommission(commStr) {
  if (!commStr) return 0;
  const match = commStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function useProductImage(product) {
  const [imageIndex, setImageIndex] = useState(0);
  const sources = [];
  if (product?.image_url?.trim().startsWith('https://')) {
    sources.push(product.image_url.trim());
  }
  if (product?.image_token?.trim()) {
    sources.push(`assets/images/${product.image_token.trim()}.jpg`);
  }
  const imgSrc = sources[imageIndex];
  return {
    imgSrc,
    imgError: !imgSrc,
    handleImageError: () => setImageIndex(index => index + 1)
  };
}

// ========== Icons ==========
const IconSearch = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconHome = ({ active }) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconGrid = ({ active }) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconStore = ({ active }) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <line x1="9" y1="22" x2="9" y2="12"></line>
    <line x1="15" y1="22" x2="15" y2="12"></line>
  </svg>
);

const IconCommission = ({ active }) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconExternal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// ========== Product Card ==========
function ProductCard({ product, onClick, index, t }) {
  const { imgSrc, imgError, handleImageError } = useProductImage(product);
  const style = { animationDelay: `${Math.min(index * 0.03, 0.6)}s` };

  return (
    <div className="product-card" onClick={onClick} style={style}>
      <div className={`product-image-wrap ${imgError ? 'img-error' : ''}`}>
        {!imgError && (
          <img
            className="product-image"
            src={imgSrc}
            alt={product.product_name}
            loading="lazy"
            onError={handleImageError}
          />
        )}
        {product.commission?.trim() && <div className="commission-badge">{product.commission}</div>}
      </div>
      <div className="product-info">
        <div className="product-name" dir="auto">{product.product_name}</div>
        <div className="product-shop">{product.shop}</div>
        <ProductAttributes product={product} compact t={t} />
        <div className="product-bottom">
          <div className="product-price">{product.price}</div>
          <div className="go-btn">
            <IconArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductAttributes({ product, compact = false, t }) {
  const categories = [product.category_level_1, product.category_level_2, product.category_level_3]
    .filter(value => value?.trim())
    .map(value => value.split('\n')[t.categoryLine] || value.split('\n')[0]);
  if (!categories.length && !product.colors?.trim() && !product.sizes?.trim()) return null;

  return (
    <div className={compact ? 'product-attributes compact' : 'product-attributes'}>
      {categories.length > 0 && (
        <div className="attribute-row">
          <span className="attribute-label">{t.category}</span>
          <span className="attribute-value" dir="auto">{compact ? categories[categories.length - 1] : categories.join(' / ')}</span>
        </div>
      )}
      {product.colors?.trim() && (
        <div className="attribute-row">
          <span className="attribute-label">{t.colors}</span>
          <span className="attribute-value" dir="auto">{product.colors}</span>
        </div>
      )}
      {product.sizes?.trim() && (
        <div className="attribute-row">
          <span className="attribute-label">{t.sizes}</span>
          <span className="attribute-value" dir="auto">{product.sizes}</span>
        </div>
      )}
    </div>
  );
}

// ========== Mini Product Card ==========
function MiniProductCard({ product, onClick, index, t }) {
  const { imgSrc, imgError, handleImageError } = useProductImage(product);
  const style = { animationDelay: `${Math.min(index * 0.03, 0.6)}s` };

  return (
    <div className="mini-card" onClick={onClick} style={style}>
      <div style={{
        width: '130px',
        height: '130px',
        background: imgError ? 'linear-gradient(135deg, #F5F0EB 0%, #EDE8E2 100%)' : 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!imgError && (
          <img
            className="mini-card-image"
            src={imgSrc}
            alt={product.product_name}
            loading="lazy"
            onError={handleImageError}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
        {imgError && (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF4D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        )}
      </div>
      <div className="mini-card-info">
        <div className="mini-card-name" dir="auto">{product.product_name}</div>
        <ProductAttributes product={product} compact t={t} />
        <div className="mini-card-bottom">
          <div className="mini-card-price">{product.price}</div>
          {product.commission?.trim() && <div className="mini-commission">{product.commission}</div>}
        </div>
      </div>
    </div>
  );
}

// ========== Product Detail Modal ==========
function ProductModal({ product, onClose, t }) {
  const { imgSrc, imgError, handleImageError } = useProductImage(product);
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-image-wrap" style={{
          background: imgError ? 'linear-gradient(135deg, #F5F0EB 0%, #EDE8E2 100%)' : 'var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!imgError ? (
            <img className="modal-image" src={imgSrc} alt={product.product_name} onError={handleImageError} />
          ) : (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF4D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          )}
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
          {product.commission?.trim() && <div className="modal-commission">{t.commission} {product.commission}</div>}
        </div>
        <div className="modal-body">
          <div className="modal-shop">{product.shop}</div>
          <div className="modal-name" dir="auto">{product.product_name}</div>
          <div className="modal-price-row">
            <div className="modal-price">{product.price}</div>
            <div className="modal-price-note">{t.price}</div>
          </div>
          <ProductAttributes product={product} t={t} />
          {product.commission?.trim() && (
            <div className="modal-stats">
              <div className="stat-item">
                <div className="stat-label">{t.commissionRate}</div>
                <div className="stat-value commission-stat">{product.commission}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t.seller}</div>
                <div className="stat-value" style={{ fontSize: '13px' }}>{product.shop}</div>
              </div>
            </div>
          )}
          <a
            className="modal-cta"
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconExternal />
            {t.viewProduct}
          </a>
        </div>
      </div>
    </div>
  );
}

// ========== Merchant Card ==========
function MerchantCard({ merchant, onClick, index, t }) {
  const firstProduct = merchant.products[0];
  const { imgSrc, imgError, handleImageError } = useProductImage(firstProduct);
  const style = { animationDelay: `${Math.min(index * 0.03, 0.6)}s` };

  return (
    <div className="product-card" onClick={onClick} style={style}>
      <div className={`product-image-wrap ${imgError ? 'img-error' : ''}`}>
        {firstProduct && !imgError && (
          <img
            className="product-image"
            src={imgSrc}
            alt={merchant.name}
            loading="lazy"
            onError={handleImageError}
          />
        )}
        <div className="commission-badge">{merchant.count} {t.productCount}</div>
      </div>
      <div className="product-info">
        <div className="product-name" style={{ fontWeight: '600' }}>
          {merchant.name}
        </div>
        <div className="product-shop">
          {firstProduct && firstProduct.shop}
        </div>
        <div className="product-bottom">
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {t.browse}
          </div>
          <div className="go-btn">
            <IconArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Main App ==========
function App() {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('site-language');
    return translations[saved] ? saved : 'ar';
  });
  const t = translations[locale];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'merchants' | 'products'
  const [viewMode, setViewMode] = useState('explore'); // 'explore' | 'allProducts' | 'merchantDetail'
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'commission-desc'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commissionFilter, setCommissionFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [visibleProducts, setVisibleProducts] = useState(48);
  const [visibleMerchants, setVisibleMerchants] = useState(24);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title = `SA | ${t.title}`;
    localStorage.setItem('site-language', locale);
  }, [locale]);

  useEffect(() => { setVisibleProducts(48); }, [viewMode, selectedMerchant, searchQuery, sortBy, commissionFilter]);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setLoadError('');
    fetch('assets/products.csv')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(csv => setProducts(parseProductsCsv(csv)))
      .catch(error => {
        console.error('Failed to load products:', error);
        setLoadError('load');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const hasFrenchData = products.some(product => /€|\bFR\b|France|法国/i.test(
    `${product.price} ${product.shop} ${product.sheet_name}`
  ));
  const hasCommission = products.some(product => product.commission?.trim());

  // Get unique merchants
  const merchants = useMemo(() => {
    const map = {};
    products.forEach(p => {
      if (!map[p.sheet_name]) {
        map[p.sheet_name] = { name: p.sheet_name, count: 0, products: [] };
      }
      map[p.sheet_name].count++;
      map[p.sheet_name].products.push(p);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        p.shop.toLowerCase().includes(q) ||
        p.sheet_name.toLowerCase().includes(q)
      );
    }

    // Merchant filter
    if (selectedMerchant) {
      result = result.filter(p => p.sheet_name === selectedMerchant);
    }

    // Commission filter
    if (commissionFilter !== 'all') {
      result = result.filter(p => {
        if (!p.commission?.trim()) return false;
        const comm = parseCommission(p.commission);
        if (commissionFilter === 'high') return comm >= 15;
        if (commissionFilter === 'medium') return comm >= 10 && comm < 15;
        if (commissionFilter === 'low') return comm < 10;
        return true;
      });
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === 'commission-desc') {
      result.sort((a, b) => parseCommission(b.commission) - parseCommission(a.commission));
    }

    return result;
  }, [products, searchQuery, selectedMerchant, sortBy, commissionFilter]);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleMerchantClick = useCallback((merchantName) => {
    setSelectedMerchant(merchantName);
    setViewMode('merchantDetail');
    setActiveTab('products');
    window.scrollTo(0, 0);
  }, []);

  const handleBackToExplore = useCallback(() => {
    setSelectedMerchant(null);
    setViewMode('explore');
    setActiveTab('all');
    setVisibleMerchants(24);
    window.scrollTo(0, 0);
  }, []);

  const handleViewAllProducts = useCallback(() => {
    setSelectedMerchant(null);
    setCommissionFilter('all');
    setViewMode('allProducts');
    window.scrollTo(0, 0);
  }, []);

  const handleViewHighCommission = useCallback(() => {
    setSelectedMerchant(null);
    setCommissionFilter('high');
    setViewMode('allProducts');
    window.scrollTo(0, 0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          {t.loading}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app">
        <div className="header"><div className="header-title">SA {t.title}</div></div>
        <div className="empty-state" role="alert">
          <div className="empty-title">{loadError === 'load' ? t.loadError : loadError}</div>
          <button className="sort-btn" onClick={loadProducts}>{t.retry}</button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="app">
        <div className="header"><div className="header-title">SA {t.title}</div></div>
        <div className="empty-state">{t.emptyData}</div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-top">
          {viewMode === 'merchantDetail' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="back-btn" onClick={handleBackToExplore} aria-label={t.home}>
                <IconBack />
              </button>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {selectedMerchant}
              </div>
            </div>
          ) : (
            <div className="header-title">SA {t.title}</div>
          )}
          <div className="header-actions">
            <select className="language-select" aria-label="Language" value={locale} onChange={event => setLocale(event.target.value)}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <div className="header-stats">
              <strong>{filteredProducts.length}</strong> {t.products}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-box">
          <IconSearch />
          <input
            className="search-input"
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value && viewMode !== 'allProducts' && viewMode !== 'merchantDetail') {
                setViewMode('allProducts');
              }
            }}
          />
          {searchQuery && (
            <div className="search-clear" onClick={handleClearSearch}>
              <IconClose />
            </div>
          )}
        </div>
      </div>

      {hasFrenchData && (
        <div className="data-notice" role="status">
          {t.frenchWarning}
        </div>
      )}

      {/* Commission Filter Chips */}
      {hasCommission && viewMode !== 'merchantDetail' && (
        <div className="filter-chips" style={{ paddingTop: '12px' }}>
          <div
            className={`filter-chip ${commissionFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCommissionFilter('all')}
          >
            {t.allCommission}
          </div>
          <div
            className={`filter-chip ${commissionFilter === 'high' ? 'active' : ''}`}
            onClick={() => setCommissionFilter('high')}
          >
            {t.highCommission}
          </div>
          <div
            className={`filter-chip ${commissionFilter === 'medium' ? 'active' : ''}`}
            onClick={() => setCommissionFilter('medium')}
          >
            {t.mediumCommission}
          </div>
          <div
            className={`filter-chip ${commissionFilter === 'low' ? 'active' : ''}`}
            onClick={() => setCommissionFilter('low')}
          >
            {t.lowCommission}
          </div>
        </div>
      )}

      {/* Sort Bar */}
      <div className="sort-bar">
        <span className="sort-label">
          {viewMode === 'merchantDetail'
            ? `${filteredProducts.length} ${t.products}`
            : viewMode === 'allProducts'
            ? `${filteredProducts.length} ${t.products}`
            : `${t.fromMerchants} ${merchants.length} ${t.merchants}`}
        </span>
        <div className="sort-options">
          <button
            className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
            onClick={() => setSortBy('default')}
          >
            {t.default}
          </button>
          {hasCommission && (
            <button
              className={`sort-btn ${sortBy === 'commission-desc' ? 'active' : ''}`}
              onClick={() => setSortBy('commission-desc')}
            >
              {t.commissionHigh}
            </button>
          )}
          <button
            className={`sort-btn ${sortBy === 'price-asc' ? 'active' : ''}`}
            onClick={() => setSortBy('price-asc')}
          >
            {t.priceAsc}
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'explore' ? (
        <>
          {/* Featured Merchants - Horizontal Scroll */}
          <div className="merchant-list">
            {merchants.slice(0, 6).map((merchant, idx) => (
              <div className="merchant-section" key={merchant.name}>
                <div className="merchant-header">
                  <div className="merchant-name">
                    {merchant.name}
                    <span className="merchant-count">{merchant.count} {t.productCount}</span>
                  </div>
                  <button
                    className="sort-btn"
                    style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '600' }}
                    onClick={() => handleMerchantClick(merchant.name)}
                  >
                    {t.viewAll} <IconArrowRight />
                  </button>
                </div>
                <div className="merchant-scroll">
                  {merchant.products.slice(0, 6).map((product, pIdx) => (
                    <MiniProductCard
                      key={product.row}
                      product={product}
                      onClick={() => handleProductClick(product)}
                      index={idx * 6 + pIdx}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* All Merchants Grid at bottom */}
          <div className="products-section" style={{ paddingTop: '8px' }}>
            <div className="section-title">
              <span className="section-title-dot"></span>
              {t.allMerchants} ({merchants.length})
            </div>
            <div className="products-grid">
              {merchants.slice(0, visibleMerchants).map((merchant, idx) => (
                <MerchantCard
                  key={merchant.name}
                  merchant={merchant}
                  onClick={() => handleMerchantClick(merchant.name)}
                  index={idx}
                  t={t}
                />
              ))}
            </div>
            {visibleMerchants < merchants.length && (
              <button className="load-more" onClick={() => setVisibleMerchants(count => count + 24)}>{t.loadMore}</button>
            )}
          </div>
        </>
      ) : viewMode === 'allProducts' ? (
        // All products grid view
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">{t.noResults}</div>
              <div className="empty-desc">{t.tryAgain}</div>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.slice(0, visibleProducts).map((product, idx) => (
                <ProductCard
                  key={product.row}
                  product={product}
                  onClick={() => handleProductClick(product)}
                  index={idx}
                  t={t}
                />
              ))}
            </div>
          )}
          {visibleProducts < filteredProducts.length && (
            <button className="load-more" onClick={() => setVisibleProducts(count => count + 48)}>{t.loadMore}</button>
          )}
        </div>
      ) : (
        // Merchant detail view - product grid
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">{t.noResults}</div>
              <div className="empty-desc">{t.tryAgain}</div>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.slice(0, visibleProducts).map((product, idx) => (
                <ProductCard
                  key={product.row}
                  product={product}
                  onClick={() => handleProductClick(product)}
                  index={idx}
                  t={t}
                />
              ))}
            </div>
          )}
          {visibleProducts < filteredProducts.length && (
            <button className="load-more" onClick={() => setVisibleProducts(count => count + 48)}>{t.loadMore}</button>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div
          className={`nav-item ${viewMode === 'explore' ? 'active' : ''}`}
          onClick={handleBackToExplore}
        >
          <IconHome active={viewMode === 'explore'} />
          <span className="nav-label">{t.home}</span>
        </div>
        <div
          className={`nav-item ${viewMode === 'allProducts' && commissionFilter === 'all' ? 'active' : ''}`}
          onClick={handleViewAllProducts}
        >
          <IconGrid active={viewMode === 'allProducts' && commissionFilter === 'all'} />
          <span className="nav-label">{t.allProducts}</span>
        </div>
        {hasCommission && (
          <div
            className={`nav-item ${viewMode === 'allProducts' && commissionFilter === 'high' ? 'active' : ''}`}
            onClick={handleViewHighCommission}
          >
            <IconCommission active={viewMode === 'allProducts' && commissionFilter === 'high'} />
            <span className="nav-label">{t.featured}</span>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} t={t} />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
