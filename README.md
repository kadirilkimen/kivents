# Kivents
KIVENTS is a lightweight, environment-agnostic JavaScript event manager. It allows you to attach, run, and remove events on arbitrary string-based targets. Designed for flexibility, it works in browsers, Node.js, or any modern JavaScript engine.

### Features
- Vanilla JavaScript, no dependencies
- Supports one-time (`once`) and persistent (`on`) listeners
- Serial execution of listeners
- Optional debug logging
- Optional high-speed mode for better performance
- Fully environment-agnostic. Compatible with browsers and Node.js
- Logging and error handling via configurable callback functions
- Requires ES6+

### Installation
```html
<script src="kivents.js"></script>
```
or
```javascript
const KIVENTS = require('./kivents.js');
```


## Usage

### Creating an instance
```javascript
const events = new KIVENTS({
  debug: true,                  // Enable debug logging. Recommended to set false for production.
  highSpeed: false,             // Skips try/catch for callbacks. Set true only if you experience performance issues.
  logFunc: console.log,         // Custom log function
  errorFunc: console.error      // Custom error function
});
```


## Adding listeners

### Persistent listener (on)
```javascript
let listenerID = events.on('myTarget', 'listenerName', function(payload) {
  console.log('Listener on myTarget event triggered with', payload);
});
```

### One-time listener (once)
```javascript
let listenerID = events.on('myTarget', function(payload) {
  console.log('No-name listener on myTarget event triggered with', payload);
});
```


## Removing listeners

### Remove a specific listener
```javascript
events.off('myTarget', 'listenerName');
```

### Remove all listeners from an event
```javascript
events.off('myTarget');
```


## Running/Emitting events
```javascript
events.run('myTarget');
events.run('myTarget', payload);
events.run('myTarget', payload, printable);
events.run('myTarget', null, printable);
//or
events.emit('myTarget');
events.emit('myTarget', payload);
events.emit('myTarget', payload, printable);
events.emit('myTarget', null, printable);
```
- `payload` is optional and can be any value passed to all listeners of the event.
- `printable` is optional and controls individual logging of each event call. Overrides debug mode for individual event calls.


## Getting Events
```javascript
const allEvents = events.getEvents();
```
-Returns the internal `Map` of all registered events and listeners.


## Notes

- Each event target can have multiple listeners, but listener names must be unique per target. if No listener name provided, a unique string generated for the listener.
- One-time listeners are automatically removed after execution.
- High-speed mode skips some debugging features and try/catch safeguards. So exceptions in listeners will propagate and could block the execution.



