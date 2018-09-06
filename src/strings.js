import chalk from 'chalk';
import {process} from './globals';


const toString = (item)=> {
  if (typeof item === 'string') {
    return item;
  } else if (item[Symbol.iterator]) {
    return [...item].join(' ');
  }
  return item;
};


const indentation = (text)=> text.length - text.trimStart().length;


const unindent = (lines, startPos)=> lines.map((line)=> line.slice(startPos));


const autoUnindent = (text)=> {
  const lines = text.split('\n');
  const [, indented] = lines;

  const startPos = indented ? indentation(indented) : 0;
  const finalLines = indented ? lines.slice(1) : lines;
  const unindentedLines = unindent(finalLines, startPos);

  return unindentedLines.join('\n');
};


export const print = (parts, ...args)=> {
  const text = chalk(parts, ...args.map(toString));
  process.stdout.write(`${autoUnindent(text)}\n`);
};
