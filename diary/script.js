const tree = document.getElementById('tree');
const tabs = document.getElementById('tabs');
const content = document.getElementById('content');
const addCategoryBtn = document.getElementById('addCategory');
const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsModal = document.getElementById('settingsModal');
const settingsClose = document.getElementById('settingsClose');

let data = JSON.parse(localStorage.getItem('journal')) || {};
let pages = JSON.parse(localStorage.getItem('pages')) || {};
let dates = JSON.parse(localStorage.getItem('dates')) || {};
let openTabs = [];
let active = null;

/* ---------- Mobile Menu Management ---------- */
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const settingsBtnMobile = document.getElementById('settingsBtnMobile');

// Mobile menu toggle
if (menuToggle && sidebar && sidebarOverlay) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    sidebarOverlay.classList.toggle('show');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    sidebarOverlay.classList.remove('show');
  });

  // Close sidebar when clicking on a file
  tree.addEventListener('click', (e) => {
    if (e.target.classList.contains('file')) {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
      }
    }
  });
}

// Mobile settings button
if (settingsBtnMobile) {
  settingsBtnMobile.addEventListener('click', () => {
    settingsOverlay.classList.add('show');
    settingsModal.classList.add('show');
    updateThemeButtons();
  });
}

/* ---------- Mobile Toolbar ---------- */
const mobileToolbar = document.getElementById('mobileToolbar');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');
const listBtn = document.getElementById('listBtn');
const linkBtn = document.getElementById('linkBtn');

if (boldBtn) {
  boldBtn.addEventListener('click', () => {
    document.execCommand('bold', false, null);
    content.focus();
  });
}

if (italicBtn) {
  italicBtn.addEventListener('click', () => {
    document.execCommand('italic', false, null);
    content.focus();
  });
}

if (underlineBtn) {
  underlineBtn.addEventListener('click', () => {
    document.execCommand('underline', false, null);
    content.focus();
  });
}

if (listBtn) {
  listBtn.addEventListener('click', () => {
    document.execCommand('insertUnorderedList', false, null);
    content.focus();
  });
}

if (linkBtn) {
  linkBtn.addEventListener('click', () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      content.focus();
    }
  });
}

/* ---------- Theme Management ---------- */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'system';
  setTheme(savedTheme);
  updateThemeButtons();
}

function setTheme(theme) {
  let effectiveTheme = theme;
  
  if (theme === 'system') {
    effectiveTheme = getSystemTheme();
  }
  
  document.documentElement.setAttribute('data-theme', effectiveTheme);
  localStorage.setItem('theme', theme);
  updateThemeButtons();
}

function updateThemeButtons() {
  const theme = localStorage.getItem('theme') || 'system';
  document.querySelectorAll('.settings-btn[data-theme]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
  });
}

function updateColorButtons() {
  const colorTheme = localStorage.getItem('colorTheme') || '';
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-color-theme') === colorTheme);
  });
}

function toggleTheme(themeChoice) {
  setTheme(themeChoice);
}

function setColorTheme(colorTheme) {
  document.documentElement.setAttribute('data-color-theme', colorTheme);
  localStorage.setItem('colorTheme', colorTheme);
  updateColorButtons();
}

// Theme button event listeners
document.getElementById('themeLight')?.addEventListener('click', () => toggleTheme('light'));
document.getElementById('themeDark')?.addEventListener('click', () => toggleTheme('dark'));
document.getElementById('themeSystem')?.addEventListener('click', () => toggleTheme('system'));

// Color button event listeners
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const colorTheme = btn.getAttribute('data-color-theme');
    setColorTheme(colorTheme);
  });
});

// Settings modal management
settingsBtn.addEventListener('click', () => {
  settingsOverlay.classList.add('show');
  settingsModal.classList.add('show');
  updateThemeButtons();
});

function closeSettings() {
  settingsOverlay.classList.remove('show');
  settingsModal.classList.remove('show');
}

settingsClose?.addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', closeSettings);

// Settings tab switching
document.querySelectorAll('.settings-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    
    // Remove active from all tabs and panels
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    
    // Add active to clicked tab and corresponding panel
    tab.classList.add('active');
    document.querySelector(`.settings-panel[data-panel="${tabName}"]`).classList.add('active');
  });
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const theme = localStorage.getItem('theme') || 'system';
  if (theme === 'system') {
    setTheme('system');
  }
});

// Initialize theme on load
initTheme();

// Initialize color theme
const savedColorTheme = localStorage.getItem('colorTheme') || '';
setColorTheme(savedColorTheme);

