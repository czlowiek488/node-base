const { exec } = require('child_process');
const { normalize } = require('path');

exports.bash = (cmd, cwd = './') =>
  new Promise((resolve, reject) =>
    exec(cmd, { cwd: normalize(cwd) },
      (err, stdout, stderr) =>
        err
          ? console.log('ERR executor -bash', { err, stderr, stdout }) || reject(err || stderr)
          : console.log(`executor -bash "${cmd}"\n`) || resolve(stdout)));
