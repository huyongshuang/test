document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.createElement('div');
  cursor.className = 'gif-cursor normal';
  document.body.appendChild(cursor);

  let isSelecting = false;
  let isTextMode = false;
  let isContextMenuVisible = false;

  // 1. 精准定位光标（无偏移）
  function updateCursorPosition(e) {
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }
  document.addEventListener('mousemove', updateCursorPosition, { passive: true });

  // 2. 处理可点击元素
  const clickableSelectors = 'a, button, .btn, [role="button"], i.icon, .iconfont, input[type="button"], input[type="submit"]';

  document.addEventListener('mouseover', function(e) {
    if (isSelecting || isTextMode || isContextMenuVisible) return;
    const target = e.target.closest(clickableSelectors);
    if (target) {
      cursor.classList.remove('normal', 'text');
      cursor.classList.add('clickable');
    } else {
      cursor.classList.remove('clickable', 'text');
      cursor.classList.add('normal');
    }
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (isSelecting || isTextMode || isContextMenuVisible) return;
    const target = e.target.closest(clickableSelectors);
    if (target) {
      cursor.classList.remove('clickable');
      cursor.classList.add('normal');
    }
  }, true);

  // 3. 处理文本选择和输入框
  document.addEventListener('selectionchange', function() {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      isSelecting = true;
      cursor.classList.remove('normal', 'clickable');
      cursor.classList.add('text');
    } else {
      isSelecting = false;
      const target = document.elementFromPoint(event?.clientX || 0, event?.clientY || 0);
      const isClickable = target?.closest(clickableSelectors);
      const isTextInput = target?.closest('input, textarea, [contenteditable="true"]');
      
      cursor.classList.remove('text');
      if (isTextInput) {
        cursor.classList.add('text');
      } else if (isClickable) {
        cursor.classList.add('clickable');
      } else {
        cursor.classList.add('normal');
      }
    }
  });

  document.addEventListener('focusin', function(e) {
    const textElements = ['INPUT', 'TEXTAREA'];
    if (textElements.includes(e.target.tagName) || e.target.isContentEditable) {
      isTextMode = true;
      cursor.classList.remove('normal', 'clickable');
      cursor.classList.add('text');
    }
  }, true);

  document.addEventListener('focusout', function(e) {
    const textElements = ['INPUT', 'TEXTAREA'];
    if (textElements.includes(e.target.tagName) || e.target.isContentEditable) {
      isTextMode = false;
      const target = document.elementFromPoint(event?.clientX || 0, event?.clientY || 0);
      const isClickable = target?.closest(clickableSelectors);
      
      cursor.classList.remove('text');
      if (isClickable) {
        cursor.classList.add('clickable');
      } else {
        cursor.classList.add('normal');
      }
    }
  }, true);

  // 4. 处理选中文本菜单（Edge 等浏览器）
  document.addEventListener('mouseup', function(e) {
    if (e.button === 0) {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
          isContextMenuVisible = true;
          cursor.classList.add('disabled');
        } else {
          isContextMenuVisible = false;
          cursor.classList.remove('disabled');
        }
      }, 100);
    }
  });

  // 5. 处理鼠标离开页面
  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = 0;
  });

  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = 1;
  });

  // 6. 窗口焦点/大小变化
  window.addEventListener('blur', () => {
    cursor.style.opacity = 0;
  });

  window.addEventListener('focus', () => {
    cursor.style.opacity = 1;
  });

  window.addEventListener('resize', () => {
    updateCursorPosition({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
  });
});