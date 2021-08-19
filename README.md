# Scripts

## Prerequisites

In order for the scripts to run, the folder structure should be as:

```sh
$HOME
 └── Documents
      ├── additio-core
      └── additio-web
``` 

> The scripts are written in a `zsh` shell which is highly recommended over bash.

## `bundle.sh`

Bundles all packages from `additio-core` and copies them to the `additio/app` and `additio/centers`
folders. 

## `upd-core.sh`

Updates to the given version the (if higher than the actual) `additio-core` package (or repository,
as it uses bower). `bower` output is supressed by passing the `--quiet` flag, which will display
warnings or errors.