/* ---------- Context Menu Formatting ---------- */
function initContextMenu() {
  const contextMenu = document.getElementById('contextMenu');
  const formattingMenu = document.getElementById('formattingMenu');
  const formattingSubmenu = document.getElementById('formattingSubmenu');
  const boldMenu = document.getElementById('boldMenu');
  const italicMenu = document.getElementById('italicMenu');
  const underlineMenu = document.getElementById('underlineMenu');
  const strikeMenu = document.getElementById('strikeMenu');
  const superMenu = document.getElementById('superMenu');
  const subMenu = document.getElementById('subMenu');
  const codeMenu = document.getElementById('codeMenu');
  const ulMenu = document.getElementById('ulMenu');
  const olMenu = document.getElementById('olMenu');
  const linkMenu = document.getElementById('linkMenu');
  const imageMenu = document.getElementById('imageMenu');

  if (!contextMenu || !content) return;

  let savedSelection = null;

  function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelection = selection.getRangeAt(0);
      return true;
    }
    return false;
  }

  function restoreSelection() {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
      return true;
    }
    return false;
  }

  function closeContextMenu() {
    contextMenu.classList.remove('show');
    formattingSubmenu.classList.remove('show');
  }

  // Right-click on content to show menu - always show when right-clicking in content
  content.addEventListener('contextmenu', (e) => {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    saveSelection();
    contextMenu.style.left = (e.clientX + window.scrollX) + 'px';
    contextMenu.style.top = (e.clientY + window.scrollY) + 'px';
    contextMenu.classList.add('show');
  });

  contextMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  formattingMenu.addEventListener('mouseenter', () => {
    formattingSubmenu.classList.add('show');
  });

  formattingMenu.addEventListener('mouseleave', () => {
    formattingSubmenu.classList.remove('show');
  });

  formattingSubmenu.addEventListener('mouseenter', () => {
    formattingSubmenu.classList.add('show');
  });

  formattingSubmenu.addEventListener('mouseleave', () => {
    formattingSubmenu.classList.remove('show');
  });

  document.addEventListener('click', closeContextMenu);

  boldMenu.onclick = () => {
    restoreSelection();
    document.execCommand('bold', false, null);
    closeContextMenu();
  };

  italicMenu.onclick = () => {
    restoreSelection();
    document.execCommand('italic', false, null);
    closeContextMenu();
  };

  underlineMenu.onclick = () => {
    restoreSelection();
    document.execCommand('underline', false, null);
    closeContextMenu();
  };

  strikeMenu.onclick = () => {
    restoreSelection();
    document.execCommand('strikeThrough', false, null);
    closeContextMenu();
  };

  superMenu.onclick = () => {
    restoreSelection();
    document.execCommand('superscript', false, null);
    closeContextMenu();
  };

  subMenu.onclick = () => {
    restoreSelection();
    document.execCommand('subscript', false, null);
    closeContextMenu();
  };

  codeMenu.onclick = () => {
    restoreSelection();
    document.execCommand('formatBlock', false, '<pre>');
    closeContextMenu();
  };

  ulMenu.onclick = () => {
    restoreSelection();
    document.execCommand('insertUnorderedList', false, null);
    closeContextMenu();
  };

  olMenu.onclick = () => {
    restoreSelection();
    document.execCommand('insertOrderedList', false, null);
    closeContextMenu();
  };

  linkMenu.onclick = () => {
    restoreSelection();
    const url = prompt('Enter URL (e.g., https://example.com):');
    if (url) {
      // Check if URL has protocol
      const finalUrl = url.includes('://') ? url : 'https://' + url;
      document.execCommand('createLink', false, finalUrl);
    }
    closeContextMenu();
  };

  imageMenu.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Create container for image and controls
          const container = document.createElement('div');
          container.setAttribute('data-image-container', 'true');
          container.style.position = 'relative';
          container.style.display = 'inline-block';
          container.style.margin = '8px 0';
          container.style.userSelect = 'none';
          
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.width = '200px';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.border = '1px solid #ddd';
          img.style.borderRadius = '4px';
          img.style.cursor = 'grab';
          img.draggable = false;
          
          // Create delete button
          const deleteBtn = document.createElement('button');
          deleteBtn.setAttribute('data-delete-btn', 'true');
          deleteBtn.innerHTML = '✕';
          deleteBtn.style.position = 'absolute';
          deleteBtn.style.top = '4px';
          deleteBtn.style.right = '4px';
          deleteBtn.style.width = 'clamp(28px, 5vw, 36px)';
          deleteBtn.style.height = 'clamp(28px, 5vw, 36px)';
          deleteBtn.style.padding = '0';
          deleteBtn.style.background = '#ff4444';
          deleteBtn.style.color = '#fff';
          deleteBtn.style.border = 'none';
          deleteBtn.style.borderRadius = '50%';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.style.fontSize = 'clamp(14px, 3vw, 20px)';
          deleteBtn.style.fontWeight = 'bold';
          deleteBtn.style.display = 'none';
          deleteBtn.style.alignItems = 'center';
          deleteBtn.style.justifyContent = 'center';
          deleteBtn.style.userSelect = 'none';
          
          // Create resize handle
          const resizeHandle = document.createElement('div');
          resizeHandle.setAttribute('data-resize-handle', 'true');
          resizeHandle.style.position = 'absolute';
          resizeHandle.style.bottom = '0';
          resizeHandle.style.right = '0';
          resizeHandle.style.width = 'clamp(18px, 3vw, 28px)';
          resizeHandle.style.height = 'clamp(18px, 3vw, 28px)';
          resizeHandle.style.background = '#333';
          resizeHandle.style.cursor = 'nwse-resize';
          resizeHandle.style.display = 'none';
          
          container.appendChild(img);
          container.appendChild(deleteBtn);
          container.appendChild(resizeHandle);
          
          // Insert image at cursor position
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(container);
            // Move cursor after image
            range.setStartAfter(container);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          content.focus();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    closeContextMenu();
  };
}

/* ---------- Custom Popup ---------- */
const popupOverlay = document.getElementById('popupOverlay');
const popupModal = document.getElementById('popupModal');
const popupMessage = document.getElementById('popupMessage');
const popupCancel = document.getElementById('popupCancel');
const popupConfirm = document.getElementById('popupConfirm');

let popupCallback = null;function showDeletePopup(message, callback) {
  popupMessage.textContent = message;
  popupOverlay.classList.add('show');
  popupModal.classList.add('show');
  popupCallback = callback;
}

function closePopup() {
  popupOverlay.classList.remove('show');
  popupModal.classList.remove('show');
  popupCallback = null;
}

popupCancel.onclick = closePopup;
popupOverlay.onclick = closePopup;

popupConfirm.onclick = () => {
  if (popupCallback) popupCallback();
  closePopup();
};

/* ---------- Render ---------- */
function renderTree(animate = false) {
  const wasEmpty = tree.innerHTML === '';
  tree.innerHTML = '';

  Object.keys(data).forEach(cat => {
    const category = document.createElement('div');
    category.className = 'category';

    /* ---- category title ---- */
    const title = document.createElement('div');
    title.className = 'category-title';

    const label = document.createElement('span');
    label.textContent = '▾ ' + cat;

    const delCat = document.createElement('span');
    delCat.className = 'delete';
    delCat.textContent = '✕';

    delCat.onclick = (e) => {
      e.stopPropagation();
      showDeletePopup(`Delete category "${cat}"?`, () => {
        // close open tabs
        data[cat].forEach(f => closeTab(cat + '/' + f));

        delete data[cat];
        save();
        renderTree();
      });
    };

    title.append(label, delCat);

    /* ---- files ---- */
    const files = document.createElement('div');
    files.className = 'files';

    let collapsed = false;

    title.onclick = () => {
      collapsed = !collapsed;
      files.classList.toggle('collapsed', collapsed);
      label.textContent = (collapsed ? '▸ ' : '▾ ') + cat;
    };

    data[cat].forEach((file, idx) => {
      const f = document.createElement('div');
      f.className = 'file';

      const name = document.createElement('span');
      name.textContent = file;
      name.onclick = () => openPage(cat + '/' + file, file);

      const del = document.createElement('span');
      del.className = 'delete';
      del.textContent = '✕';

      del.onclick = (e) => {
        e.stopPropagation();
        showDeletePopup(`Delete note "${file}"?`, () => {
          closeTab(cat + '/' + file);
          data[cat] = data[cat].filter(n => n !== file);
          delete pages[cat + '/' + file];

          save();
          renderTree();
        });
      };

      f.append(name, del);
      if (animate) {
        setTimeout(() => f.classList.add('show'), idx * 50);
      }
      files.appendChild(f);
    });

    /* ---- add file ---- */
    const addFile = document.createElement('div');
    addFile.className = 'file';
    addFile.textContent = '+ New blocket';
    addFile.onclick = () => {
      const fileName = 'Untitled ' + (data[cat].length + 1);
      const noteId = cat + '/' + fileName;
      data[cat].push(fileName);
      pages[noteId] = `<h1>${fileName}</h1>`;
      dates[noteId] = new Date().toISOString();
      save();
      renderTree(true);
      openPage(noteId, fileName);
    };

    files.appendChild(addFile);
    category.append(title, files);
    if (animate) {
      setTimeout(() => category.classList.add('show'), 0);
    }
    tree.appendChild(category);
  });
}


/* ---------- Image Event Listeners ---------- */
let resizingState = { isResizing: false, startX: 0, startY: 0, startWidth: 0, startHeight: 0, img: null };

