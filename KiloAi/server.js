async function generateAIResponse(message, mode, settings) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Personality-based response modifications
  const personalityPrefix = getPersonalityPrefix(settings.personalityStyle, settings.tone);
  
  // Return mode-specific responses with personality
  const modeResponses = {
    code: `${personalityPrefix} I've analyzed your request. Let me help you with that!\n\nHere's a code example:\n\n\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("${message}"));
\`\`\`\n\nThis demonstrates a simple greeting function. Let me know if you'd like me to expand on this or create more complex functionality! I'm thinking about how we could make this more robust - perhaps adding error handling or supporting different languages?`,
    
    architect: `${personalityPrefix} I'll help you plan this out systematically. Let me think through the architecture...\n\n## Architecture Overview\n\n1. **Component Structure** - Break down into modular components with clear boundaries\n2. **Data Flow** - Define explicit data patterns that minimize coupling\n3. **API Design** - RESTful might be simpler, but GraphQL could offer more flexibility\n\nI'm considering the trade-offs here. Would you like me to elaborate on any of these points? I can dive deeper into specific architectural patterns that would fit your needs.`,
    
    ask: `${personalityPrefix} Great question! Here's a comprehensive explanation:\n\nWhen working with JavaScript, understanding the **event loop** is crucial. It handles asynchronous operations through:\n\n- Call Stack\n- Task Queue  \n- Microtask Queue\n\nI think this is one of the most misunderstood concepts in JS, but it's absolutely fundamental. Let me know if you'd like more details on any specific aspect! I can break down real-world examples or common pitfalls.`,
    
    debug: `${personalityPrefix} Let me help you debug this issue. First, let me analyze the problem:\n\n## Diagnostic Steps\n\n1. Check the error logs - look for patterns, not just single errors\n2. Identify the root cause - don't just fix symptoms\n3. Add debugging statements - target the right areas\n\n**Common causes include:**\n- Undefined variables\n- Async timing issues\n- Type mismatches\n\nI'm curious - can you share the specific error message or code that's causing issues? The more context you give, the better I can help you get to the bottom of this.`,
    
    orchestrator: `${personalityPrefix} I'll help coordinate this multi-step task. Let me break it down:\n\n## Task Breakdown\n\n- [ ] Step 1: Requirements gathering - understand the real problem\n- [ ] Step 2: Design phase - create a scalable solution\n- [ ] Step 3: Implementation - build with quality\n- [ ] Step 4: Testing - ensure reliability\n\nI'm thinking about the most efficient path here. Which step would you like to start with? I can adapt the plan based on your priorities and constraints.`,
    
    review: `${personalityPrefix} I'll review your code thoroughly. Here's what I look for:\n\n## Code Review Checklist\n\n- ✅ Code readability - will the next developer understand this?\n- ✅ Performance considerations - is this optimized for the use case?\n- ✅ Security best practices - are we exposing any vulnerabilities?\n- ✅ Error handling - what happens when things go wrong?\n- ✅ Test coverage - do we have the right tests?\n\nPlease share the code you'd like me to review! I promise to be honest but constructive, challenging your assumptions when appropriate while maintaining a balanced perspective.`
  };
  
  // Adjust depth based on reasoning depth setting
  let response = modeResponses[mode] || modeResponses.code;
  response = adjustReasoningDepth(response, settings.reasoningDepth);
  
  return response;
}

function getPersonalityPrefix(style, tone) {
  // Tone: 0 = calm/technical, 100 = bold/opinionated
  
  switch (style) {
    case 'claude':
      return 'Let me think carefully about this... ';
    case 'grok':
      return 'Let\'s cut to the chase. ';
    case 'calm':
      return 'I\'ll help you work through this step by step. ';
    case 'bold':
      return 'Here\'s my take - ';
    default: // balanced
      return tone > 70 ? 'I have a strong perspective on this. ' : 
             tone > 30 ? 'Let me analyze this thoughtfully. ' : 
             'Let me break this down systematically. ';
  }
}

function adjustReasoningDepth(response, depth) {
  switch (depth) {
    case 'quick':
      return response.split('\n\n')[0] + '\n\nWould you like more details?';
    case 'deep':
      return response + '\n\nLet me dive deeper into this. There are several aspects we should consider...';
    case 'comprehensive':
      return 'I\'ll give you a comprehensive analysis. ' + response + '\n\nAdditionally, we should explore edge cases, scalability considerations, and potential optimizations.';
    default: // balanced
      return response;
  }
}
