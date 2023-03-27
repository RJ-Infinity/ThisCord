![logo](https://raw.githubusercontent.com/RJ-Infinity/ThisCord/master/thiscordbanner.png)

## ALPHA VERSION
### How to install ThisCord:
> 1. go to https://github.com/TitusHM/ThisCord-Installer/releases, and download the latest installer release
> 2. open the installer and press "Install Thiscord" button
> 3. open discord and thiscord should automatically attach
### NOTE
not tested with other discord mods so it might not work with then


#### wasm suport removed
this is because the api for fetching wasm is available to the script creator to use if they want by
just using the `WebAssembly.instantiateStreaming` module but with `ThisCord.fetchScript` instead of
`fetch` and then they can pass what exactly is needed to the wasm module however with the implimentation
that it had it didnt have enough access to the ThisCord object making it hard to develop for