// Attach event delegation to content area for images
function setupImageDelegation() {
  // Delete button delegation
  content.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-delete-btn') === 'true') {
      e.preventDefault();
      e.stopPropagation();
      if (confirm('Delete this image?')) {
        e.target.closest('[data-image-container]').remove();
      }
    }
  }, true); // Use capture phase
  
  // Resize handle delegation
  content.addEventListener('mousedown', (e) => {
    if (e.target.getAttribute('data-resize-handle') === 'true') {
      const container = e.target.closest('[data-image-container]');
      const img = container.querySelector('img');
      resizingState.isResizing = true;
      resizingState.startX = e.clientX;
      resizingState.startY = e.clientY;
      resizingState.startWidth = img.offsetWidth;
      resizingState.startHeight = img.offsetHeight;
      resizingState.img = img;
      e.preventDefault();
    }
  }, true);
  
  // Hover delegation for showing/hiding controls (using mouseover/mouseout which bubble)
  content.addEventListener('mouseover', (e) => {
    let container = e.target.closest('[data-image-container]');
    if (!container && e.target.getAttribute('data-image-container') === 'true') {
      container = e.target;
    }
    if (container) {
      const deleteBtn = container.querySelector('[data-delete-btn]');
      const resizeHandle = container.querySelector('[data-resize-handle]');
      const img = container.querySelector('img');
      if (deleteBtn) deleteBtn.style.display = 'flex';
      if (resizeHandle) resizeHandle.style.display = 'block';
      if (img) img.style.border = '2px dashed #333';
    }
  }, true);
  
  content.addEventListener('mouseout', (e) => {
    let container = e.target.closest('[data-image-container]');
    if (!container && e.target.getAttribute('data-image-container') === 'true') {
      container = e.target;
    }
    if (container) {
      const deleteBtn = container.querySelector('[data-delete-btn]');
      const resizeHandle = container.querySelector('[data-resize-handle]');
      const img = container.querySelector('img');
      if (deleteBtn) deleteBtn.style.display = 'none';
      if (resizeHandle) resizeHandle.style.display = 'none';
      if (img) img.style.border = '1px solid #ddd';
    }
  }, true);
}

// Wrap a raw <img> element into a container with controls
function wrapImage(img) {
  if (!img || img.closest('[data-image-container]')) return;
  const parent = img.parentNode;
  const container = document.createElement('div');
  container.setAttribute('data-image-container', 'true');
  container.style.position = 'relative';
  container.style.display = 'inline-block';
  container.style.margin = '8px 0';
  container.style.userSelect = 'none';

  // Ensure image has reasonable display/wrapping
  if (!img.style.width) img.style.width = '200px';
  img.style.height = 'auto';
  img.style.display = 'block';
  img.style.border = '1px solid #ddd';
  img.style.borderRadius = '4px';
  img.style.cursor = 'grab';
  img.draggable = false;

  // Create controls
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-delete-btn', 'true');
  deleteBtn.innerHTML = '✕';
  deleteBtn.style.position = 'absolute';
  deleteBtn.style.top = '4px';
  deleteBtn.style.right = '4px';
  deleteBtn.style.width = 'clamp(28px, 5vw, 36px)';
  deleteBtn.style.height = 'clamp(28px, 5vw, 36px)';
  deleteBtn.style.padding = '0';
  deleteBtn.style.background = '#ff4444';
  deleteBtn.style.color = '#fff';
  deleteBtn.style.border = 'none';
  deleteBtn.style.borderRadius = '50%';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontSize = 'clamp(14px, 3vw, 20px)';
  deleteBtn.style.fontWeight = 'bold';
  deleteBtn.style.display = 'none';
  deleteBtn.style.alignItems = 'center';
  deleteBtn.style.justifyContent = 'center';
  deleteBtn.style.userSelect = 'none';

  const resizeHandle = document.createElement('div');
  resizeHandle.setAttribute('data-resize-handle', 'true');
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.bottom = '0';
  resizeHandle.style.right = '0';
  resizeHandle.style.width = 'clamp(18px, 3vw, 28px)';
  resizeHandle.style.height = 'clamp(18px, 3vw, 28px)';
  resizeHandle.style.background = '#333';
  resizeHandle.style.cursor = 'nwse-resize';
  resizeHandle.style.display = 'none';

  // Replace image with container and append
  parent.replaceChild(container, img);
  container.appendChild(img);
  container.appendChild(deleteBtn);
  container.appendChild(resizeHandle);
}

// Find any raw <img> tags in content and wrap them
function normalizeImages() {
  const imgs = Array.from(content.querySelectorAll('img'));
  imgs.forEach(img => {
    if (!img.closest('[data-image-container]')) {
      wrapImage(img);
    }
  });
}

// Handle paste events to normalize pasted images
content.addEventListener('paste', (e) => {
  // Wait for paste to insert DOM nodes
  setTimeout(() => {
    normalizeImages();
  }, 50);
});

// Support Tab/Shift+Tab inside lists to indent/outdent
content.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  let node = sel.anchorNode;
  while (node && node.nodeType !== 1) node = node.parentElement;
  const li = node ? node.closest('li') : null;
  if (li) {
    e.preventDefault();
    if (e.shiftKey) document.execCommand('outdent');
    else document.execCommand('indent');
  }
});

// Document-level resize handling
document.addEventListener('mousemove', (e) => {
  if (resizingState.isResizing && resizingState.img) {
    const newWidth = resizingState.startWidth + (e.clientX - resizingState.startX);
    if (newWidth > 50) {
      resizingState.img.style.width = newWidth + 'px';
      resizingState.img.style.height = 'auto';
    }
  }
});

document.addEventListener('mouseup', () => {
  resizingState.isResizing = false;
  resizingState.img = null;
});

/* ---------- Tabs ---------- */
function openPage(id, title) {
  if (!openTabs.includes(id)) openTabs.push(id);
  active = id;
  renderTabs();
  content.innerHTML = pages[id] || `<h1>${title}</h1>`;
  content.setAttribute('contenteditable', 'true');
  document.getElementById('toolbar').classList.add('show');
  // Ensure any raw <img> tags are normalized into containers
  normalizeImages();
  updateStats();
}

function renderTabs() {
  tabs.innerHTML = '';
  openTabs.forEach(id => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (id === active ? ' active' : '');
    
    const tabContent = document.createElement('span');
    tabContent.textContent = id.split('/')[1];
    tabContent.onclick = (e) => {
      e.stopPropagation();
      active = id;
      content.innerHTML = pages[id] || '';
      content.setAttribute('contenteditable', 'true');
      // Normalize images after loading
      normalizeImages();
      renderTabs();
      updateStats();
    };
    
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✕';
    closeBtn.className = 'tab-close';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeTab(id);
    };
    
    tab.append(tabContent, closeBtn);
    tabs.appendChild(tab);
  });
}

/* ---------- Storage ---------- */
let updateTimeout;
let saveDebounce;

content.addEventListener('input', () => {
  if (!active) return;
  pages[active] = content.innerHTML;
  updateStats();

  // Debounce file name update to avoid constant re-renders
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateFileNameFromContent();
  }, 500);

  // Debounced save to reduce frequent localStorage writes
  clearTimeout(saveDebounce);
  saveDebounce = setTimeout(() => {
    save();
  }, 800);
});

// Handle link clicks in content
content.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const href = e.target.href;
      if (href) {
        window.open(href, '_blank', 'noopener noreferrer');
      }
    }
  }
});

function save() {
  localStorage.setItem('journal', JSON.stringify(data));
  localStorage.setItem('pages', JSON.stringify(pages));
  localStorage.setItem('dates', JSON.stringify(dates));
}

/* ---------- Add category ---------- */
addCategoryBtn.onclick = () => {
  const name = prompt('Category name');
  if (!name || data[name]) return;
  data[name] = [];
  save();
  renderTree(true);
};

