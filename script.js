/* =====================================================
   SKYRIDE - script.js
   Usado pelas duas páginas (index.html e experiencias.html).
   Cada bloco só roda se os elementos existirem na página.
   ===================================================== */
 
/* ---------- CARROSSEL (index.html) ---------- */
(function () {
  const carousel = document.getElementById('carousel');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  if (!carousel || !next || !prev) return;
 
  function step() {
    const card = carousel.querySelector('article');
    return card.offsetWidth + 24; // largura do card + espaçamento
  }
  function irPara(posicao) {
    carousel.scrollTo({ left: posicao, behavior: 'smooth' });
  }
  next.addEventListener('click', () => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= max - 5) irPara(0);           // chegou no fim: volta ao início
    else irPara(Math.min(carousel.scrollLeft + step(), max));
  });
  prev.addEventListener('click', () => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft <= 5) irPara(max);               // está no início: vai para o fim
    else irPara(Math.max(carousel.scrollLeft - step(), 0));
  });
})();
 
/* ---------- FORMULÁRIO (index.html) ---------- */
(function () {
  const form = document.getElementById('signup');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('success').classList.add('show');
    form.reset();
  });
})();
 
/* ---------- CALENDÁRIO (index.html) ----------
   Para mudar o ano ou os preços, edite as constantes abaixo. */
(function () {
  const daysEl = document.getElementById('days');
  if (!daysEl) return;
 
  const ANO = 2027;
  const MES = 0;                 // 0 = janeiro
  const DIA_INAUGURACAO = 14;
  const PRECO_INAUGURACAO = 199.90;
  const PRECO_NORMAL = 240.00;
 
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('monthLabel').textContent = meses[MES] + ' ' + ANO;
 
  const primeiro = new Date(ANO, MES, 1).getDay();
  const total = new Date(ANO, MES + 1, 0).getDate();
 
  for (let i = 0; i < primeiro; i++) {
    const e = document.createElement('div');
    e.className = 'day empty';
    daysEl.appendChild(e);
  }
  for (let d = 1; d <= total; d++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'day';
    b.textContent = d;
    if (d < DIA_INAUGURACAO) {
      b.disabled = true; // antes da inauguração
    } else {
      if (d === DIA_INAUGURACAO) b.classList.add('promo');
      b.addEventListener('click', () => {
        document.querySelectorAll('.day.selected').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        const preco = d === DIA_INAUGURACAO ? PRECO_INAUGURACAO : PRECO_NORMAL;
        const dd = String(d).padStart(2, '0'), mm = String(MES + 1).padStart(2, '0');
        document.getElementById('ticketDate').textContent =
          dd + '/' + mm + '/' + ANO + (d === DIA_INAUGURACAO ? ' · Semana de inauguração' : '');
        document.getElementById('ticketPrice').textContent = fmt(preco);
      });
    }
    daysEl.appendChild(b);
  }
})();
 
/* ---------- COMENTÁRIOS (experiencias.html) ---------- */
(function () {
  const modal = document.getElementById('modal');
  if (!modal) return;
 
  const mImg = document.getElementById('mImg');
  const mName = document.getElementById('mName');
  const mRole = document.getElementById('mRole');
  const mText = document.getElementById('mText');
  const closeBtn = document.getElementById('modalClose');
  let ultimo = null; // card que abriu o comentário (para devolver o foco)
 
  function abrir(card) {
    ultimo = card;
    mName.textContent = card.dataset.name;
    mRole.textContent = card.dataset.role;
    mText.textContent = '“' + card.dataset.text + '”';
    mImg.style.display = '';
    mImg.src = card.dataset.img;
    mImg.alt = card.dataset.name;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function fechar() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (ultimo) ultimo.focus();
  }
 
  mImg.addEventListener('error', () => { mImg.style.display = 'none'; });
  document.querySelectorAll('.person').forEach(card => {
    card.addEventListener('click', () => abrir(card));
  });
  closeBtn.addEventListener('click', fechar);
  modal.addEventListener('click', e => { if (e.target === modal) fechar(); }); // clicar fora fecha
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) fechar(); });
})();