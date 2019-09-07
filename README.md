# file watching benchmarks

[![Travis Build Status](https://travis-ci.com/catdad-experiments/filewatch-benchmarks.svg?branch=master)](https://travis-ci.com/catdad-experiments/filewatch-benchmarks)
[![Azure Pipelines Build Status](https://dev.azure.com/vatev1/filewatch-benchmarks/_apis/build/status/catdad-experiments.filewatch-benchmarks?branchName=master)](https://dev.azure.com/vatev1/filewatch-benchmarks/_build/latest?definitionId=1&branchName=master)

With the [fanfare surrounding the release](https://paulmillr.com/posts/chokidar-3-save-32tb-of-traffic/) of [`chokidar@3.0.0`](https://github.com/paulmillr/chokidar), and the [subsequent](https://github.com/paulmillr/chokidar/issues/873) [long](https://github.com/paulmillr/chokidar/issues/860) [list](https://github.com/paulmillr/chokidar/issues/871) of [new bugs](https://github.com/paulmillr/chokidar/issues/865) which affected some of [my projects](https://github.com/catdad/electronmon), I decided to take a look at the issue of watching files. Long story short, [`watchboy`](https://github.com/catdad/watchboy) was born and he's magnificent!

To make sure that he's doing a good job watching after your files, I created this benchmark suite. While I wrote and ran it, I am making it available to everyone so that you can check my work. Feel free to run it and submit more test cases that you want to see compared. With that said, let's talk about results.

_Note: all memory measurements were taken after garbage collection._

## Test machines

Tests are run in Azure Pipelines, for repeatability. The following specs are used (I will simply be referring to these machines as Windows, Linux and MacOS below):

### Windows

* Microsoft Windows Server 2019 Datacenter
* Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz
* 2 cores

### Linux

* Ubuntu 16.04.6 LTS
* Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz
* 2 cores

### MacOS

* macOS 10.14.6
* Intel(R) Xeon(R) CPU E5-1650 v2 @ 3.50GHz
* 4 cores

## Typical large install of `node_modules`

After installing some heavyweight node modules, including ones like `jest` and `babel`, I ended up with roughly 6400 files in 400 directories. I decided to start this benchmark at that size, using a repeatable folder structure and controlled files.

### Windows

| Library    |  Ready Rn  |  Retained Heap  |  Retained RSS  |
| ---        | ---:       | ---:            | ---:           |
| `chokidar` | 3362 ms | 88.3 MB |  138 MB |  115 MB |
| `gaze`     | 3255 ms | 51.1 MB | 74.3 MB | 49.9 MB |
| `watchboy` |  760 ms | 29.1 MB | 44.8 MB | 22.3 MB |

**_Test machine_: Ubuntu 16.04.6, running an Intel Core Processor (Broadwell, IBRS) CPU @ 2.60GHz, 2 cores**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 1562 ms | 78.9 MB |  115 MB | 81.2 MB |
| `gaze`     | 1067 ms | 51.7 MB | 68.3 MB | 32.7 MB |
| `watchboy` |  840 ms | 28 MB   | 55.9 MB | 22.7 MB |

**_Test machine_: MacOS 10.13, running Intel(R) Xeon(R) CPU E5-2697 v2 @ 2.70GHz, 2 cores**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` |  748 ms | 49 MB   | 73.9 MB | 44.9 MB |
| `gaze`     | 2129 ms | 51.7 MB | 73.5 MB | 41.6 MB |
| `watchboy` | 1215 ms | 29.1 MB | 55.3 MB | 26.7 MB |

## Watching a medium directory

A much more typical project -- think monorepo -- when watching only project files without dependencies can be around 320 files in 20 directories. I simulated that as well in a similar manner.

**_Test machine_: Windows 10, running an Intel(R) Core(TM) i5-3570K CPU @ 3.40GHz with 4 cores**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 240 ms | 19.1 MB | 34.0 MB | 11.4 MB |
| `gaze`     | 245 ms | 17.6 MB | 28.7 MB | 4.42 MB |
| `watchboy` |  85 ms | 17.5 MB | 27.7 MB | 5.09 MB |

**_Test machine_: Ubuntu 18.04, running an Intel Core Processor (Broadwell, IBRS) CPU @ 2.60GHz with 2 cores**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 165 ms | 17.5 MB | 44 MB   | 9.76 MB |
| `gaze`     | 176 ms | 17.1 MB | 40.3 MB | 4.74 MB |
| `watchboy` |  90 ms | 17 MB   | 38.8 MB | 5.64 MB |

**_Test machine_: MacOS 10.13, running Intel(R) Xeon(R) CPU E5-2697 v2 @ 2.70GHz, 2 cores**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` |  69 ms | 16.5 MB | 32.7 MB | 3.58 MB |
| `gaze`     | 266 ms | 17.6 MB | 36.3 MB | 4.37 MB |
| `watchboy` | 166 ms | 18.6 MB | 41.4 MB | 12.7 MB |

## Memory footprint

This one is more for fun, but I wanted to see how much memory is needed to simply require each module and have it be present at runtime. Here's the breakdown:

| Library    | Windows size | Linux size | MacOS size |
| ---------- | ---: | ---: | ---: |
| `chokidar` | 1.83 MB | 1.72 MB | 2.11 MB |
| `gaze`     | 3.49 MB | 2.38 MB | 4.92 MB |
| `watchboy` | 1.56 MB | 467 kB  | 2.20 MB |

## Download size

An extension of the footprint, this metric measures how many files are installed as a result of each dependency, as well as the total size of each dependency.

| Library | Packages | Directories | Files | Total size |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` (Windows) | 14 | 18 | 78   | 338 kB |
| `chokidar` (MacOS)   | 15 | 19 | 83   | 373 kB |
| `gaze`               | 14 | 19 | 1111 | 1.6 MB |
| `watchboy`           | 14 | 17 | 81   | 346 kB |

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