renderTree();
renderTabs();

// Set initial state - content is disabled until a note is opened
content.setAttribute('contenteditable', 'false');

// Initialize context menu after DOM is ready
initContextMenu();

const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function updateStats() {
  const text = content.innerText || '';
  const chars = text.length;
  const lines = text.trim() === '' ? 0 : text.split('\n').length;

  charCount.textContent = `${chars} chars`;
  lineCount.textContent = `${lines} lines`;
  
  // Update date
  const dateElement = document.getElementById('dateCreated');
  if (dateElement && active) {
    dateElement.textContent = formatDate(dates[active]) || 'No date';
  }
}

/* -- removed broken loadContent override (was referencing undefined function) -- */


function closeTab(id) {
  openTabs = openTabs.filter(t => t !== id);
  if (active === id) {
    active = openTabs[0] || null;
    if (active) {
      content.innerHTML = pages[active] || '';
      content.setAttribute('contenteditable', 'true');
    } else {
      content.innerHTML = '';
      content.setAttribute('contenteditable', 'false');
    }
    updateStats();
  }
  renderTabs();
}

function getTitleFromContent() {
  const firstLine = content.innerText.split('\n')[0];
  return firstLine.trim() || 'Untitled';
}

function updateFileNameFromContent() {
  if (!active) return;
  
  const newTitle = getTitleFromContent();
  const [cat, oldFileName] = active.split('/');
  
  if (newTitle === oldFileName) return;
  
  // Update data array
  const idx = data[cat].indexOf(oldFileName);
  if (idx > -1) {
    data[cat][idx] = newTitle;
  }
  
  const oldId = cat + '/' + oldFileName;
  const newId = cat + '/' + newTitle;
  
  // Update pages object
  pages[newId] = pages[oldId];
  delete pages[oldId];
  
  // Update dates object
  dates[newId] = dates[oldId];
  delete dates[oldId];
  
  // Update openTabs array
  const tabIdx = openTabs.indexOf(oldId);
  if (tabIdx > -1) {
    openTabs[tabIdx] = newId;
  }
  
  // Update active tab
  active = newId;
  
  save();
  renderTree();
  renderTabs();
  updateStats();
}

// Initialize image event delegation
setupImageDelegation();

