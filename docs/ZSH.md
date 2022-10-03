# ZSH

Z Shell (ZSH) is used on many systems. This document describes how ZSH is used
in this project.

## Overview

## [Intro][1]

## Install

[Homebrew][2] is used to manage packages for macOS and Linux machines.

To install `zsh`, run:

```bash
brew bundle --file ./Brewfile
```

## Oh My Zsh

[Oh My Zsh][3] is used to manage ZSH configurations.

Run the script below to use `flex-development/ohmyzsh`:

```bash
# startup files location
ZDOTDIR=$HOME/.config/zsh

# install ohmyzsh
# https://github.com/ohmyzsh/ohmyzsh#advanced-installation
REPO=flex-development/ohmyzsh sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc

# add system-wide .zshenv file
echo '# System-wide .zshenv file for zsh(1).
#
# Sourced on all invocations of the shell, unless the -f option is set.
#
# It should contain commands to set the command search path, as well as other
# important environment variables. It should not contain commands that produce
# output or assume the shell is attached to a tty.
#
# Global Order: zshenv, zprofile, zshrc, zlogin
#
# See: https://zsh.sourceforge.io/Intro/intro_3.html
# Set zsh startup files location
export ZDOTDIR=$ZDOTDIR' >> zshenv && sudo mv zshenv /etc

# backup existing .zshrc
mv $ZDOTDIR/.zshrc $ZDOTDIR/.zshrc.pre-oh-my-zsh || true

# add new .zshrc
cp $ZSH/templates/zshrc.zsh-template $ZDOTDIR/.zshrc

# add .zprofile
# see: https://github.com/flex-development/ohmyzsh/tree/master/templates/zprofile.apple-silicon.zsh-template
# see: https://github.com/flex-development/ohmyzsh/tree/master/templates/zprofile.macos-intel.zsh-template
touch $ZDOTDIR/.zprofile

# add environment file
# see: https://github.com/flex-development/ohmyzsh/tree/master/templates/zshenv.zsh-template
touch $ZDOTDIR/.zshenv

# set hostname
sudo hostname $HOST && sudo scutil --set HostName $HOST && sudo scutil --set LocalHostName $HOST

# install trash-cli (aliased to rm in ohmyzsh configuration)
# https://github.com/sindresorhus/trash-cli
yarn global add trash-cli

# reset shell
reset
```

[1]: https://zsh.sourceforge.io/Intro/intro_toc.html
[2]: https://brew.sh
[3]: https://github.com/ohmyzsh/ohmyzsh
