import { describe, it, mock } from 'node:test';

import { expect } from 'expect';

import {
  toHaveBeenCalled,
  toHaveBeenCalledTimes,
  toHaveBeenCalledWith,
  toHaveBeenLastCalledWith,
  toHaveBeenNthCalledWith,
  toReturn,
  toHaveReturned,
  toHaveReturnedTimes,
  toHaveReturnedWith,
  toHaveLastReturnedWith,
  toHaveNthReturnedWith,
} from '../mockMethodMatchers.mjs';

const stripAnsi = str =>
  str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );

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

    it('not fail', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenCalled,
      };
      const method = mock.fn();

      method();

      const result = options.toHaveBeenCalled(method);

      expect(result).toEqual({ message: expect.any(Function), pass: true });
    });

    it('pass', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenCalled,
      };

      const method = mock.fn();

      method();

      const result = options.toHaveBeenCalled(method);

      expect(result).toEqual({ message: expect.any(Function), pass: true });
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

    it('not fail', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenCalledTimes,
      };
      const method = mock.fn();

      method();

      const result = options.toHaveBeenCalledTimes(method, 1);

      expect(result).toEqual({ message: expect.any(Function), pass: true });
    });

    it('pass', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenCalledTimes,
      };

      const method = mock.fn();

      method();

      const result = options.toHaveBeenCalledTimes(method, 1);

      expect(result).toEqual({ message: expect.any(Function), pass: true });
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

    it('not fail', () => {
      const options = {
        isNot: true,
        promise: false,
        toHaveBeenCalledWith,
      };
      const method = mock.fn();

      method(1);

      const result = options.toHaveBeenCalledWith(method, 1);

      expect(result).toEqual({ message: expect.any(Function), pass: true });
    });

    it('pass', () => {
      const options = {
        isNot: false,
        promise: false,
        toHaveBeenCalledWith,
      };

      const method = mock.fn();

      method(1);

      const result = options.toHaveBeenCalledWith(method, 1);

      expect(result).toEqual({ message: expect.any(Function), pass: true });
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
});
