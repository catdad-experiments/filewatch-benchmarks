# file watching benchmarks

[![Travis Build Status](https://travis-ci.com/catdad-experiments/filewatch-benchmarks.svg?branch=master)](https://travis-ci.com/catdad-experiments/filewatch-benchmarks)
[![Azure Pipelines Build Status](https://dev.azure.com/vatev1/filewatch-benchmarks/_apis/build/status/catdad-experiments.filewatch-benchmarks?branchName=master)](https://dev.azure.com/vatev1/filewatch-benchmarks/_build/latest?definitionId=1&branchName=master)

With the [fanfare surrounding the release](https://paulmillr.com/posts/chokidar-3-save-32tb-of-traffic/) of [`chokidar@3.0.0`](https://github.com/paulmillr/chokidar), and the [subsequent](https://github.com/paulmillr/chokidar/issues/873) [long](https://github.com/paulmillr/chokidar/issues/860) [list](https://github.com/paulmillr/chokidar/issues/871) of [new bugs](https://github.com/paulmillr/chokidar/issues/865) which affected some of [my projects](https://github.com/catdad/electronmon), I decided to take a look at the issue of watching files. Long story short, [`watchboy`](https://github.com/catdad/watchboy) was born and he's magnificent!

To make sure that he's doing a good job watching after your files, I created this benchmark suite. While I wrote and ran it, I am making it available to everyone so that you can check my work. Feel free to run it and submit more test cases that you want to see compared. With that said, let's talk about results.

_Note: all memory measurements were taken after garbage collection._

## Watching a large directory

After installing some heavyweight node modules like jest, babel, and some others, I ended up with roughly 6400 files in 400 directories. I decided to start this benchmark at that size, using a repeatable folder structure and controlled files.

**_Test machine_: Windows 10, running an Intel(R) Core(TM) i5-3570K CPU @ 3.40GHz with 4 cores.**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 3362 ms | 88.3 MB |  138 MB |  115 MB |
| `gaze`     | 3255 ms | 51.1 MB | 74.3 MB | 49.9 MB |
| `watchboy` |  760 ms | 29.1 MB | 44.8 MB | 22.3 MB |

**_Test machine_: Ubuntu 18.04, running an Intel Core Processor (Broadwell, IBRS) CPU @ 2.60GHz with 2 cores.**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 1562 ms | 78.9 MB |  115 MB | 81.2 MB |
| `gaze`     | 1067 ms | 51.7 MB | 68.3 MB | 32.7 MB |
| `watchboy` |  840 ms | 28 MB   | 55.9 MB | 22.7 MB |

## Watching a medium directory

A much more typical project -- think monorepo -- when watching only project files without dependencies can be around 320 files in 20 directories. I simulated that as well in a similar manner.

**_Test machine_: Windows 10, running an Intel(R) Core(TM) i5-3570K CPU @ 3.40GHz with 4 cores.**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 240 ms | 19.1 MB | 34.0 MB | 11.4 MB |
| `gaze`     | 245 ms | 17.6 MB | 28.7 MB | 4.42 MB |
| `watchboy` |  85 ms | 17.5 MB | 27.7 MB | 5.09 MB |

**_Test machine_: Ubuntu 18.04, running an Intel Core Processor (Broadwell, IBRS) CPU @ 2.60GHz with 2 cores.**

| Library | Time to ready | Heap memory | RSS memory | Retained memory |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 165 ms | 17.5 MB | 44 MB   | 9.76 MB |
| `gaze`     | 176 ms | 17.1 MB | 40.3 MB | 4.74 MB |
| `watchboy` |  90 ms | 17 MB   | 38.8 MB | 5.64 MB |

## Memory footprint

This one is more for fun, but I wanted to see how much memory is needed to simply require each module and have it be present at runtime. Here's the breakdown:

| Library | Module size |
| --- | ---: |
| `chokidar` (Windows) | 1.83 MB |
| `chokidar` (Linux)   | 1.72 MB |
| `gaze` (Windows)     | 3.49 MB |
| `gaze` (Linux)       | 2.38 MB |
| `watchboy` (Windows) | 1.56 MB |
| `watchboy` (Linux)   | 467 kB  |

## Download size

An extension of the footprint, this metric measures how many files are installed as a result of each dependency, as well as the total size of each dependency.

| Library | Packages | Directories | Files | Total size |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` (Windows) | 14 | 18 | 78   | 338 kB |
| `chokidar` (MacOS)   | 15 | 19 | 83   | 373 kB |
| `gaze`               | 14 | 19 | 1111 | 1.6 MB |
| `watchboy`           | 14 | 17 | 81   | 346 kB |
