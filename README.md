# Extend Jest expect matchers for native Node.js test runner mock objects

[![npm version](https://badge.fury.io/js/expect-matcher-node-mock.svg)](https://badge.fury.io/js/expect-matcher-node-mock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

Extend the Jest [expect library](https://jestjs.io/docs/expect#expectextendmatchers) with matchers that work with native Node.js test runner mock objects.

The native Node.js test runner has a different mock structure from `jest.mock`, therefore extending the current methods is necessary to provide Jest-like testing experience.

## Why use this?

The native Node.js test runner (introduced in Node.js 18) provides built-in testing capabilities without external dependencies. However, its mock objects have a different structure than Jest mocks, making Jest's expect matchers incompatible.

This package bridges that gap by:
- ✅ Providing familiar Jest-like assertions for Node.js mocks
- ✅ Zero configuration setup
- ✅ Lightweight with minimal dependencies
- ✅ Full compatibility with existing Jest expect patterns
- ✅ Perfect for migrating from Jest to native Node.js testing

## Installation

```bash
npm install expect-matcher-node-mock
```

```bash
yarn add expect-matcher-node-mock
```

```bash
pnpm add expect-matcher-node-mock
```

## Usage

Since the native Node.js test runner doesn't have any global setup, you need to import this extension in every test file:

```js
import 'expect-matcher-node-mock';
```

The extension of expect matchers is included in this import.

### Alternative: Import expect directly

You can also import `expect` directly from this package, which automatically includes all the extended matchers:

```js
import { expect } from 'expect-matcher-node-mock';
```

### JavaScript Example

```js
import { test, mock } from 'node:test';
import { expect } from 'expect-matcher-node-mock'; // Direct import with matchers included

test('mock function testing', () => {
  const mockFn = mock.fn();
  
  mockFn('arg1', 'arg2');
  mockFn('arg3');
  
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  expect(mockFn).toHaveBeenLastCalledWith('arg3');
});
```

### Alternative Import Method

```js
import { test, mock } from 'node:test';
import { expect } from 'expect';
import 'expect-matcher-node-mock'; // Extension import

test('same functionality as above', () => {
  const mockFn = mock.fn();
  // ... same test code
});
```

### TypeScript Example

```typescript
import { test, mock } from 'node:test';
import { expect } from 'expect-matcher-node-mock'; // Direct import recommended

test('mock function with return values', () => {
  const mockFn = mock.fn<(x: number) => number>();
  
  mockFn.mock.mockImplementation((x: number) => x * 2);
  
  const result1 = mockFn(5);
  const result2 = mockFn(10);
  
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveReturnedWith(10);
  expect(mockFn).toHaveLastReturnedWith(20);
});
```

### Advanced Example - Method Mocking

```js
import { test, mock } from 'node:test';
import { expect } from 'expect-matcher-node-mock';

test('object method mocking', () => {
  const obj = {
    method: mock.fn(() => 'original'),
    calculate: mock.fn((a, b) => a + b)
  };
  
  obj.method();
  obj.calculate(2, 3);
  obj.calculate(5, 7);
  
  expect(obj.method).toHaveBeenCalled();
  expect(obj.calculate).toHaveBeenCalledTimes(2);
  expect(obj.calculate).toHaveBeenNthCalledWith(1, 2, 3);
  expect(obj.calculate).toHaveBeenNthCalledWith(2, 5, 7);
  expect(obj.calculate).toHaveNthReturnedWith(2, 12);
});
```

## Available Matchers

### toHaveBeenCalled
https://jestjs.io/docs/expect#tohavebeencalled

### toHaveBeenCalledTimes
https://jestjs.io/docs/expect#tohavebeencalledtimesnumber

### toHaveBeenCalledWith
https://jestjs.io/docs/expect#tohavebeencalledwitharg1-arg2-

### toHaveBeenLastCalledWith
https://jestjs.io/docs/expect#tohavebeenlastcalledwitharg1-arg2-

### toHaveBeenNthCalledWith
https://jestjs.io/docs/expect#tohavebeennthcalledwithnthcall-arg1-arg2-

### toHaveReturned
*Alias: `toReturn`*  
https://jestjs.io/docs/expect#tohavereturned

### toHaveReturnedTimes
https://jestjs.io/docs/expect#tohavereturnedtimesnumber

### toHaveReturnedWith
https://jestjs.io/docs/expect#tohavereturnedwithvalue

### toHaveLastReturnedWith
https://jestjs.io/docs/expect#tohavelastreturnedwithvalue

### toHaveNthReturnedWith
https://jestjs.io/docs/expect#tohaventhreturnedwithnthcall-value

## Requirements

- **Node.js 18.0.0 or higher** (for native test runner support)
- **expect package** (peer dependency) - Install with `npm install expect`

## Peer Dependencies

This package requires the `expect` library to be installed in your project:

```bash
npm install expect
```

## Troubleshooting

### "expect is not defined" error
You have two options to import `expect`:

**Option 1: Direct import (recommended)**
```js
import { expect } from 'expect-matcher-node-mock';
```

**Option 2: Separate imports**
```js
import { expect } from 'expect';
import 'expect-matcher-node-mock';
```

### Matchers not working
Ensure you either:
- Import expect directly from this package: `import { expect } from 'expect-matcher-node-mock';`
- Or import the extension before using expect: `import 'expect-matcher-node-mock';`

### TypeScript support
While this package is written in JavaScript, it works seamlessly with TypeScript projects. For better type support, you may want to add type declarations for the extended matchers.

## Compatibility

- ✅ Node.js native test runner (18.0.0+)
- ✅ Works with ES modules (`.mjs`, `type: "module"`)
- ✅ TypeScript projects
- ✅ CommonJS projects (with appropriate imports)

## License

MIT - see [LICENSE](LICENSE) file for details.

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/crysadrak/expect-matcher-node-mock).

### Development

```bash
# Clone the repository
git clone https://github.com/crysadrak/expect-matcher-node-mock.git
cd expect-matcher-node-mock

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint
```

## Changelog

See [GitHub Releases](https://github.com/crysadrak/expect-matcher-node-mock/releases) for version history.

## Related Projects

- [expect](https://github.com/jestjs/jest/tree/main/packages/expect) - The core expect library
- [Node.js Test Runner](https://nodejs.org/api/test.html) - Native Node.js testing
- [Jest](https://jestjs.io/) - JavaScript testing framework
