Easiest install for recipients (macOS)

Option A — one-line (recommended for power users):

    curl -fsSL https://raw.githubusercontent.com/Opistorh/vitaoil_price_generator/main/quick-start.command | bash

This downloads and runs the installer script directly from the repository. It will:
- install Homebrew (if missing)
- install git and node via Homebrew (if missing)
- clone the repo to ~/.vitaoil-price
- run npm install
- create a `VitaOil Price Generator.command` shortcut on the Desktop

Option B — ZIP/TAR for non-curl users (recommended for general users):

1. Download `vitaoil-quick.tar.gz` or `vitaoil-quick.zip`.
2. Unpack: `tar xzf vitaoil-quick.tar.gz` or open the zip from Finder.
3. In Terminal (after unpack):

    cd path/to/unpacked
    chmod +x quick-start.command
    open quick-start.command

Notes for the sender
- Prefer `tar.gz` to preserve executable bits when possible.
- If you send the raw `.command` or a binary, macOS Gatekeeper may label it as "damaged" unless code-signed and notarized.
- To avoid Gatekeeper issues, distribute a tarball or use the curl|bash method.

Security
- If your repo is private, provide a personal access token or host the `quick-start.command` in a place accessible to the recipient.
- Review the install script before running it. Users can inspect the script with `curl -fsSL <url>` without piping to `bash`.
