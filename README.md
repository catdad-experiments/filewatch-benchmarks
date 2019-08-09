# file watching benchmarks

With the [fanfare surrounding the release](https://paulmillr.com/posts/chokidar-3-save-32tb-of-traffic/) of [`chokidar@3.0.0`](https://github.com/paulmillr/chokidar), and the [subsequent](https://github.com/paulmillr/chokidar/issues/873) [long](https://github.com/paulmillr/chokidar/issues/860) [list](https://github.com/paulmillr/chokidar/issues/871) of [new bugs](https://github.com/paulmillr/chokidar/issues/865) which affected some of [my projects](https://github.com/catdad/electronmon), I decided to take a look at the issue of watching files. Long story short, [`watchboy`](https://github.com/catdad/watchboy) was born and he's magnificent!

To make sure that he's doing a good job watching after your files, I created this benchmark suite. While I wrote and ran it, I am making it available to everyone so that you can check my work. Feel free to run it and submit more test cases that you want to see compared. With that said, let's talk about results:

## Watching a large directory

After installing some heavyweight node modules like jest, babel, and some others, I ended up with roughly 6400 files in 400 directories. I decided to start this benchmark at that size, using a repeatable folder structure and controlled files.

**_Test machine_: Windows 10, running an Intel(R) Core(TM) i5-3570K CPU @ 3.40GHz with 4 cores.**

| Library | Time to ready | Heap memory (after GC) | RSS memory (after GC) | Retained memory (after GC) |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 2960 ms | 94093312 | 144220160 | 120467456 |
| `gaze`     | 3019 ms | 52195328 |  77991936 |  50102272 |
| `watchboy` | 1944 ms | 52674560 | 101081088 |  74854400 |

**_Test machine_: Ubuntu 18.04, running an Intel Core Processor (Broadwell, IBRS) CPU @ 2.60GHz with 2 cores.**

| Library | Time to ready | Heap memory (after GC) | RSS memory (after GC) | Retained memory (after GC) |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 1465 ms | 80986112 | 116125696 | 82251776 |
| `gaze`     |  952 ms | 51146752 |  66297856 | 31518720 |
| `watchboy` |  822 ms | 51101696 |  84873216 | 48832512 |

## Watching a medium directory

A much more typical project -- think monorepo -- when watching only project files without dependencies can be around 320 files in 20 directories. I simulated that as well in a similar manner.

**_Test machine_: Windows 10, running an Intel(R) Core(TM) i5-3570K CPU @ 3.40GHz with 4 cores.**

| Library | Time to ready | Heap memory (after GC) | RSS memory (after GC) | Retained memory (after GC) |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 235 ms | 28557312 | 34816000 | 12230656 |
| `gaze`     | 239 ms | 19165184 | 32854016 |  4784128 |
| `watchboy` | 120 ms | 18595840 | 30732288 |  4575232 |

**_Test machine_: Ubuntu 18.04, running an Intel Core Processor (Broadwell, IBRS) CPU @ 2.60GHz with 2 cores.**

| Library | Time to ready | Heap memory (after GC) | RSS memory (after GC) | Retained memory (after GC) |
| --- | ---: | ---: | ---: | ---: |
| `chokidar` | 120 ms | 17547264 | 44220416 | 10330112 |
| `gaze`     | 162 ms | 17068032 | 39022592 |  4284416 |
| `watchboy` |  63 ms | 17022976 | 39690240 |  3543040 |
