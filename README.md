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

## Typical large install of `node_modules`

After installing some heavyweight node modules, including ones like `jest` and `babel`, I ended up with roughly 6400 files in 400 directories. I decided to start this benchmark at that size, using a repeatable folder structure and controlled files.

### Windows

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  3517.94ms  |  71.6 MB        |  115 MB        |
| `gaze`     |  2802.81ms  |  36.9 MB        |  46.9 MB       |
| `watchboy` |  493.20ms   |  15.2 MB        |  19 MB         |

### Linux

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  2092.25ms  |  74.1 MB        |  88.8 MB       |
| `gaze`     |  1253.56ms  |  36.1 MB        |  36.2 MB       |
| `watchboy` |  512.89ms   |  15.8 MB        |  22.4 MB       |

### MacOS

| Library    |  Ready In   |  Retained Heap  |  Retained RSS  |
| ---        | ---:        | ---:            | ---:           |
| `chokidar` |  741.68ms   |  38.9 MB        |  47.8 MB       |
| `gaze`     |  1914.90ms  |  35.3 MB        |  38.5 MB       |
| `watchboy` |  751.57ms   |  18.2 MB        |  23.1 MB       |

## Typical large project

A much more typical project -- think monorepo -- when watching only project files without dependencies can be around 320 files in 20 directories. I simulated that as well in a similar manner.

### Windows

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  250.42ms  |  15.1 MB        |  11.6 MB       |
| `gaze`     |  259.67ms  |  4.96 MB        |  6.09 MB       |
| `watchboy` |  114.09ms  |  4.76 MB        |  5.29 MB       |

### Linux

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  195.79ms  |  15.2 MB        |  12.8 MB       |
| `gaze`     |  179.78ms  |  4.7 MB         |  4.88 MB       |
| `watchboy` |  95.66ms   |  5.44 MB        |  7.56 MB       |

### MacOS

| Library    |  Ready In  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` |  79.07ms   |  4.62 MB        |  4.2 MB        |
| `gaze`     |  279.89ms  |  4.68 MB        |  4.64 MB       |
| `watchboy` |  164.14ms  |  14.2 MB        |  13.2 MB       |

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
