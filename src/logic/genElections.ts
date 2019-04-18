import { VoteRecord } from '../types';
import range from 'lodash/range';

export const genVotes = (): VoteRecord => {
  const votes: string[][] = [];
  range(40).forEach(() => {
    votes.push(['ALPHA', 'BETA', 'GAMMA']);
  });
  range(42).forEach(() => {
    votes.push(['ALPHA', 'GAMMA', 'BETA']);
  });
  range(44).forEach(() => {
    votes.push(['BETA', 'ALPHA', 'GAMMA']);
  });
  range(46).forEach(() => {
    votes.push(['GAMMA', 'ALPHA', 'BETA']);
  });
  range(48).forEach(() => {
    votes.push(['GAMMA', 'BETA', 'ALPHA']);
  });
  return votes;
};

export const genPrimary = (): VoteRecord => {
  const votes: string[][] = [];
  range(400).forEach(() => {
    votes.push(['ALPHA', 'BETA', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['ALPHA', 'GAMMA', 'BETA']);
  });
  range(440).forEach(() => {
    votes.push(['BETA', 'ALPHA', 'GAMMA']);
  });
  range(460).forEach(() => {
    votes.push(['GAMMA', 'ALPHA', 'BETA']);
  });
  range(480).forEach(() => {
    votes.push(['GAMMA', 'BETA', 'ALPHA']);
  });
  range(400).forEach(() => {
    votes.push(['DELTA', 'BETA', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['DELTA', 'GAMMA', 'BETA']);
  });
  range(440).forEach(() => {
    votes.push(['BETA', 'DELTA', 'GAMMA']);
  });
  range(460).forEach(() => {
    votes.push(['GAMMA', 'DELTA', 'BETA']);
  });
  range(480).forEach(() => {
    votes.push(['GAMMA', 'BETA', 'DELTA']);
  });
  range(400).forEach(() => {
    votes.push(['DELTA', 'EPSILON', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['DELTA', 'GAMMA', 'EPSILON']);
  });
  range(440).forEach(() => {
    votes.push(['EPSILON', 'DELTA', 'GAMMA']);
  });
  range(460).forEach(() => {
    votes.push(['GAMMA', 'DELTA', 'EPSILON']);
  });
  range(480).forEach(() => {
    votes.push(['GAMMA', 'EPSILON', 'DELTA']);
  });
  range(400).forEach(() => {
    votes.push(['ALPHA', 'EPSILON', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['ALPHA', 'ZETA', 'BETA']);
  });
  range(440).forEach(() => {
    votes.push(['BETA', 'ALPHA', 'ZETA']);
  });
  range(460).forEach(() => {
    votes.push(['ZETA', 'ALPHA', 'BETA']);
  });
  range(480).forEach(() => {
    votes.push(['ZETA', 'BETA', 'ALPHA']);
  });
  return votes;
};
