class DomainProcedure {
  constructor(name, index) {
    this.id = 'node' + index;
    this.name = name;
    this.body = [];
    this.type = 'procedure';
    this.index = index;
  }
}

class DomainStep {
  constructor(name, index) {
    this.id = 'node' + index;
    this.name = name;
    this.success = [];
    this.fail = [];
    this.finalization = [];
    this.type = 'step';
    this.index = index;
    this.body = null;
  }
}

class DomainCommand {
  constructor(name, index, type) {
    this.id = 'node' + index;
    this.name = name;
    this.type = type;
    this.index = index;
    this.body = null;
  }
}

const BULLETS = [
  ['# ', 'procedure'],
  ['* `<`', 'finalization'],
  ['* `-`', 'fail'],
  ['* `+`', 'success'],
  ['*', 'command'],
];

const cutBullet = (s, len = 1) => s.substring(len).trim();

const parseLine = (line) => {
  const str = line.trim(),
    failure = { type: null, text: str };
  if (!str.length) return failure;
  const find = BULLETS.find(([bullet]) => str.startsWith(bullet));
  if (!find) return failure;
  const [bullet, type] = find;
  return { type, text: cutBullet(str, bullet.length) };
};

const parseProcess = (src) => {
  const lines = Array.isArray(src) ? src : src.split('\n'),
    procedures = [],
    flatArray = [];

  let procedure, step, command;

  for (let i = 0; i < lines.length; i++) {
    const { type, text } = parseLine(lines[i]);
    if (!type) continue;
    if (type === 'procedure') {
      procedure = new DomainProcedure(text, i);
      procedures.push(procedure);
    } else if (type === 'command') {
      if (!procedure) continue;
      step = new DomainStep(text, i);
      procedure.body.push(step);
      flatArray.push(step);
    } else {
      if (!step) continue;
      command = new DomainCommand(text, i, type);
      step[type].push(command);
      flatArray.push(command);
    }
  }

  for (const item of flatArray) {
    for (let i = 1; i < procedures.length; i++) {
      if (item.name === procedures[i].name) {
        procedures[i].embed = item.id;
        item.body = procedures[i].body;
      }
    }
  }

  // console.error(lines, procedures);

  return procedures;
};

export default { parseProcess, parseLine };
