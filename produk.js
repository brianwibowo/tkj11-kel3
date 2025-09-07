// script.js
// Pastikan array produkData sudah tersedia di global scope
const produkData = [/* ...data Anda... */];

const root = document.getElementById('app');
root.innerHTML = `
  <h1>Katalog Produk</h1>
  <div class="filter-bar">
    <input type="text" id="search" placeholder="Cari nama...">
    <select id="kategoriFilter">
      <option value="">Semua Kategori</option>
    </select>
    <select id="urutkan">
      <option value="">Urutkan</option>
      <option value="harga-asc">Harga ↓</option>
      <option value="harga-desc">Harga ↑</option>
      <option value="rating">Rating</option>
    </select>
  </div>
  <div class="produk-grid" id="produkContainer"></div>
`;

// Populate kategori
const kategoriSet = [...new Set(produkData.map(p => p.kategori))];
const kategoriFilter = document.getElementById('kategoriFilter');
kategoriSet.forEach(kat => {
  kategoriFilter.innerHTML += `<option value="${kat}">${kat}</option>`;
});

// Render produk
function renderProduk(list) {
  const container = document.getElementById('produkContainer');
  container.innerHTML = '';

  list.forEach(p => {
    const hargaDiskon = p.hargaAsli - (p.hargaAsli * p.diskon / 100);
    const stokLabel = p.stok > 0 ? `${p.stok} unit` : 'Stok habis';

    container.innerHTML += `
      <div class="card">
        <img src="${p.gambar}" alt="${p.nama}">
        <div class="card-body">
          <div>
            <h3>${p.nama}</h3>
            <span class="kategori">${p.kategori}</span>
            <div class="harga">
              <span class="harga-diskon">Rp ${hargaDiskon.toLocaleString('id-ID')}</span>
              <span class="harga-asli">Rp ${p.hargaAsli.toLocaleString('id-ID')}</span>
            </div>
            <div class="stok ${p.stok ? '' : 'habis'}">${stokLabel}</div>
            <div class="rating">
              ⭐ ${p.rating}
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// Filter & sort logic
const searchInput = document.getElementById('search');
const kategoriSelect = document.getElementById('kategoriFilter');
const urutkanSelect = document.getElementById('urutkan');

function filterProduk() {
  let data = [...produkData];

  // Search
  const q = searchInput.value.toLowerCase();
  if (q) data = data.filter(p => p.nama.toLowerCase().includes(q));

  // Kategori
  const kat = kategoriSelect.value;
  if (kat) data = data.filter(p => p.kategori === kat);

  // Urutkan
  const sort = urutkanSelect.value;
  if (sort === 'harga-asc') data.sort((a, b) => (a.hargaAsli * (1 - a.diskon / 100)) - (b.hargaAsli * (1 - b.diskon / 100)));
  if (sort === 'harga-desc') data.sort((a, b) => (b.hargaAsli * (1 - b.diskon / 100)) - (a.hargaAsli * (1 - a.diskon / 100)));
  if (sort === 'rating') data.sort((a, b) => b.rating - a.rating);

  renderProduk(data);
}

searchInput.addEventListener('input', filterProduk);
kategoriSelect.addEventListener('change', filterProduk);
urutkanSelect.addEventListener('change', filterProduk);

// Initial render
renderProduk(produkData);