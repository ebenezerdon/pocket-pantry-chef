// Helpers and data module
(function(){
  'use strict';

  // Namespaces
  window.App = window.App || {};
  window.AppUtil = window.AppUtil || {};
  window.AppStorage = window.AppStorage || {};
  window.AppData = window.AppData || {};

  // Utilities
  window.AppUtil.slug = function(str){
    return String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  window.AppUtil.unique = function(arr){
    const set = new Set();
    const out = [];
    (arr || []).forEach(v => {
      const key = String(v).toLowerCase().trim();
      if (!set.has(key) && key) { set.add(key); out.push(v); }
    });
    return out;
  };

  window.AppUtil.escape = function(str){
    return String(str || '').replace(/[&<>"']/g, function(tag){
      const chars = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' };
      return chars[tag] || tag;
    });
  };

  // Storage
  const LS_KEYS = {
    pantry: 'ppc.pantry',
    shopping: 'ppc.shopping',
    aiChat: 'ppc.ai.chat',
    model: 'app.llm.model'
  };

  window.AppStorage.save = function(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.warn('Storage save failed', e); }
  };
  window.AppStorage.load = function(key, fallback){
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (fallback === undefined ? null : fallback);
    } catch(e) { console.warn('Storage load failed', e); return fallback === undefined ? null : fallback; }
  };
  window.AppStorage.keys = LS_KEYS;

  // Data: curated Nigerian dishes
  window.AppData.nigerianRecipes = [
    {
      name: 'Jollof Rice',
      description: 'Tomato-pepper based rice with a smoky depth. Party classic.',
      ingredients: ['rice','tomatoes','red bell pepper','scotch bonnet','onion','tomato paste','vegetable oil','stock','thyme','bay leaf','garlic','ginger','salt'],
      tags: ['rice','staple']
    },
    {
      name: 'Nigerian Fried Rice',
      description: 'Colourful stir-fried rice with veggies and stock-laced aroma.',
      ingredients: ['rice','carrots','peas','sweet corn','green beans','spring onion','onion','garlic','curry powder','thyme','chicken stock','vegetable oil','salt'],
      tags: ['rice','stir-fry']
    },
    {
      name: 'Coconut Rice',
      description: 'Fragrant rice simmered in rich coconut milk with peppers.',
      ingredients: ['rice','coconut milk','tomatoes','red bell pepper','onion','scotch bonnet','stock','vegetable oil','garlic','ginger','salt'],
      tags: ['rice']
    },
    {
      name: 'Ofada Rice with Ayamase',
      description: 'Locally grown Ofada rice served with spicy green “designer” stew.',
      ingredients: ['ofada rice','green bell pepper','scotch bonnet','onion','locust beans (iru)','palm oil','assorted meats','seasoning cubes','salt'],
      tags: ['rice','stew']
    },
    {
      name: 'Tomato Stew (Nigerian)',
      description: 'All-purpose tomato stew for rice, yam, and beans.',
      ingredients: ['tomatoes','tomato paste','onion','scotch bonnet','vegetable oil','garlic','ginger','thyme','bay leaf','chicken or beef','salt'],
      tags: ['stew']
    },
    {
      name: 'Egusi Soup',
      description: 'Ground melon seed soup with leafy greens; rich and nutty.',
      ingredients: ['egusi (melon seed)','palm oil','spinach or bitterleaf','crayfish','stock','onion','scotch bonnet','salt','seasoning cubes'],
      tags: ['soup']
    },
    {
      name: 'Ogbono Soup',
      description: 'Draw soup made from ground ogbono seeds; silky and satisfying.',
      ingredients: ['ogbono','palm oil','stock','ugwu or spinach','crayfish','assorted meats','scotch bonnet','seasoning cubes','salt'],
      tags: ['soup']
    },
    {
      name: 'Okra Soup',
      description: 'Freshly chopped okra in a light, tasty palm-oil base.',
      ingredients: ['okra','palm oil','stock','onion','scotch bonnet','ugwu or spinach','fish or beef','salt'],
      tags: ['soup']
    },
    {
      name: 'Banga Soup',
      description: 'Delta-style soup made with palm fruit extract and aromatic spices.',
      ingredients: ['palm fruit concentrate','stock','catfish or meat','banga spice mix','onion','crayfish','scotch bonnet','scent leaf','salt'],
      tags: ['soup']
    },
    {
      name: 'Edikang Ikong',
      description: 'A Calabar classic packed with ugu and waterleaf greens.',
      ingredients: ['ugu (fluted pumpkin)','waterleaf','palm oil','assorted meats','stockfish','crayfish','scotch bonnet','onion','salt'],
      tags: ['soup','greens']
    },
    {
      name: 'Afang Soup',
      description: 'Earthy soup made with afang leaves and waterleaf.',
      ingredients: ['afang leaves','waterleaf','palm oil','crayfish','assorted meats','periwinkle (optional)','scotch bonnet','onion','stock','salt'],
      tags: ['soup']
    },
    {
      name: 'Efo Riro',
      description: 'Yoruba-style spinach stew with peppers and iru.',
      ingredients: ['spinach','red bell pepper','tomatoes','onion','palm oil','crayfish','locust beans (iru)','assorted meats','seasoning cubes','salt'],
      tags: ['stew','greens']
    },
    {
      name: 'Bitterleaf Soup (Ofe Onugbu)',
      description: 'Comforting Igbo soup with properly washed bitterleaf.',
      ingredients: ['bitterleaf','cocoyam paste or ofo','palm oil','assorted meats','stockfish','dry fish','crayfish','scotch bonnet','seasoning cubes','salt'],
      tags: ['soup']
    },
    {
      name: 'Oha Soup',
      description: 'Velvety soup with delicate oha leaves and cocoyam thickener.',
      ingredients: ['oha leaves','cocoyam','assorted meats','palm oil','crayfish','ogiri','scotch bonnet','seasoning cubes','salt'],
      tags: ['soup']
    },
    {
      name: 'Nsala Soup (White Soup)',
      description: 'Light, peppery white soup usually made with catfish or chicken.',
      ingredients: ['catfish or chicken','yam (pounded or flakes)','crayfish','utazi leaves (a little)','scotch bonnet','seasoning cubes','salt'],
      tags: ['soup']
    },
    {
      name: 'Fisherman Soup',
      description: 'Rivers-style seafood soup loaded with fresh fish and shellfish.',
      ingredients: ['fresh fish','prawns','periwinkle','palm oil','crayfish','scotch bonnet','onion','uziza leaves','seasoning cubes','salt'],
      tags: ['soup','seafood']
    },
    {
      name: 'Atama Soup',
      description: 'Palm-nut based soup perfumed with atama leaves.',
      ingredients: ['atama leaves','palm nut extract','assorted meats','dry fish','crayfish','periwinkle','scotch bonnet','salt'],
      tags: ['soup']
    },
    {
      name: 'Gbegiri',
      description: 'Silky bean soup often paired with ewedu and stew.',
      ingredients: ['black-eyed beans','palm oil','crayfish','scotch bonnet','onion','seasoning cubes','salt'],
      tags: ['soup','beans']
    },
    {
      name: 'Ewedu',
      description: 'Light soup made from jute leaves; perfect with gbegiri and stew.',
      ingredients: ['ewedu leaves','potash (a pinch)','locust beans (iru)','crayfish','salt'],
      tags: ['soup','greens']
    },
    {
      name: 'Ewa Agoyin',
      description: 'Mashed beans served with intensely fried pepper sauce.',
      ingredients: ['black-eyed beans','palm oil','dried chiles','onion','salt','seasoning cubes'],
      tags: ['beans','street food']
    },
    {
      name: 'Beans Porridge',
      description: 'Comforting one-pot beans cooked soft with palm oil.',
      ingredients: ['beans','palm oil','onion','scotch bonnet','seasoning cubes','salt'],
      tags: ['beans']
    },
    {
      name: 'Moi Moi',
      description: 'Steamed bean pudding with peppers and aromatics.',
      ingredients: ['black-eyed peas','red bell pepper','onion','scotch bonnet','vegetable oil','salt','seasoning'],
      tags: ['steamed','beans']
    },
    {
      name: 'Akara',
      description: 'Crispy-on-the-outside, fluffy fried bean fritters.',
      ingredients: ['black-eyed peas','onion','scotch bonnet','salt','vegetable oil'],
      tags: ['fried','beans']
    },
    {
      name: 'Beef Suya',
      description: 'Street-style skewers dusted with peanut-y suya spice.',
      ingredients: ['beef','ground peanuts','suya spice','paprika','cayenne','onion powder','salt','vegetable oil'],
      tags: ['grill','street food']
    },
    {
      name: 'Kilishi',
      description: 'Paper-thin spicy dried beef, Northern Nigerian delicacy.',
      ingredients: ['beef','ground peanuts','chili flakes','ginger','garlic','cloves','sugar','salt'],
      tags: ['snack']
    },
    {
      name: 'Nkwobi',
      description: 'Spiced cow-foot in rich palm-oil emulsion with utazi.',
      ingredients: ['cow foot','palm oil','potash (akanwu)','uziza seed (ground)','utazi leaves','crayfish','scotch bonnet','onion','seasoning cubes','salt'],
      tags: ['delicacy']
    },
    {
      name: 'Isi Ewu',
      description: 'Goat-head delicacy tossed in spicy palm-oil emulsion.',
      ingredients: ['goat head','palm oil','potash (akanwu)','utazi','uziza seed','crayfish','scotch bonnet','onion','seasoning cubes','salt'],
      tags: ['delicacy']
    },
    {
      name: 'Asun',
      description: 'Peppered roasted goat bites tossed with onions and chilies.',
      ingredients: ['goat meat','scotch bonnet','onion','vegetable oil','thyme','garlic','salt'],
      tags: ['grill']
    },
    {
      name: 'Gizdodo',
      description: 'Spicy-sweet mix of fried plantain and saucy gizzards.',
      ingredients: ['chicken gizzard','ripe plantain','onion','red bell pepper','scotch bonnet','tomatoes','seasoning cubes','vegetable oil','salt'],
      tags: ['stir-fry']
    },
    {
      name: 'Yamarita',
      description: 'Battered, seasoned yam fries—crispy outside, soft inside.',
      ingredients: ['yam','eggs','flour','scotch bonnet','seasoning cubes','salt','vegetable oil'],
      tags: ['fried']
    },
    {
      name: 'Yam Porridge (Asaro)',
      description: 'Soft yam cooked in peppered palm-oil base; hearty and rich.',
      ingredients: ['yam','palm oil','tomatoes','red bell pepper','onion','crayfish','stock','spinach','salt'],
      tags: ['porridge']
    },
    {
      name: 'Plantain Porridge',
      description: 'Comforting one-pot of unripe plantain and leafy greens.',
      ingredients: ['unripe plantain','palm oil','onion','scotch bonnet','smoked fish','spinach','salt'],
      tags: ['porridge']
    },
    {
      name: 'Abacha (African Salad)',
      description: 'Cassava flakes in palm-oil sauce with ugba and garden eggs.',
      ingredients: ['abacha (cassava flakes)','ugba (oil bean)','palm oil','potash (a little)','crayfish','scotch bonnet','onion','utazi','garden egg','smoked fish','salt'],
      tags: ['salad']
    },
    {
      name: 'Ukwa Porridge',
      description: 'Igbo-style breadfruit porridge with smoky fish notes.',
      ingredients: ['ukwa (breadfruit)','palm oil','dry fish','ogiri','scotch bonnet','onion','seasoning cubes','salt'],
      tags: ['porridge']
    },
    {
      name: 'Okpa',
      description: 'Savory Bambara nut pudding; firm, filling, and protein-rich.',
      ingredients: ['bambara nut flour','palm oil','scotch bonnet','onion','seasoning cubes','salt','water'],
      tags: ['steamed']
    },
    {
      name: 'Tuwo Shinkafa with Miyan Kuka',
      description: 'Northern soft rice swallow served with baobab-leaf soup.',
      ingredients: ['tuwo rice','baobab leaf powder (kuka)','dried fish','groundnut or palm oil','scotch bonnet','seasoning cubes','salt'],
      tags: ['northern','soup']
    },
    {
      name: 'Miyan Taushe',
      description: 'Pumpkin and peanut-based soup; comforting Northern classic.',
      ingredients: ['pumpkin','peanut paste','palm oil','onion','scotch bonnet','yaji (suya spice)','seasoning cubes','salt'],
      tags: ['northern','soup']
    },
    {
      name: 'Masa (Waina)',
      description: 'Fermented rice cakes—soft, slightly sweet, and griddled.',
      ingredients: ['rice','yeast','sugar','salt','milk or water','vegetable oil'],
      tags: ['street food','griddle']
    },
    {
      name: 'Boli with Groundnut',
      description: 'Charred ripe plantain served with roasted peanuts.',
      ingredients: ['ripe plantain','salt','roasted groundnut'],
      tags: ['street food']
    },
    {
      name: 'Pepper Soup (Goat)',
      description: 'Light, spicy broth scented with West African spice mix.',
      ingredients: ['goat meat','pepper soup spice','scotch bonnet','onion','stock','scent leaf or basil','salt'],
      tags: ['soup']
    },
    {
      name: 'Catfish Pepper Soup',
      description: 'Delicate catfish in aromatic pepper soup broth.',
      ingredients: ['catfish','pepper soup spice','scotch bonnet','onion','scent leaf','stock','salt'],
      tags: ['soup','seafood']
    }
  ];

  // Simple country-to-style hints for prompts
  window.AppData.countryHints = {
    'Nigeria': 'Use West African techniques like frying in palm oil (when appropriate), tomato-pepper bases, suya spice, and leafy greens like spinach or bitterleaf.',
    'Ghana': 'Consider shito, kontomire, waakye-style rice and beans, and smoky tomato bases.',
    'Senegal': 'Think thieboudienne influences, fish-forward profiles, and parsley-onion marinades.',
    'Kenya': 'Incorporate sukuma wiki, ugali-like starches, and tomato-onion bases.',
    'Morocco': 'Use tagine techniques, ras el hanout, preserved lemon, and couscous.',
    'Ethiopia': 'Berbere spice, niter kibbeh, injera-friendly sauces and stews.',
    'South Africa': 'Braai influence, chutneys, peri-peri elements, maize meal sides.',
    'India': 'Regional spice blends, tempering techniques, and aromatic basmati or lentils.',
    'Italy': 'Soffritto, olive oil, tomatoes, pasta or risotto, and fresh herbs.',
    'Mexico': 'Chiles, cumin, lime, corn tortillas, and salsas with layers of heat.'
  };

  // Compute missing ingredients for a recipe relative to pantry
  window.AppUtil.missingFromPantry = function(recipeIngredients, pantry){
    const haveSet = new Set((pantry || []).map(i => String(i).toLowerCase().trim()));
    return (recipeIngredients || []).filter(i => !haveSet.has(String(i).toLowerCase().trim()));
  };

  // Copy to clipboard helper
  window.AppUtil.copyText = async function(text){
    try { await navigator.clipboard.writeText(String(text || '')); return true; } catch(e) { console.warn('Clipboard failed', e); return false; }
  };
})();
