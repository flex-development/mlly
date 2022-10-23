# ENVIRONMENT VARIABLES - ZSH
#
# References:
#
# - https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv

NODE_NO_WARNINGS=1
VITEST_SEGFAULT_RETRY=3

[ -f $PWD/docs/.vitepress/.env.local ] && source $PWD/docs/.vitepress/.env.local
