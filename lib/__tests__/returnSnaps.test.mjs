import { describe, it, mock } from 'node:test';

import { expect } from 'expect';
import stripAnsi from 'strip-ansi';

import {
  toHaveBeenCalled,
  toHaveBeenCalledTimes,
  toHaveBeenCalledWith,
  toHaveBeenLastCalledWith,
  toHaveBeenNthCalledWith,
} from '../mockMethodMatchers.mjs';

describe('mockMethodMatchers return snapshots', () => {
  describe('toHaveBeenCalled', () => {
    it('fail', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenCalled,
      };

      const method = mock.fn();

      const result = options.toHaveBeenCalled(method);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining('expect(mock.fn()).false.toHaveBeenCalled()')
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Expected number of calls: >= 1')
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Received number of calls:    0')
      );
    });

    it('not pass', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenCalled,
      };
      const method = mock.fn();

      const result = options.toHaveBeenCalled(method);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.not.toHaveBeenCalled()'
        )
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Expected number of calls: >= 1')
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Received number of calls:    0')
      );
    });
  });

  describe('toHaveBeenCalledTimes', () => {
    it('fail', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenCalledTimes,
      };

      const method = mock.fn();

      const result = options.toHaveBeenCalledTimes(method, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.toHaveBeenCalledTimes(expected)'
        )
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Expected number of calls: 1')
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Received number of calls: 0')
      );
    });

    it('not pass', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenCalledTimes,
      };
      const method = mock.fn();

      const result = options.toHaveBeenCalledTimes(method, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.not.toHaveBeenCalledTimes(expected)'
        )
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Expected number of calls: 1')
      );
      expect(message).toStrictEqual(
        expect.stringContaining('Received number of calls: 0')
      );
    });
  });

  describe('toHaveBeenCalledWith', () => {
    it('fail', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenCalledWith,
      };

      const method = mock.fn();

      const result = options.toHaveBeenCalledWith(method, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.toHaveBeenCalledWith(...expected)'
        )
      );
      expect(message).toStrictEqual(expect.stringContaining('Expected: 1'));
      expect(message).toStrictEqual(
        expect.stringContaining('Number of calls: 0')
      );
    });

    it('not pass', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenCalledWith,
      };
      const method = mock.fn();

      const result = options.toHaveBeenCalledWith(method, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.not.toHaveBeenCalledWith(...expected)'
        )
      );
      expect(message).toStrictEqual(expect.stringContaining('Expected: 1'));
      expect(message).toStrictEqual(
        expect.stringContaining('Number of calls: 0')
      );
    });
  });

  describe('toHaveBeenLastCalledWith', () => {
    it('fail', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenLastCalledWith,
      };

      const method = mock.fn();

      const result = options.toHaveBeenLastCalledWith(method, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.toHaveBeenLastCalledWith(...expected)'
        )
      );
      expect(message).toStrictEqual(expect.stringContaining('Expected: 1'));
      expect(message).toStrictEqual(
        expect.stringContaining('Number of calls: 0')
      );
    });

    it('not pass', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenLastCalledWith,
      };
      const method = mock.fn();

      const result = options.toHaveBeenLastCalledWith(method, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.not.toHaveBeenLastCalledWith(...expected)'
        )
      );
      expect(message).toStrictEqual(expect.stringContaining('Expected: 1'));
      expect(message).toStrictEqual(
        expect.stringContaining('Number of calls: 0')
      );
    });
  });

  describe('toHaveBeenNthCalledWith', () => {
    it('fail', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenNthCalledWith,
      };

      const method = mock.fn();

      const result = options.toHaveBeenNthCalledWith(method, 1, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.toHaveBeenNthCalledWith(...expected)'
        )
      );
      expect(message).toStrictEqual(expect.stringContaining('Expected: 1'));
      expect(message).toStrictEqual(
        expect.stringContaining('Number of calls: 0')
      );
    });

    it('not pass', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenNthCalledWith,
      };
      const method = mock.fn();

      const result = options.toHaveBeenNthCalledWith(method, 1, 1);
      const message = stripAnsi(result.message());

      expect(result).toEqual({ message: expect.any(Function), pass: false });
      expect(message).toStrictEqual(
        expect.stringContaining(
          'expect(mock.fn()).false.not.toHaveBeenNthCalledWith(...expected)'
        )
      );
      expect(message).toStrictEqual(expect.stringContaining('Expected: 1'));
      expect(message).toStrictEqual(
        expect.stringContaining('Number of calls: 0')
      );
    });
  });
});
