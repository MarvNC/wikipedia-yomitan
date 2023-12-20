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
> with being unable to delete the dictionaries from Yomitan. This may be fixed
> soon, but in the meantime you will have to delete it by clicking the 'Delete
> All' button.

<!-- prettier-ignore -->
> [!IMPORTANT] 
> These dictionaries are quite large and may use up to 1GB of
> storage space after being imported.

## Download

- **[Download JA Wikipedia for Yomitan](https://drive.google.com/open?id=12cNjVi6jl7t-7YR3Prleg9jqqBSlZ1e6&usp=drive_fs)**
  (~1.2M entries)
- **[Download ZH Wikipedia for Yomitan](https://drive.google.com/open?id=14VIQE88lyJaIp75nRi7w4Rva-zG1Yvta&usp=drive_fs)**
  (~1.2M entries)

## Screenshots

## License

The code in this repository is licensed under the MIT license.
