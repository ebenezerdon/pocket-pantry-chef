// UI logic and event bindings
(function($){
  'use strict';

  window.App = window.App || {};

  // Internal state
  const state = {
    pantry: [],
    shopping: [],
    selectedDish: null,
    aiStreaming: false,
    aiReady: false,
    aiProgress: 0,
    aiError: ''
  };

  // Render helpers
  function renderPantryChips(){
    const $wrap = $('#pantry-chips');
    $wrap.empty();
    if (!state.pantry.length) return;
    state.pantry.forEach(item => {
      const id = window.AppUtil.slug(item);
      const $chip = $(`
        <span class="chip pop-in" data-id="${id}">
          <span>${window.AppUtil.escape(item)}</span>
          <button class="chip-remove" aria-label="Remove ${window.AppUtil.escape(item)}">✕</button>
        </span>
      `);
      $chip.find('.chip-remove').on('click', function(){ removePantryItem(item); });
      $wrap.append($chip);
    });
    $('#pantry-count').text(`${state.pantry.length} item${state.pantry.length===1?'':'s'}`);
  }

  function renderShoppingList(){
    const $list = $('#shop-list');
    $list.empty();
    if (!state.shopping.length) {
      $list.append(`<li class="text-sm text-[#2A5245]">Your shopping list is empty.</li>`);
      return;
    }
    state.shopping.forEach((it, idx) => {
      const id = `shop-${idx}`;
      const $row = $(`
        <li class="check-item">
          <input id="${id}" type="checkbox" ${it.checked?'checked':''} class="h-4 w-4 rounded border-black/20">
          <label for="${id}" class="flex-1 select-none">${window.AppUtil.escape(it.name)}</label>
          <button class="text-xs text-[#B42318] hover:underline">remove</button>
        </li>
      `);
      $row.find('input').on('change', function(){ it.checked = !!this.checked; persist(); });
      $row.find('button').on('click', function(){ state.shopping.splice(idx,1); persist(); renderShoppingList(); });
      $list.append($row);
    });
  }

  function renderNaijaCard(){
    const d = state.selectedDish;
    if (!d) { $('#naija-card').addClass('hidden'); return; }
    $('#naija-card').removeClass('hidden');
    $('#naija-name').text(d.name);
    $('#naija-desc').text(d.description);
    const $ings = $('#naija-ings');
    $ings.empty();
    d.ingredients.forEach(i => $ings.append(`<li>${window.AppUtil.escape(i)}</li>`));
  }

  function setAIButtonsEnabled(enabled){
    $('#btn-ai-from-pantry, #btn-ai-native, #btn-ai-stop, #btn-ai-variations').prop('disabled', !enabled);
  }

  function setAIStreaming(streaming){
    state.aiStreaming = streaming;
    $('#btn-ai-stop').prop('disabled', !streaming);
    $('#btn-ai-from-pantry, #btn-ai-native, #btn-ai-variations').prop('disabled', streaming || !state.aiReady);
  }

  function persist(){
    window.AppStorage.save(window.AppStorage.keys.pantry, state.pantry);
    window.AppStorage.save(window.AppStorage.keys.shopping, state.shopping);
  }

  function addPantryItemsFromInput(){
    const raw = String($('#pantry-input').val() || '');
    if (!raw.trim()) return;
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    const merged = window.AppUtil.unique(state.pantry.concat(parts));
    state.pantry = merged;
    $('#pantry-input').val('');
    persist();
    renderPantryChips();
  }

  function removePantryItem(item){
    state.pantry = state.pantry.filter(i => i.toLowerCase() !== String(item).toLowerCase());
    persist();
    renderPantryChips();
  }

  function addToShopping(items){
    if (!items || !items.length) return;
    const names = window.AppUtil.unique(items.map(s => String(s).trim()).filter(Boolean));
    // Merge with existing by name
    const map = new Map();
    state.shopping.forEach(it => map.set(it.name.toLowerCase(), { name: it.name, checked: !!it.checked }));
    names.forEach(n => { if (!map.has(n.toLowerCase())) map.set(n.toLowerCase(), { name: n, checked: false }); });
    state.shopping = Array.from(map.values());
    persist();
    renderShoppingList();
  }

  // AI
  function updateProgressUI(p){
    state.aiProgress = p;
    $('#ai-progress-bar').css('width', `${p}%`);
    $('#ai-progress-text').text(p >= 100 ? 'Model ready' : `Loading model... ${p}%`);
  }

  async function ensureLLM(){

    // Only proceed if AI section exists and AppLLM is available
    if (!document.getElementById('ai-status')) { return false; }
    if (typeof window.AppLLM === 'undefined') {
      $('#ai-error').removeClass('hidden').text('AI module not loaded on this page.');
      setAIButtonsEnabled(false);
      return false;
    }
    if (state.aiReady) return true;
    try {
      $('#ai-gpu').text(navigator.gpu ? 'WebGPU found' : 'WebGPU missing');
      const engine = await window.AppLLM.load(null, updateProgressUI);
      state.aiReady = true;
      setAIButtonsEnabled(true);
      $('#ai-progress-text').text('Model ready');
      return !!engine;
    } catch (e) {
      console.error('LLM init failed', e);
      $('#ai-error').removeClass('hidden').text(String(e.message || e));
      setAIButtonsEnabled(false);
      return false;
    }
  }

  function buildPromptFromPantry(country, pref){
    const pantry = state.pantry.join(', ');
    const hint = window.AppData.countryHints[country] || '';
    const isNaija = country === 'Nigeria';
    const system = 'You are a helpful culinary assistant that writes concise, practical recipes with exact ingredient lists and clear numbered steps.';

    let user = '';
    if (isNaija) {
      user = `Create an authentic Nigerian recipe that uses items from my pantry: ${pantry || 'none listed'}.
Use your own knowledge of Nigerian cuisine to pick a suitable dish name. Clearly mark any missing ingredients.
Format using Markdown with:
- # Title
- Short description
- Ingredients (bulleted, note which I already have)
- Steps (numbered, 5–8 concise steps)
- Optional: two variations or sides.
Preferences: ${pref || 'none'}.`;
    } else {
      user = `Create a native ${country} recipe that uses ingredients from my pantry: ${pantry || 'none listed'}.
Style hints: ${hint}
Format using Markdown with Title, short description, Ingredients (bulleted), and Steps (numbered, 5–8 steps).
Keep it concise and practical. Preferences: ${pref || 'none'}.`;
    }
    return { system, user };
  }

  function buildPromptNaijaVariations(dishName, ingredients){
    const system = 'You are a friendly Nigerian home-cook assistant. Keep outputs concise and practical.';
    const user = `Suggest two variations or complementary sides for ${dishName}. Ingredients core: ${ingredients.join(', ')}. Use only real Nigerian dishes. Provide short bullet points.`;
    return { system, user };
  }

  async function streamToOutput(system, user){
    const $out = $('#ai-output');
    setAIStreaming(true);
    $('#ai-error').addClass('hidden').text('');

    $out.empty();
    const caret = $('<span class="ai-caret"></span>');
    $out.append(caret);

    let buffer = '';
    let last = 0;

    function renderMarkdown(){
      // Prefer Markdown rendering with sanitization; fallback to plain text
      try {
        if (window.marked && window.DOMPurify) {
          const html = window.marked.parse(buffer, { breaks: true, gfm: true });
          const safe = window.DOMPurify.sanitize(html);
          $out.html(safe);
          $out.append(caret);
        } else {
          $out.text(buffer);
          $out.append(caret);
        }
      } catch (_) {
        $out.text(buffer);
        $out.append(caret);
      }
      $out.scrollTop($out[0]?.scrollHeight || 0);
    }

    try {
      await window.AppLLM.generate(user, {
        system,
        onToken: (t) => {
          buffer += t;
          const now = (window.performance && performance.now) ? performance.now() : Date.now();
          if (now - last > 80) { renderMarkdown(); last = now; }
        }
      });
      // Final flush to ensure complete render
      renderMarkdown();
    } catch (e) {
      console.error('AI error', e);
      $('#ai-error').removeClass('hidden').text(String(e.message || e));
    } finally {
      setAIStreaming(false);
      caret.remove();
    }
  }

  // Public API
  window.App.init = function(){
    // Load persisted data
    state.pantry = window.AppStorage.load(window.AppStorage.keys.pantry, []) || [];
    state.shopping = window.AppStorage.load(window.AppStorage.keys.shopping, []) || [];

    // Wire events
    $('#pantry-add').on('click', addPantryItemsFromInput);
    $('#pantry-input').on('keydown', function(e){ if (e.key === 'Enter') { addPantryItemsFromInput(); } });

    $('#shop-clear').on('click', function(){ state.shopping = []; persist(); renderShoppingList(); });
    $('#shop-copy').on('click', async function(){
      const text = state.shopping.map(i => `- [${i.checked?'x':' '}] ${i.name}`).join('\n');
      const ok = await window.AppUtil.copyText(text);
      const $btn = $(this);
      const orig = $btn.text();
      $btn.text(ok?'Copied!':'Copy failed');
      setTimeout(()=> $btn.text(orig), 1000);
    });

    $('#btn-gen-naija').on('click', function(){
      const pool = window.AppData.nigerianRecipes;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      state.selectedDish = pick;
      renderNaijaCard();
      $('#naija-card').hide().fadeIn(180);
      // Enable variations if AI ready
      $('#btn-ai-variations').prop('disabled', !state.aiReady);
    });

    $('#btn-add-ings').on('click', function(){
      if (!state.selectedDish) return;
      addToShopping(state.selectedDish.ingredients);
      $(this).addClass('pop-in');
      setTimeout(()=> $(this).removeClass('pop-in'), 300);
    });

    $('#btn-ai-variations').on('click', async function(){
      if (!state.selectedDish || !state.aiReady) return;
      const { system, user } = buildPromptNaijaVariations(state.selectedDish.name, state.selectedDish.ingredients);
      await streamToOutput(system, user);
    });

    $('#btn-ai-from-pantry').on('click', async function(){
      if (!state.aiReady) return;
      const country = $('#country').val();
      const pref = $('#pref').val();
      const { system, user } = buildPromptFromPantry(country, pref);
      await streamToOutput(system, user);
    });

    $('#btn-ai-native').on('click', async function(){
      if (!state.aiReady) return;
      const country = $('#country').val();
      const pref = $('#pref').val();
      const { system, user } = buildPromptFromPantry(country, pref);
      await streamToOutput(system, user);
    });

    $('#btn-ai-stop').on('click', function(){ window.AppLLM.stop(); });

    // Auto-load AI model
    setAIButtonsEnabled(false);
    ensureLLM().then(function(ok){
      if (!ok) return;
      setAIButtonsEnabled(true);
    });
  };

  window.App.render = function(){
    renderPantryChips();
    renderShoppingList();
    renderNaijaCard();
  };

})(jQuery);
