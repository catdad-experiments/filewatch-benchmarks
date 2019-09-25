# file watching benchmarks

[![Travis Build Status](https://travis-ci.com/catdad-experiments/filewatch-benchmarks.svg?branch=master)](https://travis-ci.com/catdad-experiments/filewatch-benchmarks)
[![Azure Pipelines Build Status](https://dev.azure.com/vatev1/filewatch-benchmarks/_apis/build/status/catdad-experiments.filewatch-benchmarks?branchName=master)](https://dev.azure.com/vatev1/filewatch-benchmarks/_build/latest?definitionId=1&branchName=master)

With the [fanfare surrounding the release](https://paulmillr.com/posts/chokidar-3-save-32tb-of-traffic/) of [`chokidar@3.0.0`](https://github.com/paulmillr/chokidar), and the [subsequent](https://github.com/paulmillr/chokidar/issues/873) [long](https://github.com/paulmillr/chokidar/issues/860) [list](https://github.com/paulmillr/chokidar/issues/871) of [new bugs](https://github.com/paulmillr/chokidar/issues/865) which affected some of [my projects](https://github.com/catdad/electronmon), I decided to take a look at the issue of watching files. Long story short, [`watchboy`](https://github.com/catdad/watchboy) was born and he's magnificent!

To make sure that he's doing a good job watching after your files, I created this benchmark suite. While I wrote and ran it, I am making it available to everyone so that you can check my work. Feel free to run it and submit more test cases that you want to see compared. With that said, let's talk about results.

_Note: all memory measurements were taken after garbage collection._

## Test machines

Tests are run in Azure Pipelines, for repeatability. The following specs are used (I will simply be referring to these machines as Windows, Linux and MacOS below):

| OS | Processor | Cores |
| :--- | :--- | :--- |
| Microsoft Windows Server 2019 Datacenter | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 |
| Ubuntu 16.04.6 LTS                       | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 |
| macOS 10.14.6                            | Intel(R) Xeon(R) CPU E5-1650 v2 @ 3.50GHz | 4 |

Now, let's watch some popular projects and see what kind of results we get. In all cases, I have pinned the exact commit of each project, so that we always test the exact same files regardless of how these projects grow over time.

## Watching the `react` source code (small project)

The pinned version of `react` contains 1,554 files in 292 directories.

### Windows

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  1286.68ms  |  35.3 MB        |  48 MB         |
| `gaze`     |  1006.31ms  |  16 MB          |  15.5 MB       |
| `watchboy` |  290.58ms   |  15.9 MB        |  19.3 MB       |

### Linux

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  636.64ms  |  35.2 MB        |  43.3 MB       |
| `gaze`     |  441.16ms  |  17.3 MB        |  17.2 MB       |
| `watchboy` |  262.26ms  |  16 MB          |  19 MB         |

### MacOS

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  271.03ms  |  15.9 MB        |  21.2 MB       |
| `gaze`     |  639.29ms  |  17.6 MB        |  15.2 MB       |
| `watchboy` |  287.46ms  |  16.6 MB        |  20.8 MB       |

## Watching the `vscode` source code (medium project)

The pinned version of `vscode` contains 4,396 files in 1,399 directories.

### Windows

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  4063.48ms  |  53.3 MB        |  90.5 MB       |
| `gaze`     |  3221.65ms  |  38.7 MB        |  63.4 MB       |
| `watchboy` |  868.90ms   |  19.5 MB        |  21.5 MB       |

### Linux

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  1787.42ms  |  52 MB          |  65.7 MB       |
| `gaze`     |  1074.02ms  |  43.7 MB        |  55.5 MB       |
| `watchboy` |  846.60ms   |  31.2 MB        |  25.7 MB       |

### MacOS

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  717.89ms   |  39.2 MB        |  49.1 MB       |
| `gaze`     |  1531.37ms  |  39.3 MB        |  48.2 MB       |
| `watchboy` |  717.92ms   |  34.7 MB        |  23.8 MB       |

## Watching the `babel` source code (large project)

The pinned version of the `babel` source code is pretty diabolical. It contains 16,528 files in 8,216 directories. I actually had to disqualify `gaze` from this benchmark because it throws a `Maximum call stack size exceeded` when trying to watch all files.

### Windows

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  18936.22ms  |  164 MB         |  304 MB        |
| `watchboy` |  7408.11ms   |  49.2 MB        |  54.2 MB       |

### Linux

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  7728.19ms  |  181 MB         |  208 MB        |
| `watchboy` |  6865.25ms  |  63.5 MB        |  70.9 MB       |

### MacOS

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  2957.61ms  |  67 MB          |  97.6 MB       |
| `watchboy` |  5524.79ms  |  51.1 MB        |  59.9 MB       |

## Watching a single large directory

This case is not necessarily common in software, but is common with other use cases. For a [photography application] I maintain, it is not all that rare to open a single directory with several hundred to a couple thousand photos that you took on a single day or single trip. In this benchmark, we'll watch a 1 directory containing 2000 files.

### Windows

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  899.83ms    |  36.9 MB        |  49.2 MB       |
| `gaze`     |  31861.00ms  |  15.2 MB        |  12.9 MB       |
| `watchboy` |  172.60ms    |  13.6 MB        |  17.8 MB       |

### Linux

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  432.60ms    |  37.5 MB        |  44.7 MB       |
| `gaze`     |  42522.20ms  |  15.3 MB        |  22.1 MB       |
| `watchboy` |  146.25ms    |  13.6 MB        |  19.8 MB       |

### MacOS

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  225.75ms    |  16.9 MB        |  22.5 MB       |
| `gaze`     |  52723.25ms  |  8.65 MB        |  12.3 MB       |
| `watchboy` |  213.00ms    |  15.9 MB        |  21.3 MB       |

## Memory footprint

This one is more for fun, but I wanted to see how much memory is needed to simply require each module and have it be present at runtime. Here's the breakdown:

| Library    | Windows size | Linux size | MacOS size |
| ---------- | ---:         | ---:       | ---:       |
| `chokidar` | 1.63 MB      | 1.59 MB    | 2.34 MB    |
| `gaze`     | 3.29 MB      | 2.45 MB    | 4.99 MB    |
| `watchboy` | 1.56 MB      | 1.75 MB    | 2.14 MB    |

## Download size

An extension of the footprint, this metric measures how many files are installed as a result of each dependency, as well as the total size of each dependency.

| Library | Packages | Directories | Files | Total size |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` (Windows) | 14 | 18 | 78   | 339 kB |
| `chokidar` (MacOS)   | 15 | 19 | 83   | 374 kB |
| `gaze`               | 14 | 19 | 1111 | 1.6 MB |
| `watchboy`           | 12 | 15 | 72   | 342 kB |

## Run the benchmarks yourself

The results presented here are from [pipeline runs in Azure Pipelines](https://dev.azure.com/vatev1/filewatch-benchmarks/_build/latest?definitionId=1&branchName=master). There are [pipelines in Travis-CI](https://travis-ci.com/catdad-experiments/filewatch-benchmarks) as well, showing comparable results. You can also run them yourself on your own machine if you'd like:

```bash
git clone https://github.com/catdad-experiments/filewatch-benchmarks.git
cd filewatch-benchmarks
npm install

# run all benchmarks
npm start

# get the names of all available benchmarks
npm run testlist

# run only a single test from the above list
npm start -- <test name>
```

All the tests themselves are defined in the `benchmarks` directory.

The benchmarks are powered by [`grandma`](https://github.com/catdad/grandma). If you want to see a different test, feel free to add it and send me a PR.
