To make thiscord work with a custom install location of discord you will need to paste this command into command prompt in admin mode, replace "YOUR_INSTALL_LOCATION" with the path to your discord install.
The folder that you choose should have an "Update.exe" inside of it.
`mklink /j %LOCALAPPDATA%/Discord  YOUR_DISCORD_DIRECTORY`
