# Wikipedia for Yomitan

A conversion of the [DBPedia](https://dbpedia.org/) short-abstract dumps of
[Wikipedia](https://wikipedia.org/) for
[Yomitan](https://github.com/themoeway/yomitan) (formerly
[Yomichan](https://foosoft.net/projects/yomichan/)). The dictionaries feature
most of that language's Wikipedia, with each entry containing the abstract and a
link to the Wikipedia article. Unfortunately there are no dumps of DBPedia after
December 2022, so regular updates will not be possible until DBPedia starts
updating again.

Built using
[yomichan-dict-builder](https://github.com/MarvNC/yomichan-dict-builder). For
more Yomitan dictionaries and tools, see
[Yomichan Dictionaries](https://github.com/MarvNC/yomichan-dictionaries).

## Download

[![](https://img.shields.io/github/v/tag/marvnc/wikipedia-yomitan?style=for-the-badge&label=Download%20Latest)](https://github.com/MarvNC/wikipedia-yomitan/releases/latest)

Get the latest version from the
[releases page](https://github.com/MarvNC/wikipedia-yomitan/releases/latest).

<!-- prettier-ignore -->
> [!WARNING] 
> These dictionaries are quite large and may use 5x of the
> original zip file size after being imported to Yomitan.

## Supported Languages

| Language                      | Wiki                           | Entries |
| ----------------------------- | ------------------------------ | ------- |
| Arabic (العربية)              | [ar](https://ar.wikipedia.org) | 1162853 |
| Basque (Euskara)              | [eu](https://eu.wikipedia.org) | 390609  |
| Catalan (Català)              | [ca](https://ca.wikipedia.org) | 679999  |
| Chinese (中文)                | [zh](https://zh.wikipedia.org) | 1249877 |
| Czech (Čeština)               | [cs](https://cs.wikipedia.org) | 489997  |
| Dutch (Nederlands)            | [nl](https://nl.wikipedia.org) | 1999971 |
| Esperanto (Esperanto)         | [eo](https://eo.wikipedia.org) | 299996  |
| French (Français)             | [fr](https://fr.wikipedia.org) | 2309295 |
| German (Deutsch)              | [de](https://de.wikipedia.org) | 2399998 |
| Greek (Ελληνικά)              | [el](https://el.wikipedia.org) | 199999  |
| Hungarian (Magyar)            | [hu](https://hu.wikipedia.org) | 469999  |
| Indonesian (Bahasa Indonesia) | [id](https://id.wikipedia.org) | 609999  |
| Irish (Gaeilge)               | [ga](https://ga.wikipedia.org) | 54423   |
| Italian (Italiano)            | [it](https://it.wikipedia.org) | 1629999 |
| Japanese (日本語)             | [ja](https://ja.wikipedia.org) | 1279999 |
| Korean (한국어)               | [ko](https://ko.wikipedia.org) | 529999  |
| Polish (Polski)               | [pl](https://pl.wikipedia.org) | 1439992 |
| Portuguese (Português)        | [pt](https://pt.wikipedia.org) | 1049999 |
| Russian (Русский)             | [ru](https://ru.wikipedia.org) | 1672218 |
| Spanish (Español)             | [es](https://es.wikipedia.org) | 1689995 |
| Swedish (Svenska)             | [sv](https://sv.wikipedia.org) | 2449999 |
| Ukrainian (Українська)        | [uk](https://uk.wikipedia.org) | 1129999 |

Note that English is not included as the exported file is too large and does not
work in Yomitan. I suggest using an extension such as Wikiwand for English
Wikipedia popups.

## Screenshots

![chrome_First_Love_初恋_-_Wikiwand_-_Google_Chrome_2023-12-17_14-49-50](https://github.com/MarvNC/wikipedia-yomitan/assets/17340496/29c2d99a-ea26-4702-8bef-5c57ac37ece7)
![chrome_Silent_(テレビドラマ)_-_Wikiwand_-_Google_Chrome_2023-12-17_14-31-07](https://github.com/MarvNC/wikipedia-yomitan/assets/17340496/194dd4ca-c833-4cfd-9127-95a16669e445)
![chrome_维基百科，自由的百科全书_-_Google_Chrome_2023-12-19_17-41-33](https://github.com/MarvNC/wikipedia-yomitan/assets/17340496/8c6b0eda-d58d-4102-b1dc-e9934fb239d8)

## License

The code in this repository is licensed under the MIT license.

## Dev

This project uses bun.

To download and build a dictionary, run:

```sh
bun run start -l ja -d 2022-12-01
```

where `ja` is the language code and `2022.12.01` is the date of the dump (there
are no newer DBPedia versions).

To download and build all available languages, run:

```sh
bun run start -a
```

If you want to export a minimal dictionary with 1000 lines for testing, set an
environment variable:

```sh
NODE_ENV=dev
```
