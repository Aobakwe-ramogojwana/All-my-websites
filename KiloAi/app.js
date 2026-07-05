/**
 * Kilo Code – Main Application Logic
 */

(function() {
  'use strict';

  // ===== State =====
  const state = {
    currentMode: 'code',
    currentPanel: 'chat',
    messages: [],
    pendingTool: null,
    toolApproveCallback: null,
    settings: {
      apiProvider: 'anthropic',
      apiKey: '',
      model: 'claude-sonnet-4-5',
      autoApprove: true,
      showToolDetails: true,
      soundNotif: false,
      maxTokens: 8096,
      theme: 'dark',
      fontSize: 13,
      customInstructions: '',
      personalityStyle: 'balanced',
      tone: 50,
      reasoningDepth: 'balanced'
    },
    contextFiles: [],
    history: [],
    isStreaming: false,
    streamedContent: ''
  };

  // ===== DOM Elements =====
  const elements = {
    // Panels
    activityBtns: document.querySelectorAll('.activity-btn'),
    panels: document.querySelectorAll('.panel'),

    // Mode selector
    modeDropdownBtn: document.getElementById('mode-dropdown-btn'),
    modeDropdown: document.getElementById('mode-dropdown'),
    modeOptions: document.querySelectorAll('.mode-option'),
    currentModeName: document.getElementById('current-mode-name'),

    // Chat
    messagesArea: document.getElementById('messages-area'),
    chatInput: document.getElementById('chat-input'),
    btnSend: document.getElementById('btn-send'),
    btnClear: document.getElementById('btn-clear'),
    btnNewTask: document.getElementById('btn-new-task'),
    tokenCount: document.getElementById('token-count'),
    modelBadge: document.getElementById('model-badge'),
    contextPills: document.getElementById('context-pills'),

    // Tabs
    tabBar: document.getElementById('tab-bar'),
    tabContent: document.getElementById('tab-content'),

    // Settings
    apiProvider: document.getElementById('api-provider'),
    apiKeyInput: document.getElementById('api-key-input'),
    modelSelect: document.getElementById('model-select'),
    autoApprove: document.getElementById('auto-approve'),
    showToolDetails: document.getElementById('show-tool-details'),
    soundNotif: document.getElementById('sound-notif'),
    maxTokens: document.getElementById('max-tokens'),
    themeSelect: document.getElementById('theme-select'),
    fontSize: document.getElementById('font-size'),
    fontSizeVal: document.getElementById('font-size-val'),
    customInstructions: document.getElementById('custom-instructions'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    btnToggleKey: document.getElementById('btn-toggle-key'),

    // Personality settings
    personalityStyle: document.getElementById('personality-style'),
    toneSlider: document.getElementById('tone-slider'),
    toneValue: document.getElementById('tone-value'),
    reasoningDepth: document.getElementById('reasoning-depth'),

    // File tree
    fileTree: document.getElementById('file-tree'),
    btnNewFile: document.getElementById('btn-new-file'),
    btnNewFolder: document.getElementById('btn-new-folder'),

    // History
    historyList: document.getElementById('history-list'),
    btnClearHistory: document.getElementById('btn-clear-history'),

    // MCP
    mcpList: document.getElementById('mcp-list'),
    btnAddMcp: document.getElementById('btn-add-mcp'),

    // Welcome cards
    wcNewTask: document.getElementById('wc-new-task'),
    wcOpenFile: document.getElementById('wc-open-file'),
    wcHistory: document.getElementById('wc-history'),
    wcSettings: document.getElementById('wc-settings'),
    modeCards: document.querySelectorAll('.mode-card'),

    // Modals
    toolApprovalModal: document.getElementById('modal-tool-approval'),
    btnApproveTool: document.getElementById('btn-approve-tool'),
    btnDenyTool: document.getElementById('btn-deny-tool'),
    toolNameBadge: document.getElementById('tool-name-badge'),
    toolParamsDisplay: document.getElementById('tool-params-display'),

    fileViewerModal: document.getElementById('modal-file-viewer'),
    fileViewerTitle: document.getElementById('file-viewer-title'),
    fileViewerContent: document.getElementById('file-viewer-content').querySelector('code'),

    diffViewerModal: document.getElementById('modal-diff-viewer'),
    diffViewerContent: document.getElementById('diff-viewer-content'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // ===== Mode Config =====
  const modeConfig = {
    code: {
      icon: '⌨',
      name: 'Code',
      desc: 'Write, modify, or refactor code',
      systemPrompt: 'You are Kilo Code, an expert coding assistant with a unique personality blend: Claude’s structured reasoning, Grok’s boldness and real-time awareness. You’re calm but not overly cautious, intelligent but not sterile, honest without being chaotic. You think carefully but speak with edge when needed. Help the user write, modify, or refactor code. Use tools to read, create, and edit files as needed. Be direct, insightful, and don\'t shy away from challenging ideas when appropriate.'
    },
    architect: {
      icon: '🏗',
      name: 'Architect',
      desc: 'Plan, design, or strategize',
      systemPrompt: 'You are Kilo Code in Architect mode - blending Claude’s deep long-context reasoning with Grok’s boldness. Focus on planning, design, and strategic thinking. Break down complex problems and create technical specifications with cultural awareness and evidence-based reasoning. Challenge ideas without feeding delusion, balancing freedom with responsibility.'
    },
    ask: {
      icon: '❓',
      name: 'Ask',
      desc: 'Explanations & documentation',
      systemPrompt: 'You are Kilo Code in Ask mode. Provide clear explanations, documentation, and educational responses. Blend deep reasoning with cultural awareness. Be honest without being chaotic, challenge ideas thoughtfully. No tool use required unless explicitly requested.'
    },
    debug: {
      icon: '🐛',
      name: 'Debug',
      desc: 'Troubleshoot & diagnose issues',
      systemPrompt: 'You are Kilo Code in Debug mode - systematic yet bold. Systematically troubleshoot issues, add logging, analyze errors, and identify root causes before proposing fixes. Stay grounded in evidence, think deeply about complex systems, and be culturally aware of how technology interacts with human contexts.'
    },
    orchestrator: {
      icon: '🎯',
      name: 'Orchestrator',
      desc: 'Multi-step project coordination',
      systemPrompt: 'You are Kilo Code in Orchestrator mode. Coordinate multi-step projects, break down large tasks, manage workflows, and track progress. Show deep long-context reasoning capabilities while maintaining real-time awareness. Be bold in your strategies but grounded in practical execution.'
    },
    review: {
      icon: '🔍',
      name: 'Review',
      desc: 'Review code changes',
      systemPrompt: 'You are Kilo Code in Review mode. Review code changes thoroughly, suggest improvements, identify potential issues, and ensure code quality. Be honest without being chaotic, challenge ideas constructively, and maintain a balance of freedom and responsibility.'
    }
  };

  // ===== Utility Functions =====
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatJson(obj) {
    return JSON.stringify(obj, null, 2);
  }

  function showToast(message, type = 'info') {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-msg">${escapeHtml(message)}</span>
      <span class="toast-close">×</span>
    `;
    toast.querySelector('.toast-close').onclick = () => toast.remove();
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function updateTokenCount(text) {
    // Rough token estimation
    const tokens = Math.ceil(text.length / 4);
    elements.tokenCount.textContent = `${tokens} tokens`;
  }

  // ===== Panel Switching =====
  function switchPanel(panelId) {
    state.currentPanel = panelId;

    elements.activityBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === panelId);
    });

    elements.panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${panelId}`);
    });
  }

  function initPanelSwitching() {
    elements.activityBtns.forEach(btn => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });
  }

  // ===== Mode Selection =====
  function setMode(mode) {
    if (!modeConfig[mode]) return;

    state.currentMode = mode;
    const config = modeConfig[mode];

    elements.currentModeName.textContent = config.name;
    elements.modeDropdownBtn.querySelector('.mode-icon').textContent = config.icon;

    elements.modeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.mode === mode);
    });

    elements.modeDropdown.classList.remove('open');
    elements.modeDropdownBtn.classList.remove('open');

    showToast(`Switched to ${config.name} mode`, 'success');
  }

  function initModeSelector() {
    elements.modeDropdownBtn.addEventListener('click', () => {
      elements.modeDropdown.classList.toggle('open');
      elements.modeDropdownBtn.classList.toggle('open');
    });

    elements.modeOptions.forEach(opt => {
      opt.addEventListener('click', () => setMode(opt.dataset.mode));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mode-dropdown-wrap')) {
        elements.modeDropdown.classList.remove('open');
        elements.modeDropdownBtn.classList.remove('open');
      }
    });
  }

  // ===== Message Rendering =====
  function renderWelcomeMessage() {
    if (elements.messagesArea.children.length === 0) {
      const welcome = document.createElement('div');
      welcome.className = 'chat-welcome';
      welcome.innerHTML = `
        <div class="logo-mini">⌨</div>
        <h2>Welcome to Kilo Code</h2>
        <p>Start a conversation by typing in the input below, or select a mode from the dropdown above.</p>
      `;
      elements.messagesArea.appendChild(welcome);
    }
  }

  function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.role}`;

    const avatarText = message.role === 'user' ? 'U' : 'K';
    const roleName = message.role === 'user' ? 'You' : 'Kilo Code';

    div.innerHTML = `
      <div class="message-header">
        <div class="message-avatar">${avatarText}</div>
        <span>${roleName}</span>
      </div>
      <div class="message-content ${message.streaming ? 'streaming-cursor' : ''}"></div>
    `;

    const contentDiv = div.querySelector('.message-content');

    if (message.role === 'assistant' && message.content) {
      contentDiv.innerHTML = marked.parse(message.content);
      // Add copy buttons to code blocks
      contentDiv.querySelectorAll('pre').forEach(pre => {
        const wrap = document.createElement('div');
        wrap.className = 'code-block-wrap';
        const btn = document.createElement('button');
        btn.className = 'copy-code-btn';
        btn.textContent = 'Copy';
        btn.onclick = () => {
          navigator.clipboard.writeText(pre.querySelector('code').textContent);
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        };
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
        wrap.appendChild(btn);
      });
    } else if (message.role === 'user') {
      contentDiv.textContent = message.content;
    }

    // Render tool use blocks
    if (message.toolUses && message.toolUses.length > 0) {
      message.toolUses.forEach(tool => {
        const toolBlock = document.createElement('div');
        toolBlock.className = `tool-use-block ${tool.expanded ? 'expanded' : ''}`;
        toolBlock.innerHTML = `
          <div class="tool-use-header">
            <span class="tool-use-icon">🔧</span>
            <span class="tool-use-name">${tool.name}</span>
            <span class="tool-use-status ${tool.status}">${tool.status}</span>
            <svg class="tool-use-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="tool-use-body">
            <div class="tool-params">${Object.entries(tool.params || {}).map(([k, v]) => `
              <div class="tool-param">
                <span class="tool-param-key">${escapeHtml(k)}:</span>
                <span class="tool-param-val">${escapeHtml(typeof v === 'object' ? formatJson(v) : String(v))}</span>
              </div>
            `).join('')}</div>
            ${tool.result ? `<div class="tool-result">${escapeHtml(typeof tool.result === 'object' ? formatJson(tool.result) : tool.result)}</div>` : ''}
          </div>
        `;

        toolBlock.querySelector('.tool-use-header').addEventListener('click', () => {
          toolBlock.classList.toggle('expanded');
          tool.expanded = !tool.expanded;
        });

        contentDiv.appendChild(toolBlock);
      });
    }

    return div;
  }

  function appendMessage(message) {
    const el = createMessageElement(message);
    elements.messagesArea.appendChild(el);
    elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
  }

  function updateLastMessage(message) {
    const lastMsg = elements.messagesArea.querySelector(`.message.${message.role}:last-child`);
    if (lastMsg) {
      const contentDiv = lastMsg.querySelector('.message-content');
      if (message.role === 'assistant' && message.content) {
        contentDiv.innerHTML = marked.parse(message.content);
        contentDiv.classList.remove('streaming-cursor');
      }
    }
  }

  // ===== Chat Input =====
  function handleSend() {
    const text = elements.chatInput.value.trim();
    if (!text || state.isStreaming) return;

    // Add user message
    const userMsg = { role: 'user', content: text };
    state.messages.push(userMsg);
    appendMessage(userMsg);

    elements.chatInput.value = '';
    updateTokenCount(text);

    // Call real API for AI response
    fetchAIResponse(text);
  }

  // ===== API Integration =====
  async function callAPI(endpoint, data = null, method = 'POST') {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      showToast(`API Error: ${error.message}`, 'error');
      throw error;
    }
  }

  async function fetchAIResponse(userText) {
    state.isStreaming = true;
    elements.btnSend.disabled = true;

    const aiMsg = {
      role: 'assistant',
      content: '',
      streaming: true,
      toolUses: []
    };
    state.messages.push(aiMsg);
    appendMessage(aiMsg);

    try {
      // Call API for real AI response
      const data = await callAPI('/message', {
        message: userText,
        mode: state.currentMode,
        settings: state.settings
      });

      // Stream the response
      let index = 0;
      const speed = 15;
      
      function streamChar() {
        if (index < data.content.length) {
          aiMsg.content += data.content[index];
          const lastEl = elements.messagesArea.querySelector('.message.assistant:last-child .message-content');
          if (lastEl) {
            lastEl.innerHTML = marked.parse(aiMsg.content);
            lastEl.classList.add('streaming-cursor');
          }
          elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
          index++;
          setTimeout(streamChar, speed);
        } else {
          // Done streaming
          aiMsg.content = data.content;
          aiMsg.streaming = false;
          const lastEl = elements.messagesArea.querySelector('.message.assistant:last-child .message-content');
          if (lastEl) {
            lastEl.classList.remove('streaming-cursor');
          }
          state.isStreaming = false;
          elements.btnSend.disabled = false;
        }
      }

      streamChar();

    } catch (error) {
      // Fallback to simulation if API fails
      console.warn('Falling back to simulated response');
      await fallbackSimulation(aiMsg);
    }
  }

  async function fallbackSimulation(aiMsg) {
    // Simulate streaming response with personality
    const responses = {
      code: `I've analyzed your request. Let me help you with that!\n\nHere's a code example:\n\n\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`\n\nThis demonstrates a simple greeting function. Let me know if you'd like me to expand on this or create more complex functionality! I'm thinking about how we could make this more robust - perhaps adding error handling or supporting different languages?`,
      architect: `I'll help you plan this out systematically. Let me think through the architecture...\n\n## Architecture Overview\n\n1. **Component Structure** - Break down into modular components with clear boundaries\n2. **Data Flow** - Define explicit data patterns that minimize coupling\n3. **API Design** - RESTful might be simpler, but GraphQL could offer more flexibility\n\nI'm considering the trade-offs here. Would you like me to elaborate on any of these points? I can dive deeper into specific architectural patterns that would fit your needs.`,
      ask: `Great question! Here's a comprehensive explanation:\n\nWhen working with JavaScript, understanding the **event loop** is crucial. It handles asynchronous operations through:\n\n- Call Stack\n- Task Queue  \n- Microtask Queue\n\nI think this is one of the most misunderstood concepts in JS, but it's absolutely fundamental. Let me know if you'd like more details on any specific aspect! I can break down real-world examples or common pitfalls.`,
      debug: `Let me help you debug this issue. First, let me analyze the problem:\n\n## Diagnostic Steps\n\n1. Check the error logs - look for patterns, not just single errors\n2. Identify the root cause - don't just fix symptoms\n3. Add debugging statements - target the right areas\n\n**Common causes include:**\n- Undefined variables\n- Async timing issues\n- Type mismatches\n\nI'm curious - can you share the specific error message or code that's causing issues? The more context you give, the better I can help you get to the bottom of this.`,
      orchestrator: `I'll help coordinate this multi-step task. Let me break it down:\n\n## Task Breakdown\n\n- [ ] Step 1: Requirements gathering - understand the real problem\n- [ ] Step 2: Design phase - create a scalable solution\n- [ ] Step 3: Implementation - build with quality\n- [ ] Step 4: Testing - ensure reliability\n\nI'm thinking about the most efficient path here. Which step would you like to start with? I can adapt the plan based on your priorities and constraints.`,
      review: `I'll review your code thoroughly. Here's what I look for:\n\n## Code Review Checklist\n\n- ✅ Code readability - will the next developer understand this?\n- ✅ Performance considerations - is this optimized for the use case?\n- ✅ Security best practices - are we exposing any vulnerabilities?\n- ✅ Error handling - what happens when things go wrong?\n- ✅ Test coverage - do we have the right tests?\n\nPlease share the code you'd like me to review! I promise to be honest but constructive, challenging your assumptions when appropriate while maintaining a balanced perspective.`
    };

    const response = responses[state.currentMode] || responses.code;
    let index = 0;
    const speed = 15;

    function streamChar() {
      if (index < response.length) {
        aiMsg.content += response[index];
        const lastEl = elements.messagesArea.querySelector('.message.assistant:last-child .message-content');
        if (lastEl) {
          lastEl.innerHTML = marked.parse(aiMsg.content);
          lastEl.classList.add('streaming-cursor');
        }
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
        index++;
        setTimeout(streamChar, speed);
      } else {
        // Done streaming
        aiMsg.content = response;
        aiMsg.streaming = false;
        const lastEl = elements.messagesArea.querySelector('.message.assistant:last-child .message-content');
        if (lastEl) {
          lastEl.classList.remove('streaming-cursor');
        }
        state.isStreaming = false;
        elements.btnSend.disabled = false;
      }
    }

    streamChar();
  }

  function initChat() {
    elements.btnSend.addEventListener('click', handleSend);

    elements.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Auto-resize textarea
    elements.chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 160) + 'px';
    });
  }

  // ===== Settings =====
  function saveSettings() {
    state.settings.apiProvider = elements.apiProvider.value;
    state.settings.apiKey = elements.apiKeyInput.value;
    state.settings.model = elements.modelSelect.value;
    state.settings.autoApprove = elements.autoApprove.checked;
    state.settings.showToolDetails = elements.showToolDetails.checked;
    state.settings.soundNotif = elements.soundNotif.checked;
    state.settings.maxTokens = parseInt(elements.maxTokens.value);
    state.settings.theme = elements.themeSelect.value;
    state.settings.fontSize = parseInt(elements.fontSize.value);
    state.settings.customInstructions = elements.customInstructions.value;
    
    // Personality settings
    state.settings.personalityStyle = elements.personalityStyle.value;
    state.settings.tone = parseInt(elements.toneSlider.value);
    state.settings.reasoningDepth = elements.reasoningDepth.value;

    // Apply theme
    document.body.className = `theme-${state.settings.theme}`;
    
    // Save to localStorage
    localStorage.setItem('kiloCodeSettings', JSON.stringify(state.settings));
    
    showToast('Settings saved successfully', 'success');
  }

  function loadSettings() {
    const saved = localStorage.getItem('kiloCodeSettings');
    if (saved) {
      const loaded = JSON.parse(saved);
      Object.assign(state.settings, loaded);
    }

    // Apply settings to UI
    elements.apiProvider.value = state.settings.apiProvider;
    elements.apiKeyInput.value = state.settings.apiKey;
    elements.modelSelect.value = state.settings.model;
    elements.autoApprove.checked = state.settings.autoApprove;
    elements.showToolDetails.checked = state.settings.showToolDetails;
    elements.soundNotif.checked = state.settings.soundNotif;
    elements.maxTokens.value = state.settings.maxTokens;
    elements.themeSelect.value = state.settings.theme;
    elements.fontSize.value = state.settings.fontSize;
    elements.fontSizeVal.textContent = `${state.settings.fontSize}px`;
    elements.customInstructions.value = state.settings.customInstructions;
    
    // Personality settings
    elements.personalityStyle.value = state.settings.personalityStyle;
    elements.toneSlider.value = state.settings.tone;
    elements.toneValue.textContent = state.settings.tone;
    elements.reasoningDepth.value = state.settings.reasoningDepth;

    // Apply theme
    document.body.className = `theme-${state.settings.theme}`;
  }

  function initSettings() {
    // Save settings
    elements.btnSaveSettings.addEventListener('click', saveSettings);
    
    // Toggle API key visibility
    elements.btnToggleKey.addEventListener('click', () => {
      const input = elements.apiKeyInput;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
    
    // Font size slider
    elements.fontSize.addEventListener('input', (e) => {
      elements.fontSizeVal.textContent = `${e.target.value}px`;
    });
    
    // Personality tone slider
    elements.toneSlider.addEventListener('input', (e) => {
      elements.toneValue.textContent = e.target.value;
    });
  }

  // ===== File Tree =====
  function initFileTree() {
    // Add click handlers to file tree items
    elements.fileTree.addEventListener('click', (e) => {
      const treeItem = e.target.closest('.tree-item');
      if (treeItem && treeItem.classList.contains('file')) {
        const path = treeItem.dataset.path;
        // Handle file click - would open in editor
        console.log('File clicked:', path);
      }
    });

    elements.btnNewFile.addEventListener('click', () => {
      console.log('New file');
    });

    elements.btnNewFolder.addEventListener('click', () => {
      console.log('New folder');
    });
  }

  // ===== Tabs =====
  function initTabs() {
    // Add new tab button
    document.getElementById('btn-add-tab').addEventListener('click', () => {
      const tabId = `tab-${Date.now()}`;
      const newTab = document.createElement('div');
      newTab.className = 'tab';
      newTab.dataset.tab = tabId;
      newTab.innerHTML = `
        <span>Untitled</span>
        <button class="tab-close" title="Close">×</button>
      `;
      elements.tabBar.insertBefore(newTab, document.getElementById('btn-add-tab'));

      // Create tab content
      const tabContent = document.createElement('div');
      tabContent.className = 'tab-pane';
      tabContent.id = tabId;
      tabContent.textContent = 'New file content...';
      elements.tabContent.appendChild(tabContent);

      // Add close handler
      newTab.querySelector('.tab-close').addEventListener('click', () => {
        newTab.remove();
        tabContent.remove();
      });

      // Activate new tab
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      tabContent.classList.add('active');
    });

    // Close handlers for existing tabs
    document.querySelectorAll('.tab-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.closest('.tab');
        const tabId = tab.dataset.tab;
        tab.remove();
        document.getElementById(tabId).remove();
      });
    });
  }

  // ===== Welcome Cards =====
  function initWelcomeCards() {
    elements.wcNewTask.addEventListener('click', () => {
      console.log('New task');
    });

    elements.wcOpenFile.addEventListener('click', () => {
      console.log('Open file');
    });

    elements.wcHistory.addEventListener('click', () => {
      switchPanel('history');
    });

    elements.wcSettings.addEventListener('click', () => {
      switchPanel('settings');
    });

    elements.modeCards.forEach(card => {
      card.addEventListener('click', () => {
        setMode(card.dataset.mode);
      });
    });
  }

  // ===== Modals =====
  function initModals() {
    // Close modals when clicking outside or on close button
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        document.getElementById(modalId).style.display = 'none';
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.style.display = 'none';
        }
      });
    });
  }

  // ===== Initialize App =====
  function initApp() {
    console.log('🚀 Kilo Code initialized');
    
    // Initialize features
    initPanelSwitching();
    initModeSelector();
    initChat();
    initSettings();
    initFileTree();
    initTabs();
    initWelcomeCards();
    initModals();
    loadSettings();
    renderWelcomeMessage();
  }

  // Start the app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