/* ---------- ASCII Art Background ---------- */
const asciiArtPatterns = {
  small: [
    // Small decorative patterns for corners
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠿⠋⠋⠙⠻⣦⣄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠏⠀⠀⠀⠀⠀⠈⢿⣆⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡀⠀⠀⠀⠀⠀⠀⠘⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠀⠈⢿⡑⠤⣀⠀⠀⠀⠀⠀⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣟⠁⢠⣴⣧⡀⠀⠀⠉⠛⠏⠀⠀⠀⠀⠀⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣾⡦⠀⠈⢀⣌⠀⠈⠙⠇⢰⣆⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠉⢀⠀⠈⠋⠃⠀⣀⡀⠸⣿⡆⠀⢀⡀⡀⠀⠀⠀⣾⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣦⠀⣠⡾⠛⠉⠉⠲⣄⠐⠻⠓⠂⢹⣧⠀⣿⡉⢣⡾⣄⢰⡟⢀⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢀⣾⡟⠀⠀⠀⠀⠀⠙⣧⠀⠀⠀⠘⣿⣴⣿⡆⠀⠙⠟⠊⢉⣟⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⢡⡀⠀⠀⠀⠀⠀⣿⠀⠀⢠⡤⠟⠋⠉⠀⠀⠀⠀⢠⣿⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⢰⡏⠀⠀⠀⢈⣿⢲⣶⠄⠀⢀⠀⠀⠙⣷⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠁⠀⠀⠀⢈⡇⣼⣿⠀⢠⣾⠟⠓⠆⠸⠆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣼⣃⣀⡀⠀⠀⣾⠃⢙⣶⡴⠛⠁⣣⡆⢀⢀⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠶⠦⠿⠛⢒⡾⠳⠤⠤⣈⡁⣲⡧⣴⡾⠋⠀⢠⣀⣙⠁⠈⠿⠇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠚⠉⠀⠀⠀⠀⣠⡞⠁⠀⠀⠀⠀⣨⣿⣿⡟⠳⡀⠙⣿⣿⡋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⡷⠂⠀⠀⠀⠀⠀⠀⠀⠀⣠⡞⡯⠀⠀⠀⣀⠀⢠⡼⠋⠀⠀⠀⠀⠀⣴⣿⡿⠋⣧⠀⠹⡀⠁⢠⣤⠄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⡀⠀⠀⠀⠀⠀⠀⣴⣦⠀⠀⢾⠆⠀⣠⡾⢋⣼⠈⠙⠫⢩⣃⡴⠋⠀⠀⠀⠀⠀⢠⣾⡿⠋⠀⠀⢸⡇⠀⢳⠀⠀⠉⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠻⢍⣦⡄⠠⣼⡤⠀⠈⠀⣀⡠⠤⠒⣻⡿⢟⣉⠀⠀⠀⠀⠻⡯⡀⠀⠀⠀⠀⢠⣴⠿⠋⠀⠀⣶⢖⢸⣴⠀⠀⡇⠀⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠛⢉⡦⠐⠋⠀⠀⠀⢰⠏⠀⠀⢀⣿⡄⣰⠗⠂⠘⠀⠑⢤⣠⡴⠟⠁⠀⠀⠀⠀⣿⠉⢙⢇⣀⣠⢷⢿⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣦⣧⡄⠀⠀⣀⠔⠊⠁⠀⠀⠀⠀⠀⠀⣎⣀⣴⡾⠛⠁⠙⠁⠀⠀⠀⣀⣤⠞⠉⢦⠀⠀⠀⠀⣠⣶⣿⡂⠀⠀⠛⡂⣠⠟⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡦⡄⠀⠀⠀⠀⠉⠙⠀⡤⠊⠀⠀⠀⠀⠀⠀⢀⣠⣴⡾⠗⠋⠁⠀⠀⠀⠀⣀⣤⡶⠛⠉⠀⠀⠀⠀⠱⡀⢀⣠⡝⠋⠀⠀⠀⠀⠀⠈⠙⢧⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡇⠈⢢⣦⡀⢀⢀⡤⢋⣀⠀⠀⠀⠀⣀⣤⠾⠛⠉⠀⠀⣀⣀⣠⣤⣶⣾⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⢱⠊⠉⢉⣹⠿⣦⠀⠀⢠⡄⡤⢀⣑⣄⠀⠀⠀
⠀⠀⠀⠀⢸⣿⡇⠀⠀⠙⠿⠟⠋⠉⣠⡧⠂⢀⡴⢞⣉⣤⠴⠶⠞⢛⠛⠉⣉⣁⣠⠔⢹⡀⠀⠀⢆⡒⠢⣤⣄⣀⣀⣠⣤⣧⠖⠋⠁⠀⠹⡆⢀⡞⣰⠀⠀⠀⠈⠀⠀⠀
⠀⠀⠀⣸⡿⠟⠛⠀⠀⠀⠀⠀⢀⣴⠏⣠⣾⠿⠚⠋⠁⠀⠀⠠⢦⣌⣫⡉⠙⠛⠋⠀⠸⣷⣀⡀⠀⠀⠉⠉⠉⠉⠉⠉⢹⠇⠀⠀⠀⠀⠀⢧⠊⣰⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠲⠯⣀⡀⠀⠀⠀⠀⠀⠀⠀⠘⣧⠞⠋⠀⣀⣠⣤⣤⠄⠀⠀⠀⠙⢷⣻⣄⠀⠀⠀⠀⠈⠉⢙⣲⠆⠀⠀⠀⠀⠀⠀⡘⠀⠀⠀⠀⠀⠀⠀⡴⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢏⣳⣶⠀⠀⠀⣀⣄⣀⣹⡶⡒⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣙⠕⠀⡀⠀⠀⣴⡞⠋⠁⠀⠀⠀⠀⠀⠀⡰⠁⠀⠀⠀⠀⠀⣀⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠠⠛⣿⠀⢀⡼⢋⡤⠛⠐⠂⠹⠭⠤⠶⢶⣀⡤⠤⢤⣀⣈⠬⠗⠒⣾⠻⢶⡐⣿⠛⠀⠀⠀⠀⠀⠀⢀⠔⠁⠀⠀⠀⠀⣠⠖⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡼⣹⣠⣾⣟⣁⠤⠤⠒⠒⠒⠦⠠⣀⠀⠀⠈⠙⠲⢤⣈⠙⠲⢤⣀⠀⠀⠙⡟⠑⠠⠄⠀⠠⠤⠒⠁⠀⠀⣀⣤⠶⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣼⣴⣿⣿⠟⠉⠀⠀⠀⠀⠸⣶⠂⠀⠀⠉⠒⢄⠀⠀⠀⠈⠳⣤⣀⠉⢻⢀⢀⣴⡄⠀⠀⠀⠀⠀⣴⢂⠮⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣼⣿⡿⠋⠀⣄⠀⠀⣠⡄⠀⠀⠁⠀⢠⣤⣆⡀⠀⢳⡀⠀⠀⠀⠈⢻⣿⡿⠯⠀⠙⠁⠀⢤⣼⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣸⡿⠋⠀⠀⢹⡿⣟⠀⠘⠉⣠⣗⡆⠀⠐⠛⠇⠀⠀⠀⢷⠀⠀⠀⠀⠀⠉⢿⡄⠀⠀⡷⠄⠈⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣰⠟⠁⡄⠀⠀⣨⡄⠈⠀⠀⠀⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠈⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢠⠃⠀⢻⡿⡅⠀⠙⠛⠀⠀⠀⠀⢹⣇⡀⠀⠀⠀⠀⠀⠀⢀⠏⠀⠀⠀⠀⠀⠀⠀⠘⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣳⣄⣀⣀⣀⠤⠔⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠈⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⡾⠲⠶⣤⣄⣤⣤⣤⣤⡿⠛⠿⡴⠾⠟⢻⡆⠀⠄⠄
⠀⠀⠀⣼⠁⠀⠀⠀⠉⠁⠀⢀⣿⠑⡿⣿⠿⣷⣥⣥⣷⡀⠀⠀
⠀⠀⠀⢹⡶⠀⠀⠀⠁⠀⠀⠈⢯⣡⣿⣿⣀⣰⣿⣦⢂⡏⠀⠀
⠀⠀⢀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠹⣍⣭⣾⠁⠀⠀
⠀⣀⣸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣸⣧⣤⡀
⠈⠉⠹⣏⡁⠀⢸⣿⠀⠀⠀⢀⡀⠀⠀⠀⣿⠆⠀⢀⣸⣇⣀⠀
⠀⠐⠋⢻⣅⡄⢀⣀⣀⡀⠀⠯⠽⠂⢀⣀⣀⡀⠀⣤⣿⠀⠉⠀
⠀⠀⠴⠛⠙⣳⠋⠉⠉⠙⣆⠀⠀⢰⡟⠉⠈⠙⢷⠟⠈⠙⠂⠀
⠀⠀⠀⠀⠀⢻⣄⣠⣤⣴⠟⠛⠛⠛⢧⣤⣤⣀⡾`,
    
    `⠀⠀⠀⠀⢀⠠⠤⠀⢀⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠐⠀⠐⠀⠀⢀⣾⣿⡇⠀⠀⠀⠀⠀⢀⣼⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⠀⠀⠀⠀⣴⣿⣿⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣇⠀⠀⢀⣾⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠐⠀⡀
⠀⠀⠀⠀⢰⡿⠉⠀⡜⣿⣿⣿⡿⠿⢿⣿⣿⡃⠀⠀⠂⠄⠀
⠀⠀⠒⠒⠸⣿⣄⡘⣃⣿⣿⡟⢰⠃⠀⢹⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠚⠉⠀⠊⠻⣿⣿⣿⣿⣿⣮⣤⣤⣿⡟⠁⠘⠠⠁⠀⠀
⠀⠀⠀⠀⠀⠠⠀⠀⠈⠙⠛⠛⠛⠛⠛⠁⠀⠒⠤⠀⠀⠀⠀
⠨⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠀⠀⠀⠀⠀⠀
⠁⠃⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `  ▲
 ▲▲▲
▲▲▲▲▲
 ▲▲▲
  ▲`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢤⠤⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣀⣀⣀⡜⠻⠿⢾⣷⠹⠀⠀⠀⠀⣀⣤⣤⡀⠀⠀⠀⠀
⠀⠀⠀⢠⡎⠁⠀⠀⠃⠀⠀⠀⠉⠀⠀⠀⡠⠞⠛⠛⠻⢽⠀⠀⠀⠀
⠀⠀⠀⠸⣷⡀⠀⢀⠀⢂⠀⡀⠀⠀⠀⠜⠀⠀⠀⠀⡀⠸⠀⠤⢄⠀
⠀⠀⠀⠀⠙⣗⣄⠀⠠⡀⢢⠃⠀⢸⠌⠀⡠⢊⠀⠊⠀⠀⠀⠀⠀⡇
⠀⠀⠀⣀⣀⣈⣲⣕⣦⡈⠢⣻⡀⡎⢀⣴⡢⠑⠂⠁⠀⠀⠀⠀⡠⠃
⠀⣴⠿⠽⠏⠀⠀⠀⠈⠉⢒⣺⣷⣗⣉⣁⣀⣀⣀⠀⠠⠤⠐⠈⠀⠀
⢸⠀⠀⠀⠀⠀⠀⠀⢀⠠⡖⠁⣿⢳⡬⡁⠒⠒⠤⢄⡀⠀⠀⠀⠀⠀
⠈⢦⡀⠀⠀⡀⠄⠂⠁⠊⠀⢰⣯⡏⠎⢌⠑⠀⠀⠀⠈⠑⢄⠀⠀⠀
⠀⠀⠉⡻⠀⠀⠀⠀⠀⠀⣲⡟⡟⠀⠀⠀⠢⡀⠀⠀⠀⠀⢸⠀⠀⠀
⠀⠀⠀⢧⣤⡄⡀⠀⢀⡔⣽⠃⢧⡄⠀⠀⠀⠰⣀⠀⠀⣀⠞⠀⠀⠀
⠀⠀⠀⠈⠳⠬⠥⠔⠋⡜⡌⠀⠘⣿⣦⣀⠀⡀⡇⠉⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⠜⡰⠀⠀⠀⠈⠛⠯⠥⠒⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡠⠊⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣛⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠋⠀⠀⠙⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀⠀⠀⠀⠀⠙⢿⣦⡀⢀⣀⢀⣀⣀⣠⣤⣀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⠀⠀⠀⠙⠿⠿⠟⠛⠛⠋⠉⠉⠛⣧⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠀⠀⠀⠀⣀⣤⣶⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡿⠀
⠀⣠⣶⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⠁⠀
⢸⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠀⠀⠀
⢸⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⠀⠀⠀
⠀⠙⠿⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⠀⠀
⠀⠀⠀⠀⠉⠛⠿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀
⠀⠀⠀⠀⠀⠀⠀⠘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⣿⡆⠀⠀⠀⠀⠀⠀⠀⣠⣶⣶⣦⣤⣤⣄⣀⣀⣤⣿⡇
⠀⠀⠀⠀⠀⠀⠀⠀⢹⡇⠀⠀⠀⠀⠀⣠⣾⠏⠀⠀⠀⠈⠉⠉⠙⠛⠉⠟⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣄⠀⠀⣠⣾⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠥⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁⠀⢠⣄⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀⠀⢀⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀⠒⠻⠿⣿⡿⠿⠓⠂⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⣿⡿⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⡿⢻⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⢀⣼⠀⠀⠀⠹⣿⣟⠿⠿⠿⡿⠋⠀⠘⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣇⣀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣦⣤⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣠⣽⣿⡿⠟⠃⠀⠀⠀
⠀⠀⠀⠀⠀⢰⠿⠛⠻⢿⡇⠀⠀⠀⣰⣿⠏⠀⠀⢀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣾⣿⠿⢿⣷⣀⢀⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠠⠔⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⢀⠅⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠊⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⣶⡄
⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⡴⠖⢂⣽⣿⣿⣷⣔⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠟
⠀⠀⠀⠀⣀⣤⡶⢿⣋⣥⣤⣶⣿⣿⣿⣿⣿⣿⣿⣶⣤⣄⣀⡀⢀⣠⣾⠿⠋⠀
⠀⢀⣴⣿⠟⠉⠀⠀⠀⠈⠉⠛⠻⣿⣿⣿⣿⡿⠛⠋⠉⣀⣤⠶⠟⠋⠁⠀⠀⠀
⢰⣿⡟⠁⠀⠀⠀⣷⠀⠀⠀⠀⠀⠈⣿⣿⣟⣀⡤⠖⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀
⠘⠿⣧⣀⡠⠤⢾⣿⣷⠤⠄⠀⠀⠀⢹⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⠀⠀⠀⡿⠁⠀⠀⠀⠀⠀⠈⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⠀⠀⠀⠀⠀⠀⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  `,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⢀⣠⠤⣶⣶⣤⣀⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⠟⢦⣤⡄⠒⠋⠁⠀⠀⢻⡝⢧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⢿⡏⠀⢀⡀⠀⠀⠀⠀⠀⢷⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠘⠃⠀⠀⠀⠀⠀⣸⣸⠃
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠃⠁⠉⢳⣴⢻⣽⣟⢦⠘⠃⠀⠀⠀⠀⠀⠀⠀⢀⡿⠃⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠋⠐⠉⠙⣿⢿⡇⠀⠀⣀⡀⠀⠀⢀⡴⣿⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢾⣄⠀⠀⠀⠀⠀⣰⠟⣽⠁⠀⣀⠓⠃⠀⢠⡞⣱⠃⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣾⣿⣧⣦⣤⣤⡔⢋⠈⠁⠀⠀⠀⠀⠀⠀⠏⡼⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⠀⠀⠀⢸⣻⣿⣿⣯⠟⠋⠀⠀⠀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣞⣳⠀⠀⠀⠀⠀⠙⠛⠉⠀⠀⠀⢠⡀⢠⡄⠀⢀⡾⡯⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⢀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⣡⡾⢋⡼⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠄⠉⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣄⣸⢸⢠⡆⠀⠀⠀⠀⠀⠰⠞⠁⠰⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⣀⣠⡽⠛⠘⢿⣥⣤⣤⣤⣀⠀⠤⠠⢤⢤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣠⠶⣿⡛⠁⠀⠉⠉⠉⠙⣿⣦⢠⣰⠚⣋⣉⣁⣀⣤⠤⣶⣫⡤⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠈⠓⠚⠿⠯⠭⠭⠭⠤⠼⠏⢹⢾⠿⠿⠟⠓⠒⠚⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠀⢸⣼⠀⠀⠀⠸⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⡄⢠⡏⠀⠘⣿⠀⠀⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡞⣤⠏⠀⠀⠀⡿⠀⠀⠀⢴⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣾⡾⠃⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣸⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡤⡶⡦⢤⣀⡴⠋⣥⣍⡻⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⢿⠀⠠⣶⠀⠀⠀⠀⠀⠀⠀⠀⢀⡞⣥⣾⣷⣷⣶⡝⠂⠈⠀⠘⠓⢻⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⠘⣆⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⢸⣸⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⣔⢸⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠘⣆⠹⣆⠀⢠⡆⠀⢀⡀⠈⠁⠀⢸⠐⣿⣿⡀⠀⠀⠀⠀⢀⢠⣶⣟⠟⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠘⠫⢘⢧⣼⣷⣂⡈⠉⠀⢀⣀⡌⢧⠻⣿⣷⡀⠀⠀⠀⠨⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⢉⣿⡟⠿⠥⣶⣟⣉⣁⣠⡤⠴⠖⠙⠟⣴⣀⠀⣽⡿⣳⠇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡴⠃⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠓⠦⢤⣈⣨⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣀⣀⣟⣦⣤⡄⠀⠀⠀⠀⠀⠀⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⡿⠻⢧⠀⠀⠀⠀⠀⢐⠃⢭⠀⠀⠀⠀⠀⠀⠀⢀⠤⠤⠤⢄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡲⠀⠀⣹⠀⠀⠀⠀⠀⠀⡴⠃⠀⣀⣀⡀⠙⢆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠁⠀⠀⠀⠇⠀⠀⠀⠀⠀⡎⠀⢰⠃⣀⣸⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠐⣶⠒⠒⠴⠴⠴⠴⠶⠋⠁⠀⠀⠀⠀⠘⣖⠄⠀⠀⢸⠀⠀⠳⣄⣀⣀⡠⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠈⠢⡑⠄⢌⢦⡀⠀⠀⠀⠀⢠⠖⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠙⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⣌⠂⠫⡉⠑⠚⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠠⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡀⡀⣀⣄⠤⠴⠟⠘⠃⠀⠀⠀⠸⡆⣀⣤⠀⠀⠀
⠀⠀⢀⣴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢘⡏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⣿⣿⠁⠀⠀⠀
⢀⣴⠟⠀⠀⠀⠀⡠⢄⣖⣒⢦⠀⠀⠀⠀⠀⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠘⠃⠘⠂⠀⠀⠀
⠛⠛⠛⠉⠉⠉⠉⠉⠁⠀⠀⠀⠓⣄⠀⠀⠌⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⢩⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⠤⠤⠤⠤⡄⠀⠀⠀⠀⠀⠀⠀⠙⠦⡨⡇⠀⠀⠀⠀⠀⠀⠀⠀⠠⡏⠀⠸⡄⠀⠀⠀⠀⠀
⠀⡜⠁⠀⡤⠤⢤⠙⡆⠀⠀⢀⡀⠀⠀⠀⠀⢹⠛⠀⠀⠀⠀⠐⢖⡒⠊⠉⠀⠀⠀⠀⠁⠐⢒⠞⠃
⠀⡇⠀⠀⢇⣉⣉⡜⠁⠀⠀⡞⠱⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⡦⠀⠀⠀⠀⠀⠀⢸⠁⠀
⠀⠳⣄⠀⠀⠀⠀⠀⢀⡠⠤⠇⠀⠉⠉⢩⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⢀⠇⠀⡤⠞⠣⢀⠀⠇⠀⠀
⠀⠀⠀⠉⠉⠉⠁⠀⠀⠈⡇⢀⠖⠢⣀⠸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠯⠊⠁⠀⠀⠀⠀⠈⠪⠆⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣮⠒⠁⠀⠀⠀⠈⠲⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`
  ],
  
  medium: [
    // Medium patterns for sides
    `⣠⣤⣤⡤⠤⢤⣤⣀⡀⠀⠐⠒⡄⠀⡠⠒⠀⠀⢀⣀⣤⠤⠤⣤⣤⣤⡄
⠈⠻⣿⡤⠤⡏⠀⠉⠙⠲⣄⠀⢰⢠⠃⢀⡤⠞⠋⠉⠈⢹⠤⢼⣿⠏⠀
⠀⠀⠘⣿⡅⠓⢒⡤⠤⠀⡈⠱⣄⣼⡴⠋⡀⠀⠤⢤⡒⠓⢬⣿⠃⠀⠀
⠀⠀⠀⠹⣿⣯⣐⢷⣀⣀⢤⡥⢾⣿⠷⢥⠤⣀⣀⣞⣢⣽⡿⠃⠀⠀⠀
⠀⠀⠀⠀⠈⢙⣿⠝⠀⢁⠔⡨⡺⡿⡕⢔⠀⡈⠐⠹⣟⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢼⣟⢦⢶⢅⠜⢰⠃⠀⢹⡌⢢⣸⠦⠴⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⣿⣇⡬⡌⢀⡟⠀⠀⠀⢷⠀⣧⢧⣵⣿⠂⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⢻⠛⠋⠉⠀⠀⠀⠀⠈⠉⠙⢻⡏⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠄⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⠀⠀⢸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⣿⣿⣿⣧⡀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠰⠶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡶⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣿⣿⣿⡿⠋⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡿⠀⢰⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠇⠀⣾⣿⢹⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠈⣿⢀⣼⣿⠃⠀⢻⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣀⣠⣿⣿⡿⠁⠀⠀⠀⠻⣿⣶⣤⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠠⣴⣶⣾⣿⣿⣿⣛⠁⠀⠀⠀⠀⠀⠀⠀⢙⣻⣿⣿⣷⣶⣦⡤
⠀⠀⠀⠀⠀⠀⠀⠈⠉⣿⡟⠿⣿⣷⣦⠀⠀⠀⠀⣀⣶⣿⡿⠟⠋⠉⠉⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣧⠀⠀⠙⣿⣷⡄⠀⣰⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⡄⠀⠀⠘⣿⣷⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣧⠀⠀⠀⢹⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣠⣼⣿⣿⣿⣿⣿⣷⣤⡀⠘⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡧⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⠙⠻⢿⣿⣿⣿⣿⣿⣿⠿⠛⠉⢹⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⡿⠃⠀⠀⠀⢸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠃⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⠀⠀⠀⠀⠀⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠠⡧⠀⠀⠀⠄⠀⣆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⡄⠀⠀⠀⢺⠂⠀⠀⠀⢀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣧
⠀⠐⠗⠀⠀⠀⠀⠁⠀⠀⠀⣼⣿⡏⣿⣷⡀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠐⠺⠂⠀⠀⠀⠀⠀⠀⠄
⠤⣤⣤⣤⣤⣤⣤⣤⣤⣿⣿⠇⠀⢿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒
⠀⠀⠘⢿⣿⣿⣟⠛⠛⠛⠛⠀⠀⠀⠛⠛⠛⠛⠋⠉⠉⠉
⠀⠀⠁⠀⠈⠛⣿⣿⣦
⠀⠀⠀⠀⠀⠀⠀⢹⣿⡿
⠀⠀⠀⠠⡧⠀⠀⣾⣿⠁⢀⣤⣾⣦⡀
⠀⠠⠀⠀⠀⠀⣸⣿⢇⣶⣿⠟⠙⠻⣿⣄
⠀⠀⠀⠀⠀⢠⣿⣿⠿⠋⠁⠀⠀⠀⠀⠉⠳⡄
⠀⠀⠀⠀⠀⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈`,
    
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣭⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⠤⢤⣀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠒⢋⣉⣀⣠⣄⣀⣈⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣯⠴⠚⠉⠉⠀⠀⠀⠀⣤⠏⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⡇⠁⠀⠀⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⡿⠿⢛⠁⠁⣸⠀⠀⠀⠀⠀⣤⣾⠵⠚⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⢦⡀⠀⣠⠀⡇⢧⠀⠀⢀⣠⡾⡇⠀⠀⠀⠀⠀⣠⣴⠿⠋⠁⠀⠀⠀⠀⠘⣿⠀⣀⡠⠞⠛⠁⠂⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡈⣻⡦⣞⡿⣷⠸⣄⣡⢾⡿⠁⠀⠀⠀⣀⣴⠟⠋⠁⠀⠀⠀⠀⠐⠠⡤⣾⣙⣶⡶⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣂⡷⠰⣔⣾⣖⣾⡷⢿⣐⣀⣀⣤⢾⣋⠁⠀⠀⠀⣀⢀⣀⣀⣀⣀⠀⢀⢿⠑⠃⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡦⠴⠴⠤⠦⠤⠤⠤⠤⠤⠴⠶⢾⣽⣙⠒⢺⣿⣿⣿⣿⢾⠶⣧⡼⢏⠑⠚⠋⠉⠉⡉⡉⠉⠉⠹⠈⠁⠉⠀⠨⢾⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠂⠐⠀⠀⠀⠈⣇⡿⢯⢻⣟⣇⣷⣞⡛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣆⠀⠀⠀⠀⢠⡷⡛⣛⣼⣿⠟⠙⣧⠅⡄⠀⠀⠀⠀⠀⠀⠰⡆⠀⠀⠀⠀⢠⣾⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⢶⠏⠉⠀⠀⠀⠀⠀⠿⢠⣴⡟⡗⡾⡒⠖⠉⠏⠁⠀⠀⠀⠀⣀⢀⣠⣧⣀⣀⠀⠀⠀⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢴⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⣠⣷⢿⠋⠁⣿⡏⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣿⢭⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⢏⡵⠛⠀⠀⠀⠀⠀⠀⠀⣀⣴⠞⠛⠀⠀⠀⠀⢿⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⢿⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⠛⣲⡏⠁⠀⠀⠀⠀⠀⢀⣠⡾⠋⠉⠀⠀⠀⠀⠀⠀⢾⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠟⠀⢰⡯⠄⠀⠀⠀⠀⣠⢴⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠁⠁⠀⠘⠧⠤⢤⣤⠶⠏⠙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠂⢀⣀⣀⠤⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠄⠠`,
    `⠀⡠⣄⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣰⠁⠀⠀⠈⠑⢷⡴⠅⠑⠉⠑⠒⠃⠈⠑⠤⠤⠶⠶⠶⣤⣄⠀⠀⠀⠀⠀⠀
⡇⠙⣄⠀⠀⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠈⢣⠀⠀⠀⠀⠀
⠅⠀⢈⠕⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⢻⠀⠀⠀⠀⠀
⡇⠠⡮⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢉⠀⡸⠀⠀⠀⠀⠀
⠻⢸⡀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⣶⠃⠀⠀⠀⠀⠀
⠀⡧⠀⠀⢿⣿⠿⠀⠀⠀⠀⠀⠀⣠⣶⣆⠀⠀⠀⠀⠀⠀⠹⠀⣐⡦⢤⣄⠀
⠀⡗⠀⠀⠀⠈⠁⠀⠒⠂⠀⠀⠘⠾⣿⣫⠀⠀⠀⠀⠀⠀⣜⣿⠁⠀⠀⢹⡇
⠀⠻⣥⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣌⣷⡁⠀⠀⠀⢘⡇
⠀⠀⠈⠛⢦⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠁⠀⠽⣷⣄⣴⡿⣿
⠀⠀⠀⠀⢠⣾⠙⠙⠓⠲⠲⠤⠤⠤⡤⡤⡴⠪⠟⠂⠀⠀⠀⠀⠈⢿⡤⡲⠁
⠀⠀⠀⠀⣽⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢐⣿⠀⠀
⠀⠀⠀⠘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⠀⠀
⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⠀⠀
⠀⠀⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⣤⠀⠀⠀⡸⠀⠀
⠀⠀⠀⠀⠀⢯⡀⠀⠀⠀⣔⡶⠶⠶⢶⡀⠀⠀⠀⢺⡿⡉⠨⣿⡭⠛⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠓⠪⠭⠭⠏⠀⠀⠀⠈⠷⠶⠶⠶⠋⠁⠀⠀⠈⠀⠀⠀⠀⠀`,
    
    `0100101001
     1001110101
     0100101111
     1011010001
     0110101010`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡿⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠇⢷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⣿⠀⠀⠀⠀⠀⠀⢀⣀⣀⣴⠇⠀⠸⣦⣀⣀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠀⣿⡆⠀⠀⠀⠉⠙⠛⠛⠛⢧⡄⠀⢠⡼⠛⠛⠛⠋⠉
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡇⠀⢸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⣸⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡿⠀⠀⠀⢿⡆⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣴⠟⠀⠀⠀⠀⠀⠫⣦⣤⣄⣀⣀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀
⠰⠶⠶⠶⠾⢿⣿⣿⣿⣏⣛⣉⠀⠀⠀⠀⠀⠀⠀⠀⠀⣈⣉⣩⣿⣿⣿⡿⠶⠶⠶⠶⠄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠻⣦⠀⠀⠀⠀⠀⣴⠿⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀⠀⠀⢰⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠀⠀⠀⣾⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀⢸⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠀⣾⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣷⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣄⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠋⠀⠘⣇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠇⠀⠀⠀⢸⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⠀⠀⠀⠀⢸⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠇⠀⠀⠀⠀⢸⠇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡎⠀⠀⠀⠀⠀⢸⠀⠀⠀
⠀⠀⢀⣀⣀⣀⠀⠀⠀⠀⠀⢀⣀⣤⡤⠤⠤⠤⠤⢤⣤⣀⡤⢖⡿⠛⠉⢳⠀⠀⠀⠀⠀⢸⠀⠀⠀
⠀⢼⠁⠉⠉⠛⠻⢭⡓⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣏⠀⠀⠀⢸⠀⠀⠀⠀⠀⡤⠀⠀⠀
⠀⠸⡄⠀⠀⠀⠀⢸⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠂⠀⠀⡜⠀⠀⠀⠀⢀⡇⠀⠀⠀
⠀⠀⢷⠀⠀⠀⠠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢣⢠⠏⠀⠀⠀⠀⢸⠃⠀⠀⠀
⠀⠀⠈⢧⠀⢀⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀
⠀⠀⠀⠈⢳⡈⠁⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⣶⣶⣦⠀⠀⢹⠀⠀⠀⠀⠀⡎⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⢠⣾⣟⣹⡄⠀⠀⠀⠀⡀⠀⣿⣿⣿⡇⠀⢈⣧⠤⠤⠶⠶⢷⠒⠒⠂⠀
⠀⠀⢀⣀⣠⡧⠄⠀⠀⠀⣾⣿⣿⣿⠇⠀⠀⠀⠙⠁⠀⠙⠻⠿⠃⠀⠨⣼⣤⣀⡀⠀⠈⢧⠀⠀⠀
⠘⠉⠁⠀⢸⣤⡤⠀⠀⠀⠛⢿⡿⠋⠀⠀⠀⠀⠴⠦⠀⠀⠀⠀⠀⠐⣲⣯⡀⠀⠈⠙⠓⠺⣧⣄⡀
⠀⣀⡤⠚⠉⢳⡴⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⠀⠈⠓⢦⡀⠀⠀⢸⠀⠈
⠀⠁⠀⢀⡔⠉⠙⡶⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠴⠚⠁⠀⠀⠀⠀⠀⠀⠈⠓⠆⠀⡇⠀
⠀⠀⠰⠋⠀⠀⢸⡇⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀
⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡎⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠙⢆⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠄⠀⢰⠇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠶⠺⣇⠀⣀⡜⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⡄⠀⠀⠀⠹⡟⠒⢢⡀⠀⠀⠀⠀⢀⡏⠀⠀⠀⠈⠉⠉⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣄⠀⠀⢀⡇⠀⠀⠻⣄⠀⠀⠀⡸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⠶⠋⠀⠀⠀⠀⠈⣣⠶⠖⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    
    `⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁⠀⢠⣄⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀⠀⢀⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀⠒⠻⠿⣿⡿⠿⠓⠂⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⣿⡿⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⡿⢻⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⢀⣼⠀⠀⠀⠹⣿⣟⠿⠿⠿⡿⠋⠀⠘⣿⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣇⣀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣦⣤⣀⠀⠀
⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣠⣽⣿⡿⠟⠃
⠀⠀⠀⠀⠀⢰⠿⠛⠻⢿⡇⠀⠀⠀⣰⣿⠏⠀⠀⢀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣾⣿⠿⢿⣷⣀⢀⣿⡇⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀`
  ]
};

function getRandomPattern(size) {
  const patterns = asciiArtPatterns[size];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

function displayAsciiArtInCorners() {
  // Top left - small pattern
  const topLeft = document.getElementById('asciiTopLeft');
  if (topLeft) {
    topLeft.textContent = getRandomPattern('small');
  }
  
  // Top right - small pattern
  const topRight = document.getElementById('asciiTopRight');
  if (topRight) {
    topRight.textContent = getRandomPattern('small');
  }
  
  // Bottom left - medium pattern
  const bottomLeft = document.getElementById('asciiBottomLeft');
  if (bottomLeft) {
    bottomLeft.textContent = getRandomPattern('medium');
  }
  
  // Bottom right - small pattern
  const bottomRight = document.getElementById('asciiBottomRight');
  if (bottomRight) {
    bottomRight.textContent = getRandomPattern('small');
  }
  
  console.log('ASCII art displayed in corners');
}

// Display ASCII art on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, displaying ASCII art');
  displayAsciiArtInCorners();
});

// Also try to display immediately
displayAsciiArtInCorners();

// Change ASCII art every 45 seconds
setInterval(displayAsciiArtInCorners, 45000);