import { Table } from 'console-table-printer';
import { TScripts } from '../types';

export const logScriptsOptionsTable = (scripts: TScripts) => {
  const p = new Table({
    columns: [
      { name: 'script', alignment: 'left', color: 'blue' },
      { name: 'command', alignment: 'left', color: 'green' },
    ],
  });

  Object.entries(scripts).forEach(([key, value]) =>
    p.addRow({ script: key, command: value })
  );

  p.printTable();
};
