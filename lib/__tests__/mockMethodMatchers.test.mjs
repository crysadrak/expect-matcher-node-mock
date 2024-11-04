import { describe, it, mock } from 'node:test';

import { expect } from 'expect';

import '../index.mjs';

describe('mockMethodMatchers', () => {
  it('toHaveBeenCalled', () => {
    const method = mock.fn();
    const notCalledMethod = mock.fn();

    method();

    expect(method).toHaveBeenCalled();
    expect(notCalledMethod).not.toHaveBeenCalled();
  });

  it('toHaveBeenCalledTimes', () => {
    const method = mock.fn();
    const notCalledMethod = mock.fn();

    method();
    method();

    expect(method).toHaveBeenCalledTimes(2);
    expect(notCalledMethod).not.toHaveBeenCalledTimes(1);
  });

  it('toHaveBeenCalledWith', () => {
    const method = mock.fn();

    method('foo', 'bar');

    expect(method).toHaveBeenCalledWith('foo', 'bar');
    expect(method).not.toHaveBeenCalledWith('bar', 'foo');
  });

  it('toHaveBeenLastCalledWith', () => {
    const method = mock.fn();

    method('foo');
    method('bar');

    expect(method).toHaveBeenLastCalledWith('bar');
    expect(method).not.toHaveBeenLastCalledWith('foo');
  });

  it('toHaveBeenNthCalledWith', () => {
    const method = mock.fn();

    method('foo');
    method('bar');

    expect(method).toHaveBeenNthCalledWith(1, 'foo');
    expect(method).toHaveBeenNthCalledWith(2, 'bar');
    expect(method).not.toHaveBeenNthCalledWith(1, 'bar');
  });
});
