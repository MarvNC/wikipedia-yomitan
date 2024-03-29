# Wikipedia for Yomichan/Yomitan

A conversion of the [DBPedia](https://dbpedia.org/) short-abstract dumps of
[Wikipedia](https://wikipedia.org/) for
[Yomitan](https://github.com/themoeway/yomitan)/[Yomichan](https://foosoft.net/projects/yomichan/).
The dictionaries feature most of that language's Wikipedia, with each entry
containing the abstract and a link to the Wikipedia article. Unfortunately there
are no dumps of DBPedia after December 2022, so regular updates will not be
possible until DBPedia starts updating again.

Built using
[yomichan-dict-builder](https://github.com/MarvNC/yomichan-dict-builder). For
more Yomitan dictionaries and tools, see
[Yomichan Dictionaries](https://github.com/MarvNC/yomichan-dictionaries).

## Download

- **[Download JA Wikipedia for Yomitan](https://drive.google.com/open?id=14aNH8TeVDIk_EeW1zh4Os8VN7smK4vPd&usp=drive_fs)**
  (~1.2M entries)
  - **Last updated 2024-01-06: v1.4.0** (Better readings parsing)
- **[Download ZH Wikipedia for Yomitan](https://drive.google.com/open?id=14ZECT8FVl0KjxV3JPhzgdmIV8GEgx5ht&usp=drive_fs)**
  (~1.2M entries)
  - **Last updated 2023-12-21: v1.1.0**

## Usage

Recommended custom CSS to add to the `Configure custom CSS…` section of the
options page:

```css
/* Wikipedia */
div.gloss-sc-div[data-sc-wikipedia='term-specifier'] {
  color: #e5007f;
}
```

<!-- prettier-ignore -->
> [!CAUTION]
> Due to the size of the dictionaries, there are currently issues
> with being unable to delete the dictionaries from Yomichan. The issue is
> [fixed in Yomitan 23.12.29](https://github.com/themoeway/yomitan/pull/382),
> so I recommend installing Yomitan if you haven't already.

<!-- prettier-ignore -->
> [!IMPORTANT] 
> These dictionaries are quite large and may use up to 1GB of
> storage space after being imported.

## Screenshots

![chrome_First_Love_初恋_-_Wikiwand_-_Google_Chrome_2023-12-17_14-49-50](https://github.com/MarvNC/wikipedia-yomitan/assets/17340496/29c2d99a-ea26-4702-8bef-5c57ac37ece7)
![chrome_Silent_(テレビドラマ)_-_Wikiwand_-_Google_Chrome_2023-12-17_14-31-07](https://github.com/MarvNC/wikipedia-yomitan/assets/17340496/194dd4ca-c833-4cfd-9127-95a16669e445)
![chrome_维基百科，自由的百科全书_-_Google_Chrome_2023-12-19_17-41-33](https://github.com/MarvNC/wikipedia-yomitan/assets/17340496/8c6b0eda-d58d-4102-b1dc-e9934fb239d8)

## License

The code in this repository is licensed under the MIT license.
