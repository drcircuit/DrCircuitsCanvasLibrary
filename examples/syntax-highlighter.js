/**
 * DCL Syntax Highlighter
 * Provides consistent syntax highlighting for DCL example code displays
 */

function highlightSyntax(code) {
    // IMPORTANT: Order of replacement is crucial.

    // 1. Strings (e.g., `template`, 'single', "double")
    //    MUST RUN FIRST to prevent its HTML output (class attributes) from being seen as other tokens.
    code = code.replace(/(`[^`]*`|'[^']*'|"[^"]*")/g, '<span class="code-string">$1</span>');

    // 2. Comments (e.g., // comment)
    //    Runs after strings. Now, `class="code-string"` from rule #1 won't be misinterpreted.
    code = code.replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>');

    // 3. Keywords (e.g., let, const, function)
    code = code.replace(/\b(let|var|const|function|for|if|else|return|new|true|false|null|undefined)\b/g, '<span class="code-keyword">$1</span>');

    // 4. DCL API calls (e.g., dcl.curve.plot, dcl.setupScreen)
    code = code.replace(/\b(dcl(\.[a-zA-Z_]\w*)+)\b/g, '<span class="code-dcl-api">$1</span>');

    // 5. Known global DCL functions, user-defined setup/draw, and constants
    const knownGlobalFunctionsAndConstants = [
        'setup', 'draw', 'vector', 'random', 'text', 'floor', 'animate', 'color', 'setBgColor', 'plot', 'clearEachFrame', 'curve',
        'rect', 'circle', 'line', 'fill', 'stroke', 'createSprite', 'sprite', 'createBuffer', 'setupScreen', 'getCtx',
        'playAnimation', 'stopAnimation', 'startAnimation', 'clear', 'randomi', 'toRadians', 'rotateY', 'rotateZ', 'rotateX', 'project',
        'start', 'vertex', 'end', 'forEach', 'push', 'sin', 'cos', 'tan', 'atan2', 'sqrt', 'abs', 'min', 'max',
        'RED', 'MAGENTA', 'YELLOW', 'GREEN', 'CYAN', 'BLUE', 'TRANS', 'BLACK', 'WHITE', 'GRAY',
        'KEYS', 'MOUSE', 'KEYB', 'PI', 'E', 'TAU'
    ];

    const knownGlobalsRegex = new RegExp(`\\b(${knownGlobalFunctionsAndConstants.join('|')})\\b`, 'g');
    code = code.replace(knownGlobalsRegex, (match) => {
        if (['setup', 'draw'].includes(match)) {
            return `<span class="code-function-name">${match}</span>`;
        }
        return `<span class="code-dcl-api">${match}</span>`;
    });

    // 6. Generic function calls (identifier followed by an opening parenthesis)
    code = code.replace(/\b([a-zA-Z_]\w*)\s*\(/g, (match, p1) => {
        if (/\b(let|var|const|function|for|if|else|return|new|true|false|null|undefined)\b/.test(p1)) {
            return match;
        }
        if (knownGlobalFunctionsAndConstants.includes(p1)) {
            return match;
        }
        return `<span class="code-function-name">${p1}</span>(`;
    });

    // 7. Numeric literals
    code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-literal">$1</span>');

    return code;
}

/**
 * Utility function to display and execute code in DCL examples
 * @param {string} code - The JavaScript code to display and execute
 * @param {string} displayElementId - ID of the element to display highlighted code in
 */
function displayAndExecuteCode(code, displayElementId) {
    // Display highlighted code
    document.getElementById(displayElementId).innerHTML = highlightSyntax(code.trim());

    // Execute the code
    const scriptElement = document.createElement('script');
    scriptElement.textContent = code;
    document.body.appendChild(scriptElement);
}

// Export for use in examples
window.highlightSyntax = highlightSyntax;
window.displayAndExecuteCode = displayAndExecuteCode;
