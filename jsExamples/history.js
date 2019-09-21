'esversion: 6';

// Should be null because we haven't modified the history stack yet
console.log(`History.state before pushState: ${history.state}`);

// Now we'll push something on the stack
history.replaceState({name: 'Example'}, "pushState example", 'page3.html');

// Now state will have a value.
console.log(`History.state after pushState: ${history.state}`);