/**
 * @file build
 * @module build/build
 */

import make from '#build/make'
import tsconfig from '../tsconfig.build.json' assert { type: 'json' }

await make({
  entries: [
    {
      dts: 'only',
      entryPoints: [
        'src/*.mts',
        'src/interfaces/*.mts',
        'src/lib/*.mts',
        'src/types/*.mts'
      ]
    },
    {
      dts: false,
      entryPoints: ['src/internal/*.mts', 'src/lib/*.mts', 'src/*.mts']
    }
  ],
  target: ['node18', tsconfig.compilerOptions.target],
  tsconfig: 'tsconfig.build.json',
  write: true
})
