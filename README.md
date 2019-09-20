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
| Ubuntu 16.04.6 LTS | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 |
| macOS 10.14.6 | Intel(R) Xeon(R) CPU E5-1650 v2 @ 3.50GHz | 4 |

Now, let's watch some popular projects and see what kind of results we get. In all cases, I have pinned the exact commit of each project, so that we always test the exact same files regardless of how these projects grow over time.

## Watching the `react` source code (small project)

The pinned version of `react` contains 1,554 files in 292 directories.

### Windows

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  1911.42ms  |  40 MB          |  53.3 MB       |
| `gaze`     |  989.42ms   |  16 MB          |  15.4 MB       |
| `watchboy` |  287.77ms   |  15.8 MB        |  18.9 MB       |

### Linux

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  890.42ms  |  38.8 MB        |  47.5 MB       |
| `gaze`     |  430.51ms  |  17.5 MB        |  17.5 MB       |
| `watchboy` |  243.68ms  |  16.1 MB        |  17.9 MB       |

### MacOS

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  297.88ms  |  16 MB          |  21.2 MB       |
| `gaze`     |  677.94ms  |  17.6 MB        |  15.2 MB       |
| `watchboy` |  302.06ms  |  16.7 MB        |  21 MB         |

## Watching the `vscode` source code (medium project)

The pinned version of `vscode` contains 4,396 files in 1,399 directories.

### Windows

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  5974.47ms  |  63.4 MB        |  97.3 MB       |
| `gaze`     |  3117.24ms  |  38.6 MB        |  62.6 MB       |
| `watchboy` |  864.31ms   |  20 MB          |  21.5 MB       |

### Linux

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  2559.05ms  |  65.1 MB        |  77.5 MB       |
| `gaze`     |  1038.95ms  |  43.8 MB        |  55.8 MB       |
| `watchboy` |  768.62ms   |  31.8 MB        |  25.4 MB       |

### MacOS

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  763.66ms   |  41.5 MB        |  49.6 MB       |
| `gaze`     |  1611.56ms  |  39.2 MB        |  48.4 MB       |
| `watchboy` |  753.45ms   |  34.2 MB        |  23.7 MB       |

## Watching the `babel` source code (large project)

The pinned version of the `babel` source code is pretty diabolical. It contains 16,528 files in 8,216 directories. I actually had to disqualify `gaze` from this benchmark, but more on that later.

### Windows

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  26551.50ms  |  209 MB         |  347 MB        |
| `watchboy` |  6928.71ms   |  49.3 MB        |  54.8 MB       |

### Linux

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  11780.62ms  |  201 MB         |  234 MB        |
| `watchboy` |  6382.08ms   |  63.4 MB        |  71.8 MB       |

### MacOS

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  3320.25ms  |  71 MB          |  94.7 MB       |
| `watchboy` |  6400.29ms  |  51.6 MB        |  60.8 MB       |

## Watching a single large directory

This case is not necessarily common in software, but is common with other use cases. For a [photography application] I maintain, it is not all that rare to open a single directory with several hundred to a couple thousand photos that you took on a single day or single trip. In this benchmark, we'll watch a 1 directory containing 2000 files.

### Windows

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  1493.50ms   |  39.8 MB        |  54.7 MB       |
| `gaze`     |  30472.50ms  |  15 MB          |  12.6 MB       |
| `watchboy` |  172.20ms    |  13.7 MB        |  17.3 MB       |

### Linux

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  729.20ms    |  40.6 MB        |  51.6 MB       |
| `gaze`     |  40377.00ms  |  15.1 MB        |  22.7 MB       |
| `watchboy` |  140.00ms    |  13.9 MB        |  19.4 MB       |

### MacOS

| Library    |  Ready In    |  Retained Heap  |  Retained RSS  |
| ---        | ---:         | ---:            | ---:           |
| `chokidar` |  248.50ms    |  17.6 MB        |  22.5 MB       |
| `gaze`     |  54514.00ms  |  8.52 MB        |  9.84 MB       |
| `watchboy` |  212.33ms    |  16.1 MB        |  19.9 MB       |

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
